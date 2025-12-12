// ui/badge.tsx
import { Text, View } from "react-native";

export function Badge({ children, className }: any) {
  return (
    <View className={`px-2 py-1 rounded-full border ${className}`}>
      <Text className="text-xs font-medium">{children}</Text>
    </View>
  );
}
