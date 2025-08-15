import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const dimensions = {
  window: {
    width,
    height,
  },
  
  // Screen breakpoints
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 414,
  isLargeDevice: width >= 414,

  // Common spacing values
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius values
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },

  // Icon sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },

  // Header heights
  headerHeight: Platform.select({
    ios: 44,
    android: 56,
    default: 44,
  }),

  // Tab bar height
  tabBarHeight: Platform.select({
    ios: 83,
    android: 56,
    default: 83,
  }),

  // Button heights
  buttonHeight: {
    sm: 32,
    md: 48,
    lg: 56,
  },

  // Input heights
  inputHeight: {
    sm: 32,
    md: 48,
    lg: 56,
  },
};
