import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, {
  Defs,
  Stop,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Circle,
  Path,
} from 'react-native-svg';

type Props = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  fadeInDuration?: number;
  breathAmplitude?: number;
  breathDuration?: number;
  idleSpinDuration?: number;
  letterSpinTurns?: number;
  letterSpinDuration?: number;
  ringTapSpinTurns?: number;
  ringTapSpinDuration?: number;
  onLetterSpinComplete?: () => void;
};

export default function SplashStyleRing({
  size = 340,
  style,
  fadeInDuration = 900,
  breathAmplitude = 10,
  breathDuration = 3600,
  idleSpinDuration = 6800,
  letterSpinTurns = 5,
  letterSpinDuration = 1600,
  ringTapSpinTurns = 4,
  ringTapSpinDuration = 2300,
  onLetterSpinComplete,
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const idleSpin = useRef(new Animated.Value(0)).current;
  const letterSpin = useRef(new Animated.Value(0)).current;
  const ringTapSpin = useRef(new Animated.Value(0)).current;
  const isLetterSpinning = useRef(false);
  const hasNavigated = useRef(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: fadeInDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: breathDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: breathDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    idleSpin.setValue(0);
    Animated.loop(
      Animated.timing(idleSpin, {
        toValue: 1,
        duration: idleSpinDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [fade, breathe, idleSpin, fadeInDuration, breathDuration, idleSpinDuration]);

  const translateY = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -breathAmplitude],
  });

  const idleRotate = idleSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ringTapRotate = ringTapSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${-360 * ringTapSpinTurns}deg`],
  });

  const letterRotate = letterSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 * letterSpinTurns}deg`],
  });

  const letterScaleX = letterSpin.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.45, 1, 0.45, 1],
  });

  const letterBrightness = letterSpin.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.35, 1, 0.35, 1],
  });

  const handleLetterPress = () => {
    if (isLetterSpinning.current || hasNavigated.current) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid).catch(() => {});

    isLetterSpinning.current = true;
    hasNavigated.current = false;

    letterSpin.setValue(0);
    ringTapSpin.setValue(0);

    Animated.parallel([
      Animated.timing(letterSpin, {
        toValue: 1,
        duration: letterSpinDuration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(ringTapSpin, {
        toValue: 1,
        duration: ringTapSpinDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished || hasNavigated.current) return;

      hasNavigated.current = true;
      isLetterSpinning.current = false;
      setHidden(true);

      requestAnimationFrame(() => {
        onLetterSpinComplete?.();
      });
    });
  };

  const rOut = size / 2;
  const rIn = rOut * (96 / 124);
  const cx = size / 2;
  const cy = size / 2;

  if (hidden) return null;

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          opacity: fade,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <View style={{ width: size, height: size }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            transform: [{ rotate: idleRotate }],
          }}
        >
          <Animated.View
            style={{
              width: size,
              height: size,
              transform: [{ rotate: ringTapRotate }],
            }}
          >
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <Defs>
                <SvgLinearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#120800" />
                  <Stop offset="10%" stopColor="#5c3300" />
                  <Stop offset="25%" stopColor="#c07a10" />
                  <Stop offset="40%" stopColor="#ffcf40" />
                  <Stop offset="50%" stopColor="#fff7c2" />
                  <Stop offset="60%" stopColor="#ffcf40" />
                  <Stop offset="75%" stopColor="#a36200" />
                  <Stop offset="90%" stopColor="#4a2600" />
                  <Stop offset="100%" stopColor="#120800" />
                </SvgLinearGradient>

                <RadialGradient id="edgeGlow" cx="50%" cy="50%" r="50%">
                  <Stop offset="62%" stopColor="rgba(255,185,30,0)" />
                  <Stop offset="80%" stopColor="rgba(255,185,30,0.08)" />
                  <Stop offset="92%" stopColor="rgba(255,185,30,0.16)" />
                  <Stop offset="100%" stopColor="rgba(255,185,30,0.24)" />
                </RadialGradient>

                <RadialGradient id="rimLight" cx="50%" cy="50%" r="50%">
                  <Stop offset="70%" stopColor="rgba(255,255,220,0)" />
                  <Stop offset="86%" stopColor="rgba(255,240,170,0.12)" />
                  <Stop offset="94%" stopColor="rgba(255,230,140,0.24)" />
                  <Stop offset="100%" stopColor="rgba(255,210,80,0.34)" />
                </RadialGradient>
              </Defs>

              <Circle cx={cx} cy={cy} r={rOut} fill="url(#edgeGlow)" />
              <Path d={ringPath(cx, cy, rOut, rIn)} fill="url(#goldRing)" />
              <Path
                d={ringPath(cx, cy, rOut, rIn)}
                fill="url(#rimLight)"
                opacity={0.12}
              />
            </Svg>
          </Animated.View>
        </Animated.View>

        <View
          pointerEvents="none"
          style={[
            styles.innerCore,
            {
              width: rIn * 2,
              height: rIn * 2,
              borderRadius: rIn,
              left: cx - rIn,
              top: cy - rIn,
            },
          ]}
        />

        <View style={styles.centerFill} pointerEvents="box-none">
          <Pressable
            onPress={handleLetterPress}
            hitSlop={24}
            style={[
              styles.ePressable,
              {
                width: rIn * 1.9,
                height: rIn * 1.9,
                borderRadius: rIn,
                overflow: 'visible',
              },
            ]}
          >
            <Animated.View
              style={{
                transform: [
                  { perspective: 1000 },
                  { rotateY: letterRotate },
                  { scaleX: letterScaleX },
                ],
              }}
            >
              <Animated.Text
                style={[
                  styles.e,
                  {
                    fontSize: size * 0.60,
                    textShadowRadius: size * 0.035,
                    opacity: letterBrightness,
                  },
                ]}
              >
                E
              </Animated.Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function ringPath(cx: number, cy: number, rOut: number, rIn: number) {
  return [
    `M ${cx + rOut} ${cy}`,
    `A ${rOut} ${rOut} 0 1 1 ${cx - rOut} ${cy}`,
    `A ${rOut} ${rOut} 0 1 1 ${cx + rOut} ${cy}`,
    `M ${cx + rIn} ${cy}`,
    `A ${rIn} ${rIn} 0 1 0 ${cx - rIn} ${cy}`,
    `A ${rIn} ${rIn} 0 1 0 ${cx + rIn} ${cy}`,
    'Z',
  ].join(' ');
}

const styles = StyleSheet.create({
  innerCore: {
    position: 'absolute',
    backgroundColor: '#0F1111',
  },
  centerFill: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  ePressable: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  e: {
    color: '#ffffff',
    fontFamily: 'PlayfairDisplay_600',
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
    textShadowColor: 'rgba(255,255,255,0.8)',
    transform: [{ translateY: -27 }],
  },
});