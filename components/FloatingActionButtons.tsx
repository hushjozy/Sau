import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FABAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}

interface FloatingActionButtonsProps {
  actions: FABAction[];
}

export function FloatingActionButtons({ actions }: FloatingActionButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue: isExpanded ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.spring(rotateValue, {
        toValue: isExpanded ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [isExpanded]);

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const handleMainPress = () => {
    if (!isExpanded) {
      // First click - expand and show labels
      setIsExpanded(true);
      setShowLabels(true);
    } else {
      // Second click on expanded - collapse
      setShowLabels(false);
      setIsExpanded(false);
    }
  };

  const handleActionPress = (action: FABAction) => {
    if (showLabels) {
      // Second click - trigger action
      action.onPress();
      setShowLabels(false);
      setIsExpanded(false);
    } else {
      // First click - just show label
      setShowLabels(true);
    }
  };

  const expandedHeight = actions.length * 70 + 64;

  return (
    <View style={[styles.container, { bottom: 20 + insets.bottom, height: expandedHeight }]}>
      {/* Action Buttons */}
      {actions.map((action, index) => {
        const translateY = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(index + 1) * 70],
        });

        const scale = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        const opacity = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.actionButton,
              {
                transform: [{ translateY }, { scale }],
                opacity,
              },
            ]}
          >
            {showLabels && (
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{action.label}</Text>
              </View>
            )}
            <Pressable
              onPress={() => handleActionPress(action)}
              style={({ pressed }) => [
                styles.fabButton,
                { backgroundColor: action.color },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name={action.icon} size={24} color="#fff" />
            </Pressable>
          </Animated.View>
        );
      })}

      {/* Main FAB Button */}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Pressable
          onPress={handleMainPress}
          style={({ pressed }) => [styles.mainFab, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
            style={styles.gradient}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 65,
    flexDirection: "row",
    alignItems: "center",
  },
  labelContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    whiteSpace: "nowrap",
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  mainFab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});