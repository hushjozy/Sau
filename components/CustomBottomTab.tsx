import AIIconBold from "@assets/icons/AIIconBold";
import AIIconLinear from "@assets/icons/AIIconLinear";
import { INACTIVE, PRIMARY, WHITE } from "@constants/colors";
import { useTheme } from "@provider/ThemeProvider";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import {
  DocumentText1,
  Home2,
  SearchNormal,
  User,
} from "iconsax-react-nativejs";
import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarButton } from "./TabBarButton";
import { useTabBar } from "@provider/TabBarProvider";

type Props = {
  title: string;
  isFocused: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BottomTabIcon = ({ title, isFocused }: Props) => {
  const { theme } = useTheme();
  const INACTIVE_COLOR = theme === "dark" ? WHITE : INACTIVE;

  const renderIcon = (route: string, isFocused: boolean) => {
    switch (route) {
      case "Home":
        return (
          <TabBarButton
            title={title}
            focused={isFocused}
            icon={
              <Home2
                variant="Bold"
                color={isFocused ? PRIMARY : INACTIVE_COLOR}
              />
            }
          />
        );
      case "FAQs":
        return (
          <TabBarButton
            title={title}
            focused={isFocused}
            icon={
              isFocused ? (
                <SearchNormal variant="Bold" color={PRIMARY} />
              ) : (
                <SearchNormal variant="Linear" color={INACTIVE_COLOR} />
              )
            }
          />
        );
      case "AI":
        return (
          <View
            style={{
              marginTop: -40,
              width: 88,
              height: 88,
              backgroundColor: "#4a9c7d4d",
              borderRadius: 60,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <View
              style={{
                width: 76,
                height: 76,
                backgroundColor: "#4A9C7D",
                borderRadius: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isFocused ? <AIIconBold /> : <AIIconLinear />}
            </View>
          </View>
        );
      case "Policies":
        return (
          <TabBarButton
            title={title}
            focused={isFocused}
            icon={
              isFocused ? (
                <DocumentText1 variant="Bold" color={PRIMARY} />
              ) : (
                <DocumentText1 variant="Linear" color={INACTIVE_COLOR} />
              )
            }
          />
        );
      case "Profile":
        return (
          <TabBarButton
            title={title}
            focused={isFocused}
            icon={
              isFocused ? (
                <User variant="Bold" color={PRIMARY} />
              ) : (
                <User variant="Linear" color={INACTIVE_COLOR} />
              )
            }
          />
        );
      default:
        break;
    }
  };

  return <View>{renderIcon(title, isFocused)}</View>;
};

export default function CustomBottomTab({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const MARGIN = 0;
  const TAB_BAR_WIDTH = width - 2 * MARGIN;
  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const { isTabBarVisible } = useTabBar();

  if (!isTabBarVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.tabBarContainer, { width: TAB_BAR_WIDTH, bottom }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            Haptics.selectionAsync();
            navigation.navigate(route.name, { merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <AnimatedPressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={() =>
              isFocused ? (scale.value = withSpring(0.95)) : {}
            }
            onPressOut={() => (isFocused ? (scale.value = withSpring(1)) : {})}
            style={{ ...animatedStyle, flex: 1 }}
          >
            <View style={styles.contentContainer}>
              <BottomTabIcon title={route.name} isFocused={isFocused} />
            </View>
          </AnimatedPressable>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flex: 1,
    flexDirection: "row",
    height: "auto",
    width: "100%",
    position: "absolute",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: WHITE,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
