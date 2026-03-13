import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, cancelAnimation } from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Audio } from 'expo-av';
import { theme } from '../styles/theme';

export default function InteractiveERing({ size = 200 }) {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = async () => {
    // 1. Animacja obrotu
    rotation.value = withSpring(rotation.value + 360, { damping: 10, stiffness: 80 });

    // 2. Dźwięk (wymaga pliku audio w assets)
    try {
      const { sound } = await Audio.Sound.createAsync(require('../assets/audio/wooshidl.mp3'));
      await sound.playAsync();
      await sound.unloadAsync();
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.container, animatedStyle, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={theme.colors.goldDark} />
              <Stop offset="50%" stopColor={theme.colors.gold} />
              <Stop offset="100%" stopColor={theme.colors.goldLight} />
            </LinearGradient>
          </Defs>
          <Circle cx="100" cy="100" r="90" stroke="url(#goldGrad)" strokeWidth="8" fill="none" />
          <Path d="M90 60 H110 V140 H90 Z M90 60 H130 V75 H90 Z M90 100 H120 V115 H90 Z M90 140 H130 V155 H90 Z" fill={theme.colors.gold} />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({ container: { alignItems: 'center', justifyContent: 'center' } });