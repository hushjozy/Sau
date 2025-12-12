import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface AnimatedLoadingDotsProps {
  size?: number;
  color?: string;
  duration?: number;
  dotCount?: number;
  spacing?: number;
}

const AnimatedLoadingDots: React.FC<AnimatedLoadingDotsProps> = ({
  size = 8,
  color = '#2E5A55',
  duration = 1000,
  dotCount = 3,
  spacing = 8,
}) => {
  const dots = Array.from({ length: dotCount }, (_, index) => ({
    scale: useSharedValue(1),
    opacity: useSharedValue(0.5),
  }));

  useEffect(() => {
    dots.forEach((dot, index) => {
      const delay = index * (duration / dotCount);
      
      dot.scale.value = withDelay(
        delay,
        withRepeat(
          withTiming(1.5, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      );

      dot.opacity.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      );
    });
  }, [duration, dotCount]);

  return (
    <View style={[styles.container, { gap: spacing }]}>
      {dots.map((dot, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: dot.scale.value }],
            opacity: dot.opacity.value,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: size / 2,
              },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    // Styles will be applied dynamically
  },
});

export default AnimatedLoadingDots; 