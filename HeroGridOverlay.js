import React from 'react';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

export default function HeroGridOverlay() {
  // radial + grid lines (repeating-linear-gradient imitation)
  const step = 40;
  const size = 600;

  const lines = [];
  for (let i = 0; i <= size; i += step) {
    lines.push(<Line key={'v' + i} x1={i} y1={0} x2={i} y2={size} stroke="rgba(212,175,55,0.03)" strokeWidth={1} />);
    lines.push(<Line key={'h' + i} x1={0} y1={i} x2={size} y2={i} stroke="rgba(212,175,55,0.03)" strokeWidth={1} />);
  }

  return (
    <View pointerEvents="none" style={{ position: 'absolute', inset: 0 }}>
      <LinearGradient
  colors={['transparent', 'rgba(212,175,55,0.06)']}
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 1 }}
  style={{ position: 'absolute', inset: 0 }}
/>
      <View style={{ position: 'absolute', inset: 0, opacity: 1 }}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} preserveAspectRatio="xMidYMid slice">
          {lines}
        </Svg>
      </View>
    </View>
  );
}