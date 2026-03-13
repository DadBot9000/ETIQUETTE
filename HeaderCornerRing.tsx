import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Pressable } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { styles } from '../styles/styles';

const AnimatedCircleDash = Animated.createAnimatedComponent(Circle);

// --- KONFIGURACJA ---
const SPIN_VOLUME = 0.5; // Tutaj regulujesz głośność (0.0 - 1.0)

export default function HeaderCornerRing() {
  // 1. STAŁE GEOMETRII
  const RING_SIZE = 48;
  const INNER_RADIUS = 19;
  const RING_TURNS = 5;
  const RING_SPIN_MS = 3100;
  const SPIN_MIN_DELAY = 8000;
  const SPIN_MAX_DELAY = 12000;

  const STROKE_W = 3.2;
  const R = (RING_SIZE / 2) - (STROKE_W / 2);
  const C = 2 * Math.PI * R;
  const SEG = C * 0.22;

  // 2. INSTANCJE ANIMACJI I REFY DYNAMIKI
  const ringSpin = useRef(new Animated.Value(0)).current;
  const ringEdgeGlint = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const alive = useRef(true);
  
  const currentAngle = useRef(0);
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 3. ŁADOWANIE AUDIO I CYKL ŻYCIA
  useEffect(() => {
    async function initAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/spin.mp3'),
          { volume: SPIN_VOLUME }
        );
        soundRef.current = sound;
      } catch (e) {
        console.log("Audio Init Error:", e);
      }
    }
    initAudio();

    // Pętla oddychania
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1, duration: 2800, useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 0, duration: 3200, useNativeDriver: true }),
      ])
    ).start();

    // Harmonogram naturalnych obrotów
    let timer: NodeJS.Timeout;
    const schedule = () => {
      const delay = SPIN_MIN_DELAY + Math.round(Math.random() * (SPIN_MAX_DELAY - SPIN_MIN_DELAY));
      timer = setTimeout(() => {
        if (!alive.current) return;
        currentAngle.current += (360 * RING_TURNS);
        Animated.timing(ringSpin, {
          toValue: currentAngle.current,
          duration: RING_SPIN_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && alive.current) {
            fireEdgeGlint();
            schedule();
          }
        });
      }, delay);
    };

    schedule();
    return () => {
      alive.current = false;
      clearTimeout(timer);
      soundRef.current?.unloadAsync();
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
    };
  }, []);

  // 4. LOGIKA DŹWIĘKU (DYNAMIC PITCH)
  const playSpinSound = async (duration: number) => {
    if (soundRef.current) {
      try {
        if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
        const startTime = Date.now();
        const initialRate = Math.min(1.0 + (clickCount.current * 0.1), 2.0);
        
        await soundRef.current.setStatusAsync({
          shouldPlay: true,
          isLooping: true,
          volume: SPIN_VOLUME,
          rate: initialRate,
          shouldCorrectPitch: false,
        });

        soundIntervalRef.current = setInterval(async () => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / duration;

          if (progress >= 1) {
            if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
            await soundRef.current?.stopAsync();
            return;
          }

          const currentRate = initialRate - (progress * (initialRate - 0.5));
          const currentVolume = SPIN_VOLUME * (1 - progress * 0.5);

          await soundRef.current?.setStatusAsync({
            rate: Math.max(currentRate, 0.5),
            volume: currentVolume,
          });
        }, 50);
      } catch (error) {
        console.log("Audio Sync Error:", error);
      }
    }
  };

  // 5. INTERPOLACJE
  const translateY = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, -5], 
  });

  const ringRotate = ringSpin.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const glintDashOffset = ringEdgeGlint.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -C * 1.75],
  });

  const fireEdgeGlint = () => {
    ringEdgeGlint.stopAnimation();
    ringEdgeGlint.setValue(0);
    Animated.timing(ringEdgeGlint, {
      toValue: 1,
      duration: 720,
      useNativeDriver: false,
    }).start(() => {
      if (alive.current) ringEdgeGlint.setValue(0);
    });
  };

  // 6. OBSŁUGA DOTYKU (FIZYKA + SNAP)
  const handlePress = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 600) {
      clickCount.current = Math.min(clickCount.current + 1, 15); 
    } else {
      clickCount.current = 1; 
    }
    lastClickTime.current = now;

    const rawTarget = currentAngle.current + 360 + (clickCount.current * 180);
    currentAngle.current = Math.ceil(rawTarget / 360) * 360;

    const baseDuration = 1000;
    const inertiaDuration = baseDuration + (clickCount.current * 250);

    playSpinSound(inertiaDuration);

    Animated.timing(ringSpin, {
      toValue: currentAngle.current,
      duration: inertiaDuration,
      useNativeDriver: true,
      easing: (t) => t * (2 - t), 
    }).start(({ finished }) => {
      if (finished) {
        fireEdgeGlint();
        if (Date.now() - lastClickTime.current > 1000) {
          clickCount.current = 0;
        }
      }
    });
  };

  // 7. RENDER
  return (
    <Pressable onPress={handlePress}>
      <Animated.View 
        style={{ 
          width: RING_SIZE, 
          height: RING_SIZE, 
          transform: [
            { translateY: translateY }, 
            { rotate: ringRotate } 
          ] 
        }}
      >
        <LinearGradient
          colors={['#1a0c00', '#8a5008', '#d89018', '#ffd040', '#fff4a0', '#ffd040', '#b07010', '#6a3a00', '#1a0c00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroOrnamentRingOuter}
        >
          <View style={{
            position: 'absolute',
            width: INNER_RADIUS * 2,
            height: INNER_RADIUS * 2,
            borderRadius: INNER_RADIUS,
            backgroundColor: '#0F1111' 
          }} />
          <Text style={[styles.heroOrnamentRingE, { transform: [{ translateY: -2 }] }]}>E</Text>
          <View pointerEvents="none" style={{ position: 'absolute', inset: 0 }}>
            <Svg width={RING_SIZE} height={RING_SIZE} viewBox="0 0 48 48">
              <G rotation="90" origin="24, 24">
                <AnimatedCircleDash
                  cx="24" cy="24" r={R}
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth={STROKE_W}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${SEG} ${C - SEG}`}
                  strokeDashoffset={glintDashOffset}
                  opacity={ringEdgeGlint.interpolate({
                    inputRange: [0, 0.08, 1],
                    outputRange: [0, 1, 0],
                  })}
                />
              </G>
            </Svg>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}