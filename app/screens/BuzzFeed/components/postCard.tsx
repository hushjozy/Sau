import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export function PostCard({ post }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://placekitten.com/100/100" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {post.senderName}
          </Text>
          <Text style={styles.time}>{post.createdAt}</Text>
        </View>
      </View>

      <Text style={styles.message}>{post.message}</Text>

      {post.media?.length > 0 && (
        <Image
          source={{ uri: post.media[0].uri }}
          style={styles.media}
        />
      )}

      <View style={styles.footer}>
        <Pressable>
          <Text>👍 {post.likeCount}</Text>
        </Pressable>
        <Text>{post.commentCount} Comments</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  header: { flexDirection: "row", marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 8 },
  name: { fontWeight: "600" },
  time: { fontSize: 12, color: "#777" },
  message: { marginVertical: 8, lineHeight: 20 },
  media: { width: "100%", height: 200, borderRadius: 8 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
