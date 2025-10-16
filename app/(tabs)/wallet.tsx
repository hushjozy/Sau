// app/wallet/index.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import SideDrawer from "../../components/SideDrawer";

const walletItems = [
  { icon: "📦", label: "All Orders" },
  { icon: "🪙", label: "Redeem NGN" },
  { icon: "🎁", label: "Add Gift Card" },
];

function Header({ onOpen }: { onOpen: () => void }) {
  return (
    <View className="bg-white px-4 py-3 flex-row items-center justify-between shadow-sm">
      <Pressable
        onPress={onOpen}
        className="p-2 -ml-2 rounded-lg"
        android_ripple={{ color: "#f3f4f6" }}
      >
        <Ionicons name="menu-outline" size={22} color="#374151" />
      </Pressable>

      <View className="flex-row items-center gap-2">
        <View className="relative w-10 h-10">
          <View className="absolute inset-0 bg-[#1a9b94] rounded-full" />
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-white font-bold">★</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1">
          <Text className="text-gray-700 font-bold text-lg">STARS</Text>
          <View className="w-0 h-0" />
          <Text className="text-gray-700 font-bold text-lg ml-1">LAFARGE</Text>
        </View>
      </View>

      <View className="w-10" />
    </View>
  );
}

function WalletCard() {
  return (
    <View className="relative bg-black rounded-2xl p-6 shadow-lg mb-5 overflow-hidden">
      <View className="absolute top-3 right-3 bg-[#ff9f4a] px-3 py-1.5 rounded-full">
        <Text className="text-white text-xs font-semibold">
          Pending Cashback 0
        </Text>
      </View>

      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-white text-2xl font-bold mb-3">My Wallet</Text>
          <Text className="text-white text-4xl font-bold">0 NGN</Text>
        </View>

        <View className="mt-8">
          <View className="w-16 h-16 bg-[#ff9f4a] rounded-lg items-center justify-center shadow-md">
            <Ionicons name="wallet-outline" size={28} color="#fff" />
          </View>
        </View>
      </View>
    </View>
  );
}

function ActionList() {
  return (
    <View className="bg-[#1a9b94] rounded-2xl py-4 items-center pl-4 gap-y-2">
      {walletItems.map((item, index) => (
        <Pressable
          key={index}
          className="w-full bg-white rounded-xl p-3 flex-row items-center gap-4 shadow-sm"
          android_ripple={{ color: "#f3f4f6" }}
          onPress={() => {}}
        >
          <Text className="text-[14px]">{item.icon}</Text>
          <Text className="flex-1 text-left text-lg font-semibold text-gray-900">
            {item.label}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>
      ))}
    </View>
  );
}

export default function WalletScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <Header onOpen={() => setIsDrawerOpen(true)} />

      <ScrollView className="flex-1 p-4 space-y-4">
        <WalletCard />
        <ActionList />
      </ScrollView>
    </SafeAreaView>
  );
}
