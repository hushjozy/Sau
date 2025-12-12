// ui/card.tsx
import { View } from "react-native";

export function Card({ children, className }: any) {
  return (
    <View
      className={`rounded-xl border border-border bg-card p-4 ${className}`}
    >
      {children}
    </View>
  );
}
