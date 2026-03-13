import { Dimensions } from 'react-native';

export function getResponsiveColumns() {
  const { width } = Dimensions.get('window');
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

export function clampFont(min, vwFactor, max) {
  const { width } = Dimensions.get('window');
  const size = (vwFactor / 100) * width;
  return Math.max(min, Math.min(size, max));
}