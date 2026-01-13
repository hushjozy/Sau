import React, { useEffect, useRef, useState } from "react";
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
import { router } from "expo-router";

type SideDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { width } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const { user, logout } = useUser();
  const [visible, setVisible] = useState(isOpen);

  /** Handle mount/unmount smoothly */
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [isOpen, width]);

  if (!visible) return null;

  if (!user) {
    return (
      <Modal visible transparent>
        <View style={styles.loadingContainer}>
          <Text>Loading profile…</Text>
        </View>
      </Modal>
    );
  }

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  const handleLogout = async () => {
    await logout();
    onClose();
    router.replace("/auth/login");
  };

  const menuItems = [
    {
      icon: "today",
      label: "Buzz Feed",
      onPress: () => {
        onClose();
        router.replace("/screens/BuzzFeed/buzzFeedScreen");
      },
    },
    {
      icon: "gift",
      label: "Redeem",
      onPress: () => {
        onClose();
        router.replace("/screens/BuzzFeed/buzzFeedScreen");
      },
    },
    {
      icon: "pulse",
      label: "Pulse Check",
      onPress: () => {
        onClose();
        router.replace("/screens/BuzzFeed/buzzFeedScreen");
      },
    },
    {
      icon: "search",
      label: "Find Colleague",
      onPress: () => {
        onClose();
        router.replace("/screens/BuzzFeed/buzzFeedScreen");
      },
    },
    {
      icon: "star-outline",
      label: "Our Bright Stars",
      onPress: () => {
        onClose();
        router.replace("/screens/BuzzFeed/buzzFeedScreen");
      },
    },
  ];

  return (
    <Modal visible transparent animationType="none">
      {/* BACKDROP */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* DRAWER */}
      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* CLOSE BUTTON */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={22} color="#fff" />
        </Pressable>

        <View style={styles.contentWrapper}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* HEADER */}
            <View style={styles.headerSection}>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={styles.profileLocation}>{user.position}</Text>
                  <Text style={styles.profileLocation}>
                    {user.locationName}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.profileButton}
                onPress={() => {
                  onClose();
                  router.push("/screens/Profile");
                }}
              >
                <Text style={styles.profileButtonText}>View Profile</Text>
              </Pressable>
            </View>

            {/* MENU */}
            <View style={styles.menuList}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <Ionicons name={item.icon as any} size={22} color="#374151" />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <View style={{ flex: 1 }} />
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* LOGOUT */}
          <View style={styles.logoutWrapper}>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SideDrawer;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  drawerContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "85%",
    backgroundColor: "#fff",
    paddingTop: 60,
    elevation: 12,
  },

  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#1a9b94",
    padding: 6,
    borderRadius: 20,
    zIndex: 20,
  },

  contentWrapper: {
    flex: 1,
    marginTop: 40,
  },

  headerSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  profileRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#B8E6E1",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065F46",
  },

  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },

  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },

  profileLocation: {
    fontSize: 14,
    color: "#4B5563",
  },

  profileButton: {
    marginTop: 12,
    backgroundColor: "#1a9b94",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  profileButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  menuList: {
    paddingHorizontal: 16,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  menuLabel: {
    marginLeft: 16,
    fontSize: 16,
  },

  logoutWrapper: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  logoutButton: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "600",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
