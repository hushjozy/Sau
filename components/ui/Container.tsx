import { WHITE } from "@constants/colors";
import { getItem } from "@lib/storage";
import { useTheme } from "@provider/ThemeProvider";
import { useUser } from "@provider/UserProvider";
import { useNavigation } from "@react-navigation/native";
import React, {
  ComponentPropsWithRef,
  Ref,
  forwardRef,
  useEffect,
} from "react";
import {
  BackHandler,
  Dimensions,
  Platform,
  StyleSheet,
  View,
} from "react-native";
// import Animated, {
//   useAnimatedStyle,
//   withTiming,
// } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("screen");

interface Props extends ContainerType {
  children: React.ReactNode;
  // statusBarProps:
}

type ContainerType = ComponentPropsWithRef<typeof View>;
// const AnimatedView = Animated.createAnimatedComponent(SafeAreaView);

function Container({ children, style, ...props }: Props, ref: Ref<View>) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const accessToken = getItem("accessToken", "string");
  const { unauthenticate } = useUser();

  // const backgroundColorAnimation = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor:
  //       theme === "dark"
  //         ? withTiming("black", { duration: 200 })
  //         : withTiming(WHITE, { duration: 200 }),
  //   };
  // }, [theme]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (!accessToken) {
      unauthenticate();
    }
  }, [accessToken]);

  return (
    <View
      // edges={["top"]}
      style={[
        styles.container,
        // backgroundColorAnimation,

        {
          // paddingTop: insets.top,
          // paddingTop: insets.top + (Platform.OS === "ios" ? 88 : 56),
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
      ref={ref}
      className={`pt-[59px] ${props?.className}`}
    >
      <View style={{ height: Platform.OS === "ios" ? 45 : 35 }} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
});

export default forwardRef(Container);
