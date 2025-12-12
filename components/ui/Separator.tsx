// ui/separator.tsx
import { View } from "react-native";

export function Separator({ className }: any) {
  return <View className={`h-[1px] bg-border my-2 ${className}`} />;
}
