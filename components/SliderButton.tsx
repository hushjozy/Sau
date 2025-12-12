import {Pressable, PressableProps, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

interface Props extends PressableProps {
  children: React.ReactNode;
}

const SliderButton = ({children, ...props}: Props) => {
  const [isPressed, setIsPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isPressed
            ? withTiming(0.5, {duration: 200})
            : withTiming(1, {duration: 200}),
        },
      ],
    };
  });

  return (
    <Pressable
      {...props}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}>
      <View style={styles.containerCenter}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SliderButton;
