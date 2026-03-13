import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export default function CoinOrnament({ size = 56, children }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true;
    let timer;

    const schedule = () => {
      const delay = 8000 + Math.round(Math.random() * 4000); // 8–12s
      timer = setTimeout(() => {
        if (!alive) return;

        spin.setValue(0);
        Animated.timing(spin, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }).start(() => {
          if (alive) schedule();
        });
      }, delay);
    };

    schedule();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [],
      }}
    >
      <View style={{ width: size, height: size }}>{children}</View>
    </Animated.View>
  );
}