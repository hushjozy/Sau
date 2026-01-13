import { useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { usePostComments } from "./hooks/usePostComments";
import { useBuzzFeed } from "./hooks/useBuzzFeed";
import { PostCard } from "./components/postCard";
import { useUser } from "@/provider/UserProvider";
import { useSaveComment } from "./hooks/useSaveComment";
import { CommentDto } from "@/services/models/commentDto";

export default function PostDetailScreen() {
  const { reference } = useLocalSearchParams<{ reference: string }>();
  const { comments: fetchedComments, refetch: refetchComments } = usePostComments(reference);
  const { posts, updatePostCommentCount } = useBuzzFeed();
  const { user } = useUser();
  const { save, loading } = useSaveComment();

  const [comment, setComment] = useState("");
  const [displayComments, setDisplayComments] = useState<CommentDto[]>([]);

  const post = posts.find((p) => p.reference === reference);

  // Update display comments when fetched comments change
  useEffect(() => {
    setDisplayComments(fetchedComments || []);
  }, [fetchedComments]);

  const handleSendComment = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Comment cannot be empty");
      return;
    }

    if (!user?.email || !user?.fullname) {
      Alert.alert("Error", "User information is missing");
      return;
    }

    if (!reference) {
      Alert.alert("Error", "Post reference is missing");
      return;
    }

    const payload = {
      commenterEmail: user.email,
      commenterName: user.fullname,
      content: comment.trim(),
      commentReference: "",
      postReference: reference,
      isOnPost: true,
      mentions: [],
    };
    // Create optimistic comment
    const tempId = `temp-${Date.now()}`;
    const optimisticComment: CommentDto = {
      reference: tempId,
      content: comment.trim(),
      commenterName: user.fullname,
      commenterEmail: user.email,
      createdBy: user.email,
      postReference: reference,
      isOnPost: true,
      likeCount: 0,
      commentCount: 0,
      createdDate: new Date(),
      id: Date.now(),
      isActive: true,
      isDeleted: false,
    };


    // Add comment to top immediately
    setDisplayComments((prev) => {
      const updated = [optimisticComment, ...prev];
      return updated;
    });
    
    // Clear input immediately
    setComment("");

    // Update post comment count in feed
    updatePostCommentCount(reference, 1);

    try {
      const result = await save(payload);

      // Wait a bit then refetch to get the real comment from server
      setTimeout(async () => {
        await refetchComments();
      }, 500);

    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message || "Failed to submit comment."
      );
      
      // Remove optimistic comment on error
      setDisplayComments((prev) => 
        prev.filter((c) => c.reference !== tempId)
      );

      // Revert comment count
      updatePostCommentCount(reference, -1);

      Alert.alert(
        "Error",
        err.message || "Failed to post comment. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={displayComments}
          keyExtractor={(item, i) => item.reference || `comment-${i}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* ORIGINAL POST */}
              {post ? (
                <PostCard post={post} disableNavigation />
              ) : (
                <Text style={styles.loadingText}>
                  Loading post...
                </Text>
              )}

              <Text style={styles.title}>
                Comments ({displayComments.length})
              </Text>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.commentCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.commenterName?.charAt(0) || "?"}
                </Text>
              </View>

              <View style={styles.commentBody}>
                <Text style={styles.commentName}>
                  {item.commenterName || "Unknown"}
                </Text>
                <Text style={styles.commentText}>
                  {item.content}
                </Text>

                <View style={styles.commentMeta}>
                  <Ionicons
                    name="thumbs-up-outline"
                    size={14}
                    color="#6B7280"
                  />
                  <Text style={styles.metaText}>
                    {item.likeCount || 0}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No comments yet. Be the first 💬
            </Text>
          }
        />

        {/* COMMENT INPUT */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Write a comment…"
            value={comment}
            onChangeText={setComment}
            style={styles.input}
            multiline
            editable={!loading}
          />

          <Pressable
            onPress={handleSendComment}
            disabled={loading || !comment.trim()}
            style={[
              styles.sendBtn,
              (!comment.trim() || loading) && { opacity: 0.5 },
            ]}
          >
            {loading ? (
              <Text style={{ color: "#fff" }}>...</Text>
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  container: {
    flex: 1,
  },

  list: {
    padding: 16,
    paddingBottom: 100,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    marginVertical: 12,
    color: "#111827",
  },

  loadingText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#6B7280",
  },

  commentCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarText: {
    fontWeight: "700",
    color: "#374151",
  },

  commentBody: {
    flex: 1,
  },

  commentName: {
    fontWeight: "600",
    fontSize: 13,
    color: "#111827",
  },

  commentText: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
    lineHeight: 20,
  },

  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#9CA3AF",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  input: {
    flex: 1,
    maxHeight: 100,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    fontSize: 14,
  },

  sendBtn: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 20,
    marginLeft: 8,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});