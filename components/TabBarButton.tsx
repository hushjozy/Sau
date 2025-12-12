import { INACTIVE, PRIMARY, WHITE } from "@constants/colors";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@provider/ThemeProvider";
import { responsiveFontSize } from "@lib/responsiveFontSize";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  focused: boolean;
};

export function TabBarButton({ icon, title, focused }: Props) {
  const { theme } = useTheme();
  const color = focused ? PRIMARY : INACTIVE;
  const darkColor = focused ? PRIMARY : WHITE;

  const textColorAnimation = useAnimatedStyle(() => {
    return {
      color: theme === "dark" ? withTiming(darkColor) : withTiming(color),
    };
  });

  return (
    <View style={[styles.pressable]}>
      {icon}
      <Animated.Text
        style={[styles.label, textColorAnimation]}
        allowFontScaling={false}
      >
        {title}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: responsiveFontSize(12),
    fontFamily: "Medium",
  },
});
