import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SideDrawer } from "../../components/SideDrawer";

const rewardItems = [
  { icon: "🪙", label: "Redeem your Points" },
  { icon: "🔔", label: "Notifications" },
  { icon: "🙌", label: "Appreciate your Teammates" },
  { icon: "👥", label: "Buzz" },
  { icon: "🔍", label: "Lookup your Colleagues" },
  { icon: "📋", label: "Appreciated List" },
  { icon: "🏆", label: "Hall of Fame" },
];

export default function RewardsScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => setIsDrawerOpen(true)}
          style={styles.menuButton}
          android_ripple={{ color: "#f3f4f6" }}
        >
          <Ionicons name="menu-outline" size={22} color="#374151" />
        </Pressable>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>LAFARGE Applause</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroText}>
                the <Text style={styles.heroHighlight}>Star</Text>
              </Text>
              <Text style={styles.heroText}>Among Us</Text>
            </View>

            <View>
              <View style={styles.heroBadge}>
                <Text style={styles.badgeStar}>★</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Wallet */}
        <View style={styles.walletCard}>
          <Text style={styles.walletEmoji}>💰</Text>
          <View>
            <Text style={styles.walletTitle}>My Wallet</Text>
            <Text style={styles.walletAmount}>0 NGN</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Rewards & Recognition</Text>

        {/* Reward Items */}
        <View style={styles.itemsWrapper}>
          {rewardItems.map((item, idx) => (
            <Pressable
              key={idx}
              style={styles.itemCard}
              android_ripple={{ color: "#f3f4f6" }}
              onPress={() => {}}
            >
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="#9ca3af"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  /* HEADER */
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 8,
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
  headerRightSpacer: {
    width: 40,
  },

  /* MAIN CONTENT */
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 16,
  },

  /* HERO */
  heroCard: {
    backgroundColor: "#000",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 34,
  },
  heroHighlight: {
    color: "#ffd700",
  },
  heroBadge: {
    width: 80,
    height: 80,
    backgroundColor: "#1a9b94",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeStar: {
    color: "#fff",
    fontSize: 28,
  },

  /* WALLET */
  walletCard: {
    backgroundColor: "#d4f1ed",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 16,
  },
  walletEmoji: {
    fontSize: 35,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  walletAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },

  /* SECTION */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginLeft: 4,
  },

  /* ITEMS LIST */
  itemsWrapper: {
    width: "100%",
    paddingLeft: 12,
    gap: 12,
    alignItems: "center",
  },
  itemCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  itemIcon: {
    fontSize: 28,
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
});
