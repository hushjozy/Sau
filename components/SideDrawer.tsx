import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/provider/UserProvider";

type SideDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { width } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const {user} = useUser();
  console.log(user, "userdrawer");

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Modal visible={isOpen} animationType="none" transparent>
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" color="white" size={25} />
        </Pressable>

        <ScrollView style={styles.scroll}>
          <View style={styles.headerSection}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
                <Text style={styles.profileLocation}>{user?.position}</Text>
                <Text style={styles.profileLocation}>{user?.locationName}</Text>

                {/* <Pressable onPress={() => {}}>
                  <Text style={styles.changeLocation}>Change Location</Text>
                </Pressable> */}
              </View>
            </View>

            <Pressable style={styles.profileButton} onPress={() => {}}>
              <Text style={styles.profileButtonText}>View Profile</Text>
            </Pressable>
          </View>

          <View style={styles.menuList}>
            {[
              { icon: "gift-outline", label: "Prizes" },
              { icon: "ticket-outline", label: "Vouchers" },
              { icon: "help-circle-outline", label: "Support" },
              { icon: "star-outline", label: "Rate Us" },
              { icon: "heart-outline", label: "Favourites" },
              { icon: "chatbox-ellipses-outline", label: "I Want" },
            ].map((item, index) => (
              <Pressable key={index} style={styles.menuItem} onPress={() => {}}>
                <Ionicons name={item.icon as any} size={22} color="#374151" />
                <Text style={styles.menuLabel}>{item.label}</Text>

                <View style={{ flex: 1 }} />
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "85%",
    backgroundColor: "white",
    paddingTop: 60,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  closeButton: {
    marginLeft: "auto",
    marginRight: 32,
    padding: 4,
    borderRadius: 999,
    backgroundColor: "#1a9b94",
  },

  scroll: {
    flex: 1,
  },

  headerSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  avatar: {
    height: 64,
    width: 64,
    backgroundColor: "#B8E6E1",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4b5563",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },

  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },

  profileLocation: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 8,
  },

  changeLocation: {
    color: "#1a9b94",
    fontSize: 15,
  },

  profileButton: {
    width: "100%",
    backgroundColor: "#1a9b94",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  profileButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  menuList: {
    paddingHorizontal: 16,
    gap: 8,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  menuLabel: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
  },
});
