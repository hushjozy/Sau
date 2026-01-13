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
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { giverAppreciation } from "@/services/api/appreciationServices";
import { IUser } from "@/services/models/users";
import { searchByKeywords } from "@/services/api/users";

interface GiftColleaguesModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GiftColleaguesModal({
  visible,
  onClose,
  onSuccess,
}: GiftColleaguesModalProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

//   useEffect(() => {
//     if (visible) {
//       loadUsers("");
//     }
//   }, [visible]);

  const loadUsers = async (query: string) => {
    if (!query || query.trim().length < 2) return;
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

  const handleUserSelect = (user: IUser) => {
    setSelectedUser(user);
    setSearchQuery(user.fullname || "");
    setShowUserList(false);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      Alert.alert("Error", "Please select a recipient");
      return;
    }

    const points = parseInt(amount);
    if (!points || points < 1) {
      Alert.alert("Error", "Please enter a valid amount (minimum 1)");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    setSubmitting(true);
    try {
      await giverAppreciation({
        receiverEmail: selectedUser.email,
        points,
        message: message.trim(),
        isPublic,
      });

      Alert.alert("Success", "Gift sent successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      Alert.alert("Error", error.error.message || "Failed to send gift");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
    setAmount("");
    setMessage("");
    setIsPublic(true);
    setSearchQuery("");
    setShowUserList(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Give Gifts to Colleagues</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Search Recipient */}
            <View style={styles.section}>
              <Text style={styles.label}>Recipient</Text>
              <Pressable
                onPress={() => setShowUserList(true)}
                style={styles.searchBox}
              >
                <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search recipient..."
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    if (text.trim().length >= 2) {
                        loadUsers(text);
                        setShowUserList(true);
                    }
                  }}
                  onFocus={() => setShowUserList(true)}
                />
              </Pressable>

              {/* Selected User Display */}
              {selectedUser && !showUserList && (
                <View style={styles.selectedUserCard}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{selectedUser.fullname}</Text>
                    <Text style={styles.userEmail}>{selectedUser.email}</Text>
                  </View>
                  <Pressable onPress={() => setSelectedUser(null)}>
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </Pressable>
                </View>
              )}

              {/* User List Dropdown */}
            {showUserList && (
                <View style={styles.userInfoList}>
                    {loading ? (
                    <ActivityIndicator style={styles.loader} />
                    ) : Array.isArray(users) && users.length > 0 ? (
                    users.slice(0, 5).map((user) => (
                        <Pressable
                        key={user.id}
                        style={styles.userItem}
                        onPress={() => handleUserSelect(user)}
                        >
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user?.fullname}</Text>
                            <Text style={styles.userEmail}>{user?.email}</Text>
                        </View>
                        </Pressable>
                    ))
                    ) : (
                    <Text style={{ padding: 12, color: "#6B7280" }}>
                        No users found
                    </Text>
                    )}
                </View>
            )}

            </View>

            {/* Amount */}
            <View style={styles.section}>
              <Text style={styles.label}>Amount (₦)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text style={styles.hint}>Minimum: ₦1</Text>
            </View>

            {/* Message */}
            <View style={styles.section}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write a message to your colleague..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Is Public Toggle */}
            <View style={styles.section}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Make this gift public</Text>
                  <Text style={styles.toggleHint}>
                    Others will be able to see this gift
                  </Text>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                  thumbColor={isPublic ? "#2563EB" : "#F3F4F6"}
                />
              </View>
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
                <Text style={styles.submitButtonText}>Send Gift</Text>
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
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },
  selectedUserCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  userList: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    maxHeight: 200,
  },
  userItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  userInfo: {
    flex: 1,
  },
  userInfoList: {
  flexShrink: 1,
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
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  toggleHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
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