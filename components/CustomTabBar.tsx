"use client";
import { View, TouchableOpacity, Text } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CustomTabBar() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, descriptors, navigation }) => (
        <View className="flex-row bg-white border-t border-gray-200 h-[65px]">
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const iconName =
              options.tabBarIcon?.({ color: "", focused: false, size: 24 }) ||
              "ellipse";

            return (
              <TouchableOpacity
                key={route.name}
                className="flex-1 items-center justify-center"
                onPress={() => navigation.navigate(route.name)}
              >
                <Ionicons
                  name={iconName as any}
                  size={24}
                  color={isFocused ? "teal" : "gray"}
                />
                <Text
                  className={`text-xs ${
                    isFocused ? "text-teal-600 font-semibold" : "text-gray-500"
                  }`}
                >
                  {options.title || route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: () => "cash-outline",
        }}
      />
      <Tabs.Screen
        name="voucher"
        options={{
          title: "Voucher",
          tabBarIcon: () => "pricetags-outline",
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: () => "wallet-outline",
        }}
      />
    </Tabs>
  );
}
