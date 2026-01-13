import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@/provider/UserProvider";
import { useSavePost } from "../hooks/useSavePost";

interface MediaFile {
  uri: string;
  type: "image" | "video";
  fileName: string;
  mimeType?: string;
}

type ViewType = "Global" | "Team" | "Individual";

export function CreatePostBox({ onPostCreated }: { onPostCreated?: () => void }) {
  const { user } = useUser();
  const { save, loading } = useSavePost();

  const [message, setMessage] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [viewType, setViewType] = useState<ViewType>("Global");
  const [showViewTypeMenu, setShowViewTypeMenu] = useState(false);

  const viewTypeOptions: ViewType[] = ["Global", "Team", "Individual"];

  // Request permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant access to your media library to upload photos/videos."
      );
      return false;
    }
    return true;
  };

  // Pick images
  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newFiles: MediaFile[] = result.assets.map((asset) => ({
        uri: asset.uri,
        type: "image" as const,
        fileName: asset.fileName || `image-${Date.now()}.jpg`,
        mimeType: asset.mimeType || "image/jpeg",
      }));

      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Pick video
  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const video = result.assets[0];
      const newFile: MediaFile = {
        uri: video.uri,
        type: "video",
        fileName: video.fileName || `video-${Date.now()}.mp4`,
        mimeType: video.mimeType || "video/mp4",
      };

      setMediaFiles((prev) => [...prev, newFile]);
    }
  };

  // Remove media file
  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle view type selection
  const selectViewType = (type: ViewType) => {
    setViewType(type);
    setShowViewTypeMenu(false);
  };

  // Get icon for view type
  const getViewTypeIcon = (type: ViewType) => {
    switch (type) {
      case "Global":
        return "globe-outline";
      case "Team":
        return "people-outline";
      case "Individual":
        return "person-outline";
    }
  };

  // Handle post submission
  const handlePost = async () => {
    if (!message.trim() && mediaFiles.length === 0) {
      Alert.alert("Error", "Please add a message or media to post");
      return;
    }

    if (!user?.email || !user?.fullname) {
      Alert.alert("Error", "User information is missing");
      return;
    }

    try {
      const formData = new FormData();

      // Add text fields
      formData.append("SenderName", user.fullname);
      formData.append("SenderEmail", user.email);
      formData.append("SenderFunction", user.functionName || "");
      formData.append("Message", message.trim());
      formData.append("ViewType", viewType);
      formData.append("Mentions", JSON.stringify([]));

      // Determine media type
      const hasVideo = mediaFiles.some((f) => f.type === "video");
      const hasImage = mediaFiles.some((f) => f.type === "image");
      
      let mediaType = "text";
      if (hasVideo) mediaType = "video";
      else if (hasImage) mediaType = "image";
      
      formData.append("MediaType", mediaType);

      // Add media files
      mediaFiles.forEach((file) => {
        const fileToUpload: any = {
          uri: file.uri,
          type: file.mimeType || (file.type === "video" ? "video/mp4" : "image/jpeg"),
          name: file.fileName,
        };

        formData.append("MediaFiles", fileToUpload);
      });

      await save(formData);

      // Clear form
      setMessage("");
      setMediaFiles([]);
      setViewType("Global");

      Alert.alert("Success", "Post created successfully!");

      // Callback to refresh feed
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create post");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Update Status</Text>

      <TextInput
        placeholder="Share an update..."
        value={message}
        onChangeText={setMessage}
        multiline
        style={styles.input}
        editable={!loading}
      />

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <ScrollView horizontal style={styles.mediaPreview} showsHorizontalScrollIndicator={false}>
          {mediaFiles.map((file, index) => (
            <View key={index} style={styles.mediaItem}>
              {file.type === "image" ? (
                <Image source={{ uri: file.uri }} style={styles.mediaThumbnail} />
              ) : (
                <View style={[styles.mediaThumbnail, styles.videoPlaceholder]}>
                  <Ionicons name="videocam" size={32} color="#fff" />
                </View>
              )}
              <Pressable
                style={styles.removeButton}
                onPress={() => removeMedia(index)}
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          {/* Media Buttons */}
          <Pressable style={styles.iconButton} onPress={pickImages} disabled={loading}>
            <Ionicons name="image-outline" size={22} color="#2563eb" />
          </Pressable>

          <Pressable style={styles.iconButton} onPress={pickVideo} disabled={loading}>
            <Ionicons name="videocam-outline" size={22} color="#2563eb" />
          </Pressable>

          {/* View Type Selector */}
          <Pressable
            style={styles.viewTypeButton}
            onPress={() => setShowViewTypeMenu(!showViewTypeMenu)}
            disabled={loading}
          >
            <Ionicons name={getViewTypeIcon(viewType)} size={18} color="#2563eb" />
            <Text style={styles.viewTypeText}>{viewType}</Text>
            <Ionicons name="chevron-down" size={16} color="#6B7280" />
          </Pressable>
        </View>

        <Pressable
          style={[styles.postButton, loading && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={loading || (!message.trim() && mediaFiles.length === 0)}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.postText}>Post</Text>
          )}
        </Pressable>
      </View>

      {/* View Type Dropdown Menu */}
      {showViewTypeMenu && (
        <View style={styles.viewTypeMenu}>
          {viewTypeOptions.map((type) => (
            <Pressable
              key={type}
              style={[
                styles.viewTypeOption,
                viewType === type && styles.viewTypeOptionActive,
              ]}
              onPress={() => selectViewType(type)}
            >
              <Ionicons
                name={getViewTypeIcon(type)}
                size={20}
                color={viewType === type ? "#2563eb" : "#6B7280"}
              />
              <Text
                style={[
                  styles.viewTypeOptionText,
                  viewType === type && styles.viewTypeOptionTextActive,
                ]}
              >
                {type}
              </Text>
              {viewType === type && (
                <Ionicons name="checkmark" size={20} color="#2563eb" />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    position: "relative",
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  mediaPreview: {
    marginTop: 12,
    maxHeight: 120,
  },
  mediaItem: {
    marginRight: 8,
    position: "relative",
  },
  mediaThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  videoPlaceholder: {
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  viewTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    gap: 6,
  },
  viewTypeText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  postButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  postButtonDisabled: {
    backgroundColor: "#93c5fd",
  },
  postText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  viewTypeMenu: {
    position: "absolute",
    bottom: 60,
    left: 100,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1000,
    minWidth: 150,
  },
  viewTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  viewTypeOptionActive: {
    backgroundColor: "#EFF6FF",
  },
  viewTypeOptionText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  viewTypeOptionTextActive: {
    color: "#2563eb",
    fontWeight: "600",
  },
});