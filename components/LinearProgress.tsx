import { PRIMARY } from "@constants/colors";
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Text } from "react-native";

interface ProgressBarProps {
  progress: number; // 0 to 1
}

const LinearProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 400, // smooth animation
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const colorInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["gray", PRIMARY], // gradient-like effect
  });
  const textColorInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["black", "white"], // gradient-like effect
  });
  return (
    <View style={styles.progcontainer}>
      <Animated.View
        style={[
          styles.progfill,
          {
            width: widthInterpolated,
            backgroundColor: colorInterpolated,
          },
        ]}
      />
      <Animated.Text
        style={[styles.progtext, { color: textColorInterpolated }]}
      >
        {Math.round(progress * 100)}%
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progcontainer: {
    height: 16,
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 10,
    justifyContent: "center",
  },
  progfill: {
    height: "100%",
    borderRadius: 5,
  },
  progtext: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "600",
    color: "#000",
    fontSize: 12,
  },
});

export default LinearProgressBar;
