// app/wallet/index.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SideDrawer from "../../components/SideDrawer";

const walletItems = [
  { icon: "📦", label: "All Orders" },
  { icon: "🪙", label: "Redeem NGN" },
  { icon: "🎁", label: "Add Gift Card" },
];

function Header({ onOpen }: { onOpen: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onOpen}
        style={styles.menuButton}
        android_ripple={{ color: "#f3f4f6" }}
      >
        <Ionicons name="menu-outline" size={22} color="#374151" />
      </Pressable>

      {/* Center Logo */}
      <View style={styles.headerCenter}>
        <View style={styles.starCircleWrapper}>
          <View style={styles.starCircleBg} />
          <View style={styles.starCircleContent}>
            <Text style={styles.starCircleText}>★</Text>
          </View>
        </View>

        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>STARS</Text>
          <Text style={[styles.headerTitle, { marginLeft: 4 }]}>LAFARGE</Text>
        </View>
      </View>

      <View style={{ width: 40 }} />
    </View>
  );
}

function WalletCard() {
  return (
    <View style={styles.walletCard}>
      <View style={styles.cashbackBadge}>
        <Text style={styles.cashbackText}>Pending Cashback 0</Text>
      </View>

      <View style={styles.walletRow}>
        <View>
          <Text style={styles.walletTitle}>My Wallet</Text>
          <Text style={styles.walletAmount}>0 NGN</Text>
        </View>

        <View style={styles.walletIconWrapper}>
          <View style={styles.walletIconBox}>
            <Ionicons name="wallet-outline" size={28} color="#fff" />
          </View>
        </View>
      </View>
    </View>
  );
}

function ActionList() {
  return (
    <View style={styles.actionList}>
      {walletItems.map((item, index) => (
        <Pressable
          key={index}
          style={styles.actionItem}
          android_ripple={{ color: "#f3f4f6" }}
          onPress={() => {}}
        >
          <Text style={styles.actionItemIcon}>{item.icon}</Text>
          <Text style={styles.actionItemLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>
      ))}
    </View>
  );
}

export default function WalletScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <Header onOpen={() => setIsDrawerOpen(true)} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <WalletCard />
        <ActionList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* MAIN CONTAINER */
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
    justifyContent: "space-between",
    alignItems: "center",
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

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starCircleWrapper: {
    width: 40,
    height: 40,
    position: "relative",
  },
  starCircleBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1a9b94",
    borderRadius: 20,
  },
  starCircleContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  starCircleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },

  /* SCROLL AREA */
  scrollContainer: {
    padding: 16,
    gap: 16,
  },

  /* WALLET CARD */
  walletCard: {
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 24,
    position: "relative",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  cashbackBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ff9f4a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cashbackText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  walletTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  walletAmount: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },
  walletIconWrapper: {
    marginTop: 32,
  },
  walletIconBox: {
    width: 64,
    height: 64,
    backgroundColor: "#ff9f4a",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  /* ACTION LIST */
  actionList: {
    backgroundColor: "#1a9b94",
    paddingVertical: 16,
    paddingLeft: 16,
    borderRadius: 20,
    gap: 8,
    alignItems: "center",
  },

  actionItem: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionItemIcon: {
    fontSize: 18,
  },
  actionItemLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
});
