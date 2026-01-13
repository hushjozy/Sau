import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
// import { searchByKeywords } from "@/services/api/userServices";
// import { getAwards } from "@/services/api/awardServices";
import { addRecognition } from "@/services/api/recognitionServices";
import { IUser } from "@/services/models/users";
import { AwardDto } from "@/services/models/awardDto";
import { useUser } from "@/provider/UserProvider";
import { getAwards } from "@/services/api/awardsServices";
import { searchByKeywords } from "@/services/api/users";

interface GiveAppreciationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GiveAppreciationModal({
  visible,
  onClose,
  onSuccess,
}: GiveAppreciationModalProps) {
  const { user } = useUser();
  const [users, setUsers] = useState<IUser[]>([]);
  const [awards, setAwards] = useState<AwardDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [selectedAwardId, setSelectedAwardId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadUsers("");
      loadAwards();
    }
  }, [visible]);

  const loadUsers = async (query: string) => {
    console.log("Loading users with query:", query);
    if (!query || query.trim().length < 2) return;
    console.log("Fetching users for query:", query);
    setLoading(true);
    try {
      const response = await searchByKeywords(query || "@", 1, 20);
      setUsers(response?.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAwards = async () => {
    try {
      const response = await getAwards();
      // Filter for zero-point awards (appreciations)
      const zeroPointAwards = (response.responseData || []).filter(
        (award: AwardDto) => award.pointsAwarded === 0
      );
      setAwards(zeroPointAwards);
    } catch (error) {
      console.error("Failed to load awards:", error);
    }
  };

  const toggleUserSelection = (selectedUser: IUser) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.id === selectedUser.id);
      if (exists) {
        return prev.filter((u) => u.id !== selectedUser.id);
      }
      return [...prev, selectedUser];
    });
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert("Error", "Please select at least one recipient");
      return;
    }

    if (!selectedAwardId) {
      Alert.alert("Error", "Please select an appreciation award");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    setSubmitting(true);
    try {
      await addRecognition({
        recipientAppUserIds: selectedUsers.map((u) => u.id),
        recipientFullNames: selectedUsers.map((u) => u.fullname || ""),
        recipientEmails: selectedUsers.map((u) => u.email),
        giverAppUserId: user?.id || "",
        giverFullName: user?.fullname || "",
        giverEmail: user?.email || "",
        awardId: selectedAwardId,
        message: message.trim(),
      });

      Alert.alert("Success", "Appreciation sent successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send appreciation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSelectedAwardId(null);
    setMessage("");
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Give Appreciation</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Search Recipients */}
            <View style={styles.section}>
              <Text style={styles.label}>Recipient(s)</Text>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search users..."
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    if (text.trim().length >= 2) {
                        loadUsers(text);
                    }
                  }}
                />
              </View>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <View style={styles.selectedUsers}>
                  {selectedUsers.map((user) => (
                    <View key={user.id} style={styles.selectedUserChip}>
                      <Text style={styles.chipText}>{user.fullname}</Text>
                      <Pressable onPress={() => toggleUserSelection(user)}>
                        <Ionicons name="close-circle" size={18} color="#EF4444" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              {/* User List */}
              {loading ? (
                <ActivityIndicator style={styles.loader} />
              ) : (
                <View style={styles.userList}>
                    {Array.isArray(users) &&
                    users.slice(0, 5).map((user) => (
                    <Pressable
                      key={user.id}
                      style={styles.userItem}
                      onPress={() => toggleUserSelection(user)}
                    >
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.fullname}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                      </View>
                      {selectedUsers.find((u) => u.id === user.id) && (
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Select Award */}
            <View style={styles.section}>
              <Text style={styles.label}>Appreciation</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedAwardId}
                  onValueChange={(value: any) => setSelectedAwardId(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Appreciation" value={null} />
                  {awards.map((award) => (
                    <Picker.Item key={award.id} label={award.name} value={award.id} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Message */}
            <View style={styles.section}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your appreciation message..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <Pressable
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Send Appreciation</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },
  selectedUsers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  selectedUserChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    color: "#1E40AF",
    fontWeight: "500",
  },
  userList: {
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  userEmail: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  loader: {
    marginVertical: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});