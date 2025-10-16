// components/SideDrawer.tsx
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

type SideDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { width } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(-width)).current; // start off-screen left

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);
  return (
    <Modal visible={isOpen} animationType="none" transparent>
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        }}
        className="absolute left-0 top-0 pt-[60px] bottom-0 w-[85%] bg-white shadow-lg"
      >
        <Pressable
          className="ml-auto mr-8 p-1 rounded-full bg-[#1a9b94]"
          onPress={onClose}
        >
          <Ionicons name="close" color="white" size={25} />
        </Pressable>
        <ScrollView className="flex-1">
          <View className="p-6 pb-4">
            <View className="flex-row items-start mb-4">
              <View className="h-16 w-16 bg-[#B8E6E1] rounded-full items-center justify-center">
                <Text className="text-2xl font-bold text-gray-700">KO</Text>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-xl font-bold text-gray-900 leading-tight mb-1">
                  Kehinde OSHUNGBOYE
                </Text>
                <Text className="text-gray-600 text-base mb-2">Nigeria</Text>
                <Pressable onPress={() => {}}>
                  <Text className="text-[#1a9b94]">Change Location</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              className="w-full bg-[#1a9b94] py-3 rounded-xl items-center"
              onPress={() => {}}
            >
              <Text className="text-white font-semibold text-lg">
                View Profile
              </Text>
            </Pressable>
          </View>

          <View className="px-4 space-y-2">
            {[
              { icon: "gift-outline", label: "Prizes" },
              { icon: "ticket-outline", label: "Vouchers" },
              { icon: "help-circle-outline", label: "Support" },
              { icon: "star-outline", label: "Rate Us" },
              { icon: "heart-outline", label: "Favourites" },
              { icon: "chatbox-ellipses-outline", label: "I Want" },
            ].map((m, i) => (
              <Pressable
                key={i}
                className="flex-row items-center px-3 py-4 rounded-lg"
                onPress={() => {}}
              >
                <Ionicons name={m.icon as any} size={22} color="#374151" />
                <Text className="ml-4 text-lg font-medium text-gray-900">
                  {m.label}
                </Text>
                <View className="flex-1" />
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
