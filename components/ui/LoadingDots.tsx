import { PRIMARY } from "@constants/colors";
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const LoadingDots = ({
  containerClass,
  dotClass,
}: {
  containerClass?: string;
  dotClass?: string;
}) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, [dot1, dot2, dot3]);

  return (
    <View
      className={`flex flex-row items-center justify-center h-[300px] ${containerClass}`}
    >
      <Animated.View
        style={[{ opacity: dot1 }]}
        className={`bg-[#4A9C7D] w-[30px] h-[30px] rounded-full ${dotClass}`}
      />
      <Animated.View
        style={[{ opacity: dot2 }]}
        className={`bg-[#4A9C7D] w-[30px] h-[30px] rounded-full ${dotClass}`}
      />
      <Animated.View
        style={[{ opacity: dot3 }]}
        className={`bg-[#4A9C7D] w-[30px] h-[30px] rounded-full ${dotClass}`}
      />
    </View>
  );
};

export default LoadingDots;
