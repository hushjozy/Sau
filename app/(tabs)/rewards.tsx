// app/rewards/index.tsx
import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { SideDrawer } from "../../components/SideDrawer"; // path from app/ to components/
import { GestureResponderEvent } from "react-native";

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
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between shadow-sm">
        <Pressable
          onPress={() => setIsDrawerOpen(true)}
          className="p-2 -ml-2 rounded-lg"
          android_ripple={{ color: "#f3f4f6" }}
        >
          <Ionicons name="menu-outline" size={22} color="#374151" />
        </Pressable>

        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <Text className="text-gray-700 font-bold text-lg uppercase">
              LAFARGE Applause
            </Text>
          </View>
        </View>

        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-3 space-y-4 pb-6">
        {/* Hero Banner */}
        <View className="relative rounded-2xl p-6 shadow-lg overflow-hidden bg-black">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-3xl font-bold leading-tight">
                the <Text className="text-[#ffd700]">Star</Text>
              </Text>
              <Text className="text-white text-3xl font-bold leading-tight">
                Among Us
              </Text>
            </View>

            <View className="relative">
              <View className="w-20 h-20 bg-[#1a9b94] rounded-full items-center justify-center">
                <Text className="text-white text-2xl">★</Text>
              </View>
            </View>
          </View>
        </View>

        {/* My Wallet Card */}
        <View className="bg-[#d4f1ed] rounded-2xl px-3 py-1 flex-row items-center gap-4">
          <Text className="text-[35px]">💰</Text>
          <View>
            <Text className="text-gray-900 text-lg font-semibold">
              My Wallet
            </Text>
            <Text className="text-gray-900 text-2xl font-bold">0 NGN</Text>
          </View>
        </View>

        {/* Section Title */}
        <Text className="text-gray-900 text-[20px] mb-2 font-bold px-1">
          Rewards & Recognition
        </Text>

        {/* Reward Items */}
        <View className="pl-4 w-full  gap-y-3 justify-center items-center">
          {rewardItems.map((item, idx) => (
            <Pressable
              key={idx}
              className="w-full bg-white rounded-xl p-3 flex-row items-center gap-4 shadow-sm"
              android_ripple={{ color: "#f3f4f6" }}
              onPress={() => {
                // navigate or open detail
              }}
            >
              <Text className="text-3xl">{item.icon}</Text>
              <Text className="flex-1 text-left text-[14px] font-semibold text-gray-900">
                {item.label}
              </Text>
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
