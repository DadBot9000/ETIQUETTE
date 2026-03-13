import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';

import HeroGridOverlay from '../components/HeroGridOverlay';
import { styles } from '../styles/styles';
import { theme } from '../styles/theme';
import { clampFont } from '../utils/responsive';
import { getLayoutProfile } from '../utils/layoutProfile';
import {
  listModuleDefinitions,
  resolveModuleView,
} from '../domain/learning/resolver';

const AnimatedCircleDash = Animated.createAnimatedComponent(Circle);

export default function HomeScreen({ t, navigate, devOverride, restartApp }) {
  const { width } = Dimensions.get('window');
  const layout = useMemo(() => getLayoutProfile(), [width]);

  const titleSize = useMemo(
    () => clampFont(layout.titleMin, 6, layout.titleMax),
    [layout.titleMin, layout.titleMax]
  );
  const subtitleSize = useMemo(
    () => clampFont(layout.subtitleMin, 2.8, layout.subtitleMax),
    [layout.subtitleMin, layout.subtitleMax]
  );
  const letterSpacing = useMemo(() => Math.min(6, 0.06 * titleSize), [titleSize]);

  const catalogStats = useMemo(() => {
    const modules = listModuleDefinitions();

    const topicsCount = modules.reduce((sum, module) => {
      const resolved = resolveModuleView(module.core.id, ['A', 'B', 'C', 'D']);
      return sum + (resolved?.content?.topics?.length ?? 0);
    }, 0);

    const passThresholds = modules
      .map((module) => module.core.cutoffPass)
      .filter((value) => Number.isFinite(value));

    const passThreshold = passThresholds.length
      ? `${Math.min(...passThresholds)}%`
      : '80%';

    return {
      modulesCount: modules.length,
      topicsCount,
      passThreshold,
    };
  }, []);

  const scaleCTA = useRef(new Animated.Value(1)).current;
  const scaleUtils = useRef(new Animated.Value(1)).current;

  const breath = useRef(new Animated.Value(0)).current;
  const glint = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(-50)).current;

  const RING_SIZE = 48;
  const INNER_RADIUS = 19;
  const RING_OFFSET_X = 0;
  const RING_OFFSET_Y = 8;

  const RING_TURNS = 5;
  const RING_SPIN_MS = 3100;

  const SPIN_MIN_DELAY = 8000;
  const SPIN_MAX_DELAY = 12000;

  const ringSpin = useRef(new Animated.Value(0)).current;
  const ringEdgeGlint = useRef(new Animated.Value(0)).current;

  const STROKE_W = 3.2;
  const R = (RING_SIZE / 2) - (STROKE_W / 2);
  const C = 2 * Math.PI * R;
  const SEG = C * 0.22;

  const ringRotate = ringSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 * RING_TURNS}deg`],
  });

  const GLINT_TURNS = 1.75;

  const glintDashOffset = ringEdgeGlint.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -C * GLINT_TURNS],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      sweep.setValue(-50);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(glint, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(glint, { toValue: 0, duration: 520, useNativeDriver: true }),
        ]),
        Animated.timing(sweep, { toValue: 60, duration: 520, useNativeDriver: true }),
      ]).start();
    }, 9000);

    return () => clearInterval(interval);
  }, [glint, sweep]);

  const glintScale = glint.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: 4200, useNativeDriver: true }),
        Animated.timing(breath, { toValue: 0, duration: 4200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breath]);

  const glowOpacity = 1;

  const ornamentY = breath.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const ctaLift = breath.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
  const sweepX = sweep;

  useEffect(() => {
    let alive = true;
    let timer;

    const fireEdgeGlint = () => {
      ringEdgeGlint.stopAnimation();
      ringEdgeGlint.setValue(0);

      Animated.timing(ringEdgeGlint, {
        toValue: 1,
        duration: 720,
        useNativeDriver: false,
      }).start(() => {
        if (!alive) return;
        ringEdgeGlint.setValue(0);
      });
    };

    const schedule = () => {
      const delay =
        SPIN_MIN_DELAY + Math.round(Math.random() * (SPIN_MAX_DELAY - SPIN_MIN_DELAY));

      timer = setTimeout(() => {
        if (!alive) return;

        ringSpin.stopAnimation();
        ringSpin.setValue(0);

        Animated.timing(ringSpin, {
          toValue: 1,
          duration: RING_SPIN_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (!alive) return;
          if (finished) {
            fireEdgeGlint();
          }
          schedule();
        });
      }, delay);
    };

    schedule();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [ringSpin, ringEdgeGlint]);

  const onPressInCTA = () =>
    Animated.spring(scaleCTA, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOutCTA = () =>
    Animated.spring(scaleCTA, { toValue: 1, useNativeDriver: true }).start();
  const onPressInUtil = () =>
    Animated.spring(scaleUtils, { toValue: 0.92, useNativeDriver: true }).start();
  const onPressOutUtil = () =>
    Animated.spring(scaleUtils, { toValue: 1, useNativeDriver: true }).start();

  const onDevPress = () => {
    if (typeof devOverride === 'function') {
      devOverride();
      return;
    }
    Alert.alert('DEV', 'Brak przekazanego devOverride do HomeScreen.');
  };

  const onRestartPress = () => {
    if (typeof restartApp === 'function') {
      restartApp();
      return;
    }
    Alert.alert('RESTART', 'Brak przekazanego restartApp do HomeScreen.');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: layout.isSmallPhone ? 100 : 140,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.hero,
            {
              paddingTop: layout.heroPaddingTop,
              paddingHorizontal: layout.heroPaddingHorizontal,
              justifyContent: layout.heroJustifyContent,
            },
          ]}
        >
          <Animated.View style={{ opacity: glowOpacity }}>
            <HeroGridOverlay pointerEvents="none" />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroOrnamentRingWrap,
              {
                top: layout.isSmallPhone ? 72 : 110,
                opacity: glowOpacity,
                transform: [
                  { translateY: ornamentY },
                  { translateX: RING_OFFSET_X },
                  { translateY: RING_OFFSET_Y },
                  { scale: glintScale },
                  { rotate: ringRotate },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[
                '#1a0c00',
                '#8a5008',
                '#d89018',
                '#ffd040',
                '#fff4a0',
                '#ffd040',
                '#b07010',
                '#6a3a00',
                '#1a0c00',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroOrnamentRingOuter}
            >
              <View
                style={[
                  styles.heroOrnamentRingInner,
                  {
                    width: INNER_RADIUS * 2,
                    height: INNER_RADIUS * 2,
                    borderRadius: INNER_RADIUS,
                  },
                ]}
              />

              <Text
                style={[
                  styles.heroOrnamentRingE,
                  { transform: [{ translateY: -2 }] },
                ]}
              >
                E
              </Text>

              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
              >
                <Svg width={RING_SIZE} height={RING_SIZE} viewBox="0 0 48 48">
                  <G rotation="90" origin="24, 24">
                    <AnimatedCircleDash
                      cx="24"
                      cy="24"
                      r={R}
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
                    <AnimatedCircleDash
                      cx="24"
                      cy="24"
                      r={R}
                      stroke="rgba(255,210,60,0.55)"
                      strokeWidth={STROKE_W + 1.2}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${SEG} ${C - SEG}`}
                      strokeDashoffset={glintDashOffset}
                      opacity={ringEdgeGlint.interpolate({
                        inputRange: [0, 0.1, 1],
                        outputRange: [0, 0.65, 0],
                      })}
                    />
                  </G>
                </Svg>
              </View>
            </LinearGradient>
          </Animated.View>

          <Text
            style={[
              styles.heroTagline,
              {
                marginTop: layout.isSmallPhone ? 90 : 120,
                marginBottom: layout.isSmallPhone ? 8 : 12,
              },
            ]}
          >
            {t('hero_tagline')}
          </Text>

          <Text
            style={[
              styles.heroTitle,
              {
                fontSize: titleSize,
                letterSpacing,
                lineHeight: titleSize * 1.02,
                marginBottom: layout.isSmallPhone ? 6 : 8,
              },
            ]}
          >
            {t('hero_title')}
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              {
                fontSize: subtitleSize,
                marginBottom: layout.isSmallPhone ? 14 : 18,
                maxWidth: layout.isSmallPhone ? 340 : 480,
              },
            ]}
          >
            {t('hero_subtitle')}
          </Text>

          <View
            style={{
              width: 72,
              height: 1,
              marginBottom: layout.isSmallPhone ? 14 : 18,
              overflow: 'hidden',
              opacity: 1,
            }}
          >
            <LinearGradient
              colors={['transparent', theme.colors.gold, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ position: 'absolute', inset: 0 }}
            />
            <Animated.View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 40,
                opacity: 0.7,
                transform: [{ translateX: sweepX }],
              }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>

          <View
            style={[
              styles.heroStats,
              {
                gap: layout.statGap,
                marginBottom: layout.sectionSpacing,
              },
            ]}
          >
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{catalogStats.modulesCount}</Text>
              <Text style={styles.heroStatLabel}>{t('stat_modules')}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{catalogStats.topicsCount}</Text>
              <Text style={styles.heroStatLabel}>{t('stat_topics')}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{catalogStats.passThreshold}</Text>
              <Text style={styles.heroStatLabel}>{t('stat_threshold')}</Text>
            </View>
          </View>

          <Animated.View
            style={{
              marginTop: layout.ctaTop,
              transform: [{ translateY: ctaLift }, { scale: scaleCTA }],
            }}
          >
            <Pressable
              onPressIn={onPressInCTA}
              onPressOut={onPressOutCTA}
              onPress={() => navigate('blocks')}
            >
              <LinearGradient
                colors={[theme.colors.gold, theme.colors.goldDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.ctaBtn,
                  {
                    paddingVertical: layout.isSmallPhone ? 12 : 14,
                    paddingHorizontal: layout.isSmallPhone ? 28 : 40,
                  },
                ]}
              >
                <Text style={styles.ctaText}>{t('cta_begin')}</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>

      <Animated.View style={[styles.devBtnFloating, { transform: [{ scale: scaleUtils }] }]}>
        <Pressable
          onPress={onDevPress}
          onPressIn={onPressInUtil}
          onPressOut={onPressOutUtil}
          style={styles.devBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.devBtnText}>DEV</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}