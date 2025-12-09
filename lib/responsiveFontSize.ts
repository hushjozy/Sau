import { PixelRatio, Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base dimensions are chosen to be a common standard device size (iPhone 6/7/8)
const baseWidth = 375;
const baseHeight = 667;

export const responsiveFontSize = (fontSize: number): number => {
  // Calculate the scale based on both width and height
  const scaleWidth = screenWidth / baseWidth;
  const scaleHeight = screenHeight / baseHeight;
  const scale = Math.min(scaleWidth, scaleHeight);

  // Ensure the new size is rounded to the nearest pixel
  const newSize = fontSize * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};