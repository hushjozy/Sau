import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LikeDto } from "@/services/models/likeDto";

interface LikesModalProps {
  visible: boolean;
  onClose: () => void;
  likes: LikeDto[];
  loading: boolean;
}

export function LikesModal({ visible, onClose, likes, loading }: LikesModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Likes ({likes.length})
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : likes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No likes yet</Text>
            </View>
          ) : (
            <FlatList
              data={likes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.likeItem}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.likerName.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.likeInfo}>
                    <Text style={styles.likerName}>{item.likerName}</Text>
                    {item.likerPosition && (
                      <Text style={styles.likerPosition}>
                        {item.likerPosition}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="heart" size={20} color="#EF4444" />
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#9CA3AF",
  },
  likeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  likeInfo: {
    flex: 1,
  },
  likerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  likerPosition: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
});