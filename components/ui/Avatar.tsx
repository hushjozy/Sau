// ui/avatar.tsx
import { View, Text } from "react-native";

export function Avatar({ children, className }: any) {
  return (
    <View
      className={`h-10 w-10 rounded-full bg-muted items-center justify-center ${className}`}
    >
      {children}
    </View>
  );
}

export function AvatarFallback({ children, className }: any) {
  return (
    <Text className={`text-sm font-bold text-foreground ${className}`}>
      {children}
    </Text>
  );
}
