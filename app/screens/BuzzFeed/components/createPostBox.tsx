import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export function CreatePostBox() {
  const [message, setMessage] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Update Status</Text>

      <TextInput
        placeholder="Share an update..."
        value={message}
        onChangeText={setMessage}
        multiline
        style={styles.input}
      />

      <View style={styles.actions}>
        <Pressable>
          <Text style={styles.emoji}>😊</Text>
        </Pressable>

        <Pressable style={styles.postButton}>
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  label: { fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  emoji: { fontSize: 22 },
  postButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  postText: { color: "#fff", fontWeight: "600" },
});
