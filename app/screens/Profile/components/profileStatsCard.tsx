// File: @/screens/Profile/components/profileStatsCard.tsx

import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ProfileStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: string[];
  borderColor: string;
}

export function ProfileStatsCard({
  title,
  value,
  subtitle,
  icon,
  gradientColors,
  borderColor,
}: ProfileStatsCardProps) {
  return (
    <LinearGradient colors={gradientColors} style={[styles.card, { borderLeftColor: borderColor }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={icon} size={20} color={borderColor} />
      </View>
      <Text style={[styles.value, { color: borderColor }]}>{value}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: borderColor }]}>{subtitle}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    minHeight: 140,
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 11,
    textAlign: "center",
  },
});