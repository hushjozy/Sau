import { View, Text, Image, Pressable, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { timeAgo } from "@/lib/time";
import { IMG_URL } from "@/lib/utils";
import { useState } from "react";

export function PostCard({ post }: any) {
  const [previewVisible, setPreviewVisible] = useState(false);
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://placekitten.com/100/100" }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{post?.senderName}</Text>
          <Text style={styles.time}>
            {timeAgo(post?.createdDate)}
          </Text>
        </View>
      </View>

      {/* Message */}
      <Text style={styles.message}>{post?.message}</Text>

      {/* Media */}
      {post?.mediaFiles?.length > 0 && (
        <>
          <Pressable onPress={() => setPreviewVisible(true)}>
            <Image
              source={{ uri: IMG_URL.imgUrl + post.mediaFiles[0]?.mediaUrl }}
              style={styles.media}
            />
          </Pressable>

          <Modal
            visible={previewVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setPreviewVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setPreviewVisible(false)}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </Pressable>

              <Image
                source={{ uri: IMG_URL.imgUrl + post.mediaFiles[0]?.mediaUrl }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          </Modal>
        </>
      )}
      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.action}>
          <Ionicons name="thumbs-up-outline" size={16} color="#374151" />
          <Text style={styles.actionText}>{post?.likeCount}</Text>
        </Pressable>

        <Pressable style={styles.action}>
          <Ionicons name="chatbubble-outline" size={16} color="#374151" />
          <Text style={styles.actionText}>
            {post?.commentCount} Comments
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
  },

  name: {
    fontWeight: "600",
    fontSize: 15,
    color: "#111827",
  },

  time: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  message: {
    marginVertical: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },

  media: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 6,
  },

  modalContainer: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.95)",
  justifyContent: "center",
  alignItems: "center",
},

fullImage: {
  width: "100%",
  height: "100%",
},

closeButton: {
  position: "absolute",
  top: 50,
  right: 20,
  zIndex: 10,
},

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionText: {
    fontSize: 13,
    color: "#374151",
  },
});
