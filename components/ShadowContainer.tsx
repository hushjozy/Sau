import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

export type ShadowContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const ShadowContainer: React.FC<ShadowContainerProps> = ({children, style}) => {
  return (
    <View
      style={[pageStyles.container, pageStyles.buttonContainer, {...style}]}>
      {children}
    </View>
  );
};

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: {
      width: 0,
      height: 0.2,
    },
    shadowRadius: 1,
    shadowOpacity: 0.3,
    elevation: 3,
  },
});

export default ShadowContainer;
