import React from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Path } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { theme } from '../styles/theme';

const STAR_PATH = 'M50 6 L60 38 L94 38 L66 56 L76 88 L50 68 L24 88 L34 56 L6 38 L40 38 Z';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function OrnamentLux({
  size = 64,
  glowOpacity,   // Animated.Value 0..1
  breathY,       // Animated.Value translateY
  glintOpacity,  // Animated.Value 0..1
  glintScale,    // Animated.Value 1..x
}) {
  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        
      }}
    >
      

      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
  {/* (wyłączony) Radial glow zostawiamy, ale i tak ma opacity=0 */}
  <RadialGradient id="rg" cx="50%" cy="45%" r="60%">
    <Stop offset="0%" stopColor={theme.colors.gold} stopOpacity="0.35" />
    <Stop offset="55%" stopColor={theme.colors.gold} stopOpacity="0.10" />
    <Stop offset="100%" stopColor={theme.colors.gold} stopOpacity="0.0" />
  </RadialGradient>

  {/* Metaliczny gradient (twardy, bez "mleka") */}
  <LinearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
    <Stop offset="0%"   stopColor="#7a4a08" stopOpacity="1" />
    <Stop offset="35%"  stopColor={theme.colors.gold} stopOpacity="1" />
    <Stop offset="65%"  stopColor="#ffd040" stopOpacity="1" />
    <Stop offset="100%" stopColor="#5a2f00" stopOpacity="1" />
  </LinearGradient>
</Defs>

        <Path
  d={STAR_PATH}
  fill="url(#metal)"
  opacity={1}
  stroke="#1a0c00"       // ✅ twarda krawędź (ciemna)
  strokeWidth={2.2}      // ✅ dostosuj 1.6–2.6
  strokeLinejoin="miter" // ostrzejsze rogi
  strokeLinecap="square"
/>
      </Svg>
    </Animated.View>
  );
}