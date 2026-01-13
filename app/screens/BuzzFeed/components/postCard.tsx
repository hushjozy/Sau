import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { timeAgo } from "@/lib/time";
import { IMG_URL } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { router } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { useUser } from "@/provider/UserProvider";
import { useSaveComment } from "../hooks/useSaveComment";
import { useSaveLike } from "../hooks/useSaveLike";
import { useBuzzFeed } from "../hooks/useBuzzFeed";
import { LikesModal } from "./likesModal";
import { LikeDto } from "@/services/models/likeDto";

const { width, height } = Dimensions.get("window");

interface PostCardProps {
  post: any;
  disableNavigation?: boolean;
}

export function PostCard({ post, disableNavigation = false }: PostCardProps) {
  const { user } = useUser();
  const { save: saveComment, loading: commentLoading, error } = useSaveComment();
  const { toggleLike, fetchLikes, loading: likeLoading } = useSaveLike();
  const { updatePostCommentCount } = useBuzzFeed();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(post?.commentCount ?? 0);
  
  // Like states
  const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeId, setCurrentLikeId] = useState<number | undefined>();
  const [likes, setLikes] = useState<LikeDto[]>([]);
  const [likesModalVisible, setLikesModalVisible] = useState(false);

  const videoRefs = useRef<(Video | null)[]>([]);
  const media = post?.mediaFiles ?? [];

  // Check if current user has liked the post
  useEffect(() => {
    const loadLikes = async () => {
      if (post?.reference) {
        const postLikes = await fetchLikes(post.reference);
        setLikes(postLikes);
        
        // Check if current user has liked
        const userLike = postLikes.find(
          (like) => like.likerEmail === user?.email
        );
        
        if (userLike) {
          setIsLiked(true);
          setCurrentLikeId(userLike.id);
        }
      }
    };

    loadLikes();
  }, [post?.reference, user?.email]);

  // Get appropriate avatar image based on post type
  const getAvatarImage = () => {
    if (post.isAppreciationPost && post.awardId) {
      return { uri: `${IMG_URL.imgUrl}${post.awardImageUrl}` };
    }
    if (!post.isAppreciationPost && post.awardId) {
      return { uri: `${IMG_URL.imgUrl}${post.awardImageUrl}` };
    }
    if (!post.isAppreciationPost && post.appreciationType === "Cash Gift") {
      return require("./../../../../assets/images/cashgiftlogo.png");
    }
    if (!post.isAppreciationPost && !post.awardId && post.appreciationType !== "Cash Gift") {
      return require("./../../../../assets/images/postlogo.png");
    }
    return { uri: "https://placekitten.com/100/100" };
  };

  // Render header text based on post type
  const renderHeaderText = () => {
    if (post.isAppreciationPost) {
      return (
        <View style={styles.headerTextRow}>
          <Text style={styles.headerName}>{post.receiverName}</Text>
          <Text style={styles.headerNormal}> received </Text>
          <Text style={styles.headerHighlight}>{post.appreciationType}</Text>
          <Text style={styles.headerNormal}> from </Text>
          <Text style={styles.headerName}>{post.senderName}</Text>
        </View>
      );
    }

    if (post.appreciationType === "Cash Gift") {
      return (
        <View style={styles.headerTextRow}>
          <Text style={styles.headerName}>{post.receiverName}</Text>
          <Text style={styles.headerNormal}> received </Text>
          <Text style={styles.headerHighlight}>{post.appreciationType}</Text>
          <Text style={styles.headerNormal}> from </Text>
          <Text style={styles.headerName}>{post.senderName}</Text>
        </View>
      );
    }

    if (!post.isAppreciationPost && post.awardId) {
      return (
        <View style={styles.headerTextRow}>
          <Text style={styles.headerName}>{post.receiverName}</Text>
          <Text style={styles.headerNormal}> received </Text>
          <Text style={styles.headerHighlight}>{post.appreciationType}</Text>
          <Text style={styles.headerNormal}> from </Text>
          <Text style={styles.headerName}>{post.senderName}</Text>
        </View>
      );
    }

    return (
      <View style={styles.headerTextRow}>
        <Text style={styles.headerName}>{post.senderName}</Text>
        <Text style={styles.headerNormal}> posted</Text>
      </View>
    );
  };

  /** 🔹 Stop all videos & close modal */
  const closePreview = async () => {
    for (const ref of videoRefs.current) {
      if (ref) {
        await ref.stopAsync();
      }
    }
    setPreviewVisible(false);
  };

  /** 🔹 Handle like/unlike */
  const handleLikeToggle = async () => {
    if (!user?.email || !user?.fullname) {
      Alert.alert("Error", "Please log in to like posts");
      return;
    }

    if (!post?.reference) return;

    const payload = {
      postReference: post.reference,
      commentReference: "",
      likerName: user.fullname,
      likerEmail: user.email,
      likerPosition: user.functionName || "",
      isOnPost: true,
    };

    // Optimistic update
    const previousLiked = isLiked;
    const previousLikeId = currentLikeId;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const result = await toggleLike(payload, currentLikeId);
      
      if (result) {
        // Liked
        setCurrentLikeId(result.id);
        setLikes((prev) => [...prev, result]);
      } else {
        // Unliked
        setCurrentLikeId(undefined);
        setLikes((prev) => prev.filter((like) => like.id !== previousLikeId));
      }
    } catch (err: any) {
      // Revert on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      setCurrentLikeId(previousLikeId);
      
      Alert.alert("Error", err.message || "Failed to update like");
    }
  };

  /** 🔹 Show likes list */
  const handleShowLikes = async () => {
    if (!post?.reference) return;
    
    const postLikes = await fetchLikes(post.reference);
    setLikes(postLikes);
    setLikesModalVisible(true);
  };

  /** 🔹 Submit comment */
  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Comment cannot be empty");
      return;
    }

    if (!user?.email || !user?.fullname) {
      Alert.alert("Error", "User information is missing");
      return;
    }

    if (!post?.reference) {
      Alert.alert("Error", "Post reference is missing");
      return;
    }

    const payload = {
      commenterEmail: user.email,
      commenterName: user.fullname,
      content: comment.trim(),
      commentReference: "",
      postReference: post.reference,
      isOnPost: true,
      mentions: [],
    };

    try {
      await saveComment(payload);

      setComment("");
      setCommentCount((prev: number) => prev + 1);
      updatePostCommentCount(post.reference, 1);
      
      Alert.alert("Success", "Comment posted successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to post comment. Please try again.");
    }
  };

  /** 🔹 Media renderer */
  const renderMedia = ({ item, index }: { item: any; index: number }) => {
    const uri = IMG_URL.imgUrl + item.mediaUrl;

    if (item.mediaType === "video") {
      return (
        <View style={styles.mediaWrapper}>
          <Video
            ref={(ref) => {
              videoRefs.current[index] = ref;
            }}
            source={{ uri }}
            style={styles.media}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
          />
        </View>
      );
    }

    return <Image source={{ uri }} style={styles.media} resizeMode="cover" />;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.card}>
        <Pressable
          onPress={() => {
            if (!disableNavigation) {
              router.push({
                pathname: "/screens/BuzzFeed/[reference]",
                params: { reference: post.reference },
              });
            }
          }}
          disabled={disableNavigation}
        >
          <View style={styles.header}>
            <Image source={getAvatarImage()} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              {renderHeaderText()}
              <Text style={styles.time}>{timeAgo(post.createdDate)}</Text>
            </View>
          </View>

          <Text style={styles.message}>{post.message}</Text>
        </Pressable>

        {/* MEDIA */}
        {media.length > 0 && (
          <>
            <Pressable onPress={() => setPreviewVisible(true)}>
              <FlatList
                data={media}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_: unknown, i: number) => i.toString()}
                renderItem={renderMedia}
                snapToInterval={width - 32}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / (width - 32)
                  );
                  setActiveIndex(index);
                }}
              />
            </Pressable>

            {media.length > 1 && (
              <View style={styles.dots}>
                {media.map((_: unknown, i: number) => (
                  <View
                    key={i}
                    style={[styles.dot, i === activeIndex && styles.activeDot]}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* FULLSCREEN PREVIEW */}
        <Modal visible={previewVisible} animationType="fade">
          <View style={styles.modalRoot}>
            <Pressable onPress={closePreview} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#fff" />
            </Pressable>

            <FlatList
              data={media}
              horizontal
              pagingEnabled
              initialScrollIndex={activeIndex}
              getItemLayout={(_: unknown, index: number) => ({
                length: width,
                offset: width * index,
                index,
              })}
              keyExtractor={(_: unknown, i: number) => i.toString()}
              renderItem={({ item, index }) =>
                item.mediaType === "video" ? (
                  <Video
                    ref={(ref) => {
                      videoRefs.current[index] = ref;
                    }}
                    source={{ uri: IMG_URL.imgUrl + item.mediaUrl }}
                    style={styles.fullMedia}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                  />
                ) : (
                  <Image
                    source={{ uri: IMG_URL.imgUrl + item.mediaUrl }}
                    style={styles.fullMedia}
                    resizeMode="contain"
                  />
                )
              }
            />
          </View>
        </Modal>

        {/* COMMENT INPUT */}
        <View style={styles.commentBox}>
          <TextInput
            placeholder="Write a comment…"
            value={comment}
            onChangeText={setComment}
            style={styles.commentInput}
            multiline
            editable={!commentLoading}
          />
          <Pressable
            onPress={handleSubmitComment}
            disabled={commentLoading || !comment.trim()}
            style={styles.sendBtn}
          >
            <Ionicons
              name="send"
              size={18}
              color={comment.trim() && !commentLoading ? "#2563EB" : "#9CA3AF"}
            />
          </Pressable>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Pressable
            style={styles.action}
            onPress={handleLikeToggle}
            disabled={likeLoading}
          >
            <Ionicons
              name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={16}
              color={isLiked ? "#2563EB" : "#6B7280"}
            />
            <Pressable onPress={handleShowLikes}>
              <Text style={[styles.actionText, isLiked && styles.actionTextLiked]}>
                {likeCount}
              </Text>
            </Pressable>
          </Pressable>

          <Pressable
            style={styles.action}
            onPress={() => {
              if (!disableNavigation) {
                router.push({
                  pathname: "/screens/BuzzFeed/[reference]",
                  params: { reference: post.reference },
                });
              }
            }}
            disabled={disableNavigation}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
            <Text style={styles.actionText}>{commentCount} Comments</Text>
          </Pressable>
        </View>
      </View>

      {/* Likes Modal */}
      <LikesModal
        visible={likesModalVisible}
        onClose={() => setLikesModalVisible(false)}
        likes={likes}
        loading={likeLoading}
      />
    </KeyboardAvoidingView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    backgroundColor: "#F3F4F6",
  },
  headerTextRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 2,
  },
  headerName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#111827",
  },
  headerNormal: {
    fontSize: 14,
    color: "#6B7280",
  },
  headerHighlight: {
    fontWeight: "600",
    fontSize: 14,
    color: "#2563EB",
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
  },
  message: {
    marginVertical: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  mediaWrapper: {
    width: width - 32,
  },
  media: {
    width: width - 32,
    height: 220,
    borderRadius: 12,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#2563EB",
  },
  modalRoot: {
    flex: 1,
    backgroundColor: "black",
  },
  fullMedia: {
    width,
    height,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    fontSize: 13,
    paddingVertical: 6,
  },
  sendBtn: {
    padding: 6,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#6B7280",
  },
  actionTextLiked: {
    color: "#2563EB",
    fontWeight: "600",
  },
});