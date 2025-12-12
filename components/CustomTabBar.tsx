import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CustomTabBar() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, descriptors, navigation }) => (
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const iconName =
              options.tabBarIcon?.({ color: "", focused: false, size: 24 }) ||
              "ellipse";

            return (
              <TouchableOpacity
                key={route.name}
                style={styles.tabButton}
                onPress={() => navigation.navigate(route.name)}
              >
                <Ionicons
                  name={iconName as any}
                  size={24}
                  color={isFocused ? "teal" : "gray"}
                />
                <Text
                  style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}
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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb", // gray-200
    height: 65,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#6b7280", // gray-500
  },
  tabLabelFocused: {
    color: "#0d9488", // teal-600
    fontWeight: "600",
  },
});
