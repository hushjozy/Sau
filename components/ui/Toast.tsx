import { WHITE } from "@constants/colors";
// import CloseIcon from "@assets/icons/CloseIcon";
// import ToastIcon from "@assets/icons/toast-icon";
import { ToastModalParams } from "@provider/ToastProvider";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import Animated, {
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withDelay,
//   withSequence,
//   withSpring,
//   withTiming,
// } from "react-native-reanimated";

type ToastProps = {
  open: boolean;
  toastModalOptions: ToastModalParams;
  closeModal: () => void;
};

const { width: WIDTH } = Dimensions.get("screen");

const Toast = ({ open, toastModalOptions, closeModal }: ToastProps) => {
  // const toastTopAnimation = useSharedValue(-100);
  // const context = useSharedValue(0);

  const TOP_VALUE = Platform.OS === "ios" ? 60 : 30;

  const show = useCallback(() => {
    Haptics.notificationAsync(
      toastModalOptions.type === "success"
        ? Haptics.NotificationFeedbackType.Success
        : toastModalOptions.type === "warning"
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Error
    );

    //   toastTopAnimation.value = withSequence(
    //     withTiming(TOP_VALUE),
    //     withDelay(
    //       toastModalOptions.duration,
    //       withTiming(-100, undefined, (finish) => {
    //         if (finish) {
    //           runOnJS(closeModal)();
    //         }
    //       })
    //     )
    //   );
  }, [TOP_VALUE]);

  const close = () => {
    // toastTopAnimation.value = withSequence(
    //   withTiming(-100, undefined, (finish) => {
    //     if (finish) {
    //       runOnJS(closeModal)();
    //     }
    //   })
    // );
  };

  // const animatedTopStyles = useAnimatedStyle(() => {
  //   return {
  //     // top: toastTopAnimation.value,
  //   };
  // });

  // const pan = Gesture.Pan()
  //   .onBegin(() => {
  //     context.value = toastTopAnimation.value;
  //   })
  //   .onUpdate((event) => {
  //     if (event.translationY < 100) {
  //       toastTopAnimation.value = withSpring(
  //         context.value + event.translationY,
  //         {
  //           damping: 600,
  //           stiffness: 100,
  //         }
  //       );
  //     }
  //   })
  //   .onEnd((event) => {
  //     if (event.translationY < 0) {
  //       toastTopAnimation.value = withTiming(-100, undefined, (finish) => {
  //         if (finish) {
  //           runOnJS(closeModal)();
  //         }
  //       });
  //     } else if (event.translationY > 0) {
  //       toastTopAnimation.value = withSequence(
  //         withTiming(TOP_VALUE),
  //         withDelay(
  //           toastModalOptions.duration,
  //           withTiming(-100, undefined, (finish) => {
  //             if (finish) {
  //               runOnJS(closeModal)();
  //             }
  //           })
  //         )
  //       );
  //     }
  //   });

  useEffect(() => {
    if (open) {
      show();
    }
  }, [open, show]);

  return (
    <>
      {/* {open && (
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.toastContainer,

              animatedTopStyles,
              {
                borderWidth: 3,
                borderColor:
                  toastModalOptions.type === "success"
                    ? "#04802E"
                    : toastModalOptions.type === "warning"
                    ? "#DD900D"
                    : toastModalOptions.type === "error"
                    ? "#CB1A14"
                    : "#0D5EBA",
              },
            ]}
            className=""
          >
            <View style={styles.leftItem}>
              {toastModalOptions.type === "success" ? (
                <ToastIcon
                  bgColor="#E7F6EC"
                  borderColor="#B5E3C4"
                  iconColor="#04802E"
                />
              ) : toastModalOptions.type === "error" ? (
                <ToastIcon
                  bgColor="#FBEAE9"
                  borderColor="#F2BCBA"
                  iconColor="#CB1A14"
                />
              ) : toastModalOptions.type === "warning" ? (
                <ToastIcon
                  bgColor="#FEF6E7"
                  borderColor="#FBE2B7"
                  iconColor="#DD900D"
                />
              ) : (
                <ToastIcon
                  bgColor="#E3EFFC"
                  borderColor="#C6DDF7"
                  iconColor="#1671D9"
                />
              )}

              <View style={{ gap: 2 }}>
                {toastModalOptions.title && (
                  <Text allowFontScaling={false} style={[styles.toastTitle]}>
                    {toastModalOptions.title}
                  </Text>
                )}
                {toastModalOptions.description && (
                  <Text
                    allowFontScaling={false}
                    style={[styles.toastDescription]}
                  >
                    {toastModalOptions.description}
                  </Text>
                )}
                {toastModalOptions.toastAction}
              </View>
            </View>

            <TouchableOpacity
              style={{ alignSelf: "center", paddingBottom: 5 }}
              onPress={close}
            >
              <CloseIcon />
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      )} */}
    </>
  );
};

export default Toast;

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 0,
    width: WIDTH * 0.9,
    padding: 10,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    zIndex: 20,
    justifyContent: "space-between",
    backgroundColor: WHITE,
    borderTopColor: "#E4E7EC",
    borderBottomColor: "#E4E7EC",
    borderRightColor: "#E4E7EC",
    minHeight: 60,
    borderLeftWidth: 8,
  },
  toastTitle: {
    fontSize: 14,
    fontFamily: "Bold",
    fontWeight: "bold",
  },
  toastDescription: {
    fontSize: 14,
    color: "#475367",
    fontFamily: "Regular",
  },
  leftItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRightWidth: 2,
    borderColor: "#F0F2F5",
    paddingRight: 16,
    width: "90%",
  },
  indicator: {},
});
