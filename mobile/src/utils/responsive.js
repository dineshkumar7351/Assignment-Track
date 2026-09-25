import { useWindowDimensions, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Standard Guideline Dimensions (Based on standard iPhone 11 / Pixel 4 screen)
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

/**
 * Linear horizontal scaling based on standard guideline width
 */
export const scale = (size) => (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size;

/**
 * Linear vertical scaling based on standard guideline height
 */
export const verticalScale = (size) => (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size;

/**
 * Controlled moderate scaling factor to prevent oversized UI elements on large devices/tablets
 */
export const moderateScale = (size, factor = 0.4) => {
  return size + (scale(size) - size) * factor;
};

/**
 * Dynamic React Hook to track live screen dimensions and responsive breakpoints
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmallDevice = width < 360;
  const isTablet = width >= 600;
  const isLargeTablet = width >= 900;
  const isLandscape = width > height;

  // Dynamic Moderate Scale relative to live window dimensions
  const ms = (size, factor = 0.35) => {
    const horizontalScale = (width / GUIDELINE_BASE_WIDTH) * size;
    return Math.round(size + (horizontalScale - size) * factor);
  };

  // Dynamic Horizontal Scale
  const s = (size) => Math.round((width / GUIDELINE_BASE_WIDTH) * size);

  // Dynamic Vertical Scale
  const vs = (size) => Math.round((height / GUIDELINE_BASE_HEIGHT) * size);

  // Adaptive Container Style to constrain width on large screens / tablets
  const maxContentWidth = isLargeTablet ? 840 : isTablet ? 640 : '100%';
  const containerStyle = {
    width: '100%',
    maxWidth: isTablet ? maxContentWidth : '100%',
    alignSelf: 'center',
  };

  // Adaptive Grid Column count
  const metricColumns = isTablet ? 4 : isSmallDevice ? 1 : 2;

  // Adaptive padding
  const screenPadding = isTablet ? 28 : isSmallDevice ? 12 : 18;

  return {
    width,
    height,
    isSmallDevice,
    isTablet,
    isLargeTablet,
    isLandscape,
    scale: s,
    verticalScale: vs,
    moderateScale: ms,
    ms,
    s,
    vs,
    padding: screenPadding,
    screenPadding,
    containerStyle,
    metricColumns,
  };
}

export default {
  scale,
  verticalScale,
  moderateScale,
  useResponsive,
};
