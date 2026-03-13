import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import HeroGridOverlay from '../components/HeroGridOverlay';
import { styles } from '../styles/styles';
import { theme } from '../styles/theme';
import { clampFont } from '../utils/responsive';
import { getLayoutProfile } from '../utils/layoutProfile';
import {
  listModuleDefinitions,
  resolveModuleView,
} from '../domain/learning/resolver';
import { useLearningPaths } from '../state/learning/LearningPathsContext';

const NAME_STORAGE_KEY = '@user_custom_name';

function tOr(t, key, fallback) {
  const value = typeof t === 'function' ? t(key) : key;
  return !value || value === key ? fallback : value;
}

const PROFILE_ORDER = ['PL', 'EN', 'DE', 'ES', 'FR', 'JP', 'SE', 'BR', 'IT', 'AE', 'US', 'KR'];

function buildTrackOrder(primaryTrackId) {
  const ordered = [primaryTrackId, ...PROFILE_ORDER];
  return [...new Set(ordered)];
}

export default function UserHomeScreen({
  t,
  navigate,
  userStats,
  setIsAuthenticated,
  showToast,
  completeAuthLogout,
}) {
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

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(
    tOr(t, 'hold_to_edit', 'Hold to edit')
  );

  const scaleCTA = useRef(new Animated.Value(1)).current;
  const { state, getProgress } = useLearningPaths();

  const primaryTrackId = state.activeTrackOrder?.[0] || 'PL';
  const trackOrder = useMemo(() => buildTrackOrder(primaryTrackId), [primaryTrackId]);
  const moduleDefinitions = useMemo(() => listModuleDefinitions(), []);

  useEffect(() => {
    const loadName = async () => {
      try {
        const savedName = await AsyncStorage.getItem(NAME_STORAGE_KEY);
        if (savedName) {
          setUserName(savedName);
        }
      } catch (error) {
        console.error('[UserHomeScreen] Failed to load saved name', error);
      }
    };

    loadName();
  }, []);

  const saveName = async (nextName) => {
    try {
      await AsyncStorage.setItem(NAME_STORAGE_KEY, nextName);
    } catch (error) {
      console.error('[UserHomeScreen] Failed to save name', error);
    }
  };

  const dashboardStats = useMemo(() => {
    const progressEntries = moduleDefinitions
      .map((module) => getProgress(primaryTrackId, module.core.id))
      .filter(Boolean);

    const completedEntries = progressEntries.filter((entry) => entry?.passed);
    const attemptedEntries = progressEntries.filter(
      (entry) => (entry?.attempts ?? 0) > 0
    );

    const avgScore = completedEntries.length
      ? Math.round(
          completedEntries.reduce(
            (sum, entry) => sum + (entry?.bestScore ?? 0),
            0
          ) / completedEntries.length
        )
      : 0;

    const percentTotal = moduleDefinitions.length
      ? Math.round((completedEntries.length / moduleDefinitions.length) * 100)
      : 0;

    return {
      completedCount: completedEntries.length,
      totalModules: moduleDefinitions.length,
      avgScore,
      percentTotal,
      inProgress: attemptedEntries.some((entry) => !entry?.passed),
      viewedTopics: userStats?.viewedTopics ?? 0,
    };
  }, [getProgress, moduleDefinitions, primaryTrackId, userStats?.viewedTopics]);

  const lastResolvedModule = useMemo(() => {
    const lastVisitedId = state.lastVisitedByTrack?.[primaryTrackId];

    if (lastVisitedId) {
      const resolved = resolveModuleView(lastVisitedId, trackOrder);
      if (resolved) {
        return resolved;
      }
    }

    const firstModule = moduleDefinitions[0];
    if (!firstModule) {
      return null;
    }

    return resolveModuleView(firstModule.core.id, trackOrder);
  }, [moduleDefinitions, primaryTrackId, state.lastVisitedByTrack, trackOrder]);

  const onPressInCTA = () => {
    Animated.spring(scaleCTA, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const onPressOutCTA = () => {
    Animated.spring(scaleCTA, { toValue: 1, useNativeDriver: true }).start();
  };

   const handleLogout = async () => {
    try {
      if (typeof completeAuthLogout === 'function') {
        completeAuthLogout();
        return;
      }

      setIsAuthenticated(false);
      navigate('auth');

      if (typeof showToast === 'function') {
        showToast(tOr(t, 'logout_success', 'Signed out'), 'success');
      }
    } catch (error) {
      console.error('[UserHomeScreen] Logout failed', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.hero,
            {
              paddingTop: layout.heroPaddingTop,
              paddingHorizontal: layout.heroPaddingHorizontal,
              justifyContent: layout.heroJustifyContent,
              flex: 1,
            },
          ]}
        >
          <HeroGridOverlay pointerEvents="none" />



          <View
            style={{
              marginBottom: layout.userLabelBlockBottom,
              alignItems: 'center',
              minHeight: layout.isSmallPhone ? 52 : 60,
            }}
          >
            <Text
              style={{
                color: '#4A4A4A',
                fontSize: layout.isSmallPhone ? 9 : 10,
                fontFamily: 'CormorantGaramond_500',
                letterSpacing: 2,
                marginBottom: 4,
                textTransform: 'uppercase',
              }}
            >
              {tOr(t, 'user_label', 'USER')}
            </Text>

            {isEditing ? (
              <TextInput
                value={userName}
                onChangeText={setUserName}
                onBlur={() => {
                  const next = userName.trim() || tOr(t, 'hold_to_edit', 'Hold to edit');
                  setUserName(next);
                  setIsEditing(false);
                  saveName(next);
                }}
                onSubmitEditing={() => {
                  const next = userName.trim() || tOr(t, 'hold_to_edit', 'Hold to edit');
                  setUserName(next);
                  setIsEditing(false);
                  saveName(next);
                }}
                autoFocus
                style={{
                  color: theme.colors.gold,
                  fontSize: clampFont(
                    layout.isSmallPhone ? 20 : 24,
                    5,
                    layout.isSmallPhone ? 28 : 32
                  ),
                  fontFamily: 'PlayfairDisplay_600',
                  textAlign: 'center',
                  minWidth: 180,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.gold,
                  padding: 0,
                }}
              />
            ) : (
              <Pressable
                onLongPress={() => setIsEditing(true)}
                delayLongPress={800}
                style={{ alignItems: 'center' }}
              >
                <Text
                  style={{
                    color: theme.colors.gold,
                    fontSize: clampFont(
                      layout.isSmallPhone ? 20 : 24,
                      5,
                      layout.isSmallPhone ? 28 : 32
                    ),
                    fontFamily: 'PlayfairDisplay_600',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {userName}
                </Text>
              </Pressable>
            )}

            <View
              style={{
                width: 30,
                height: 1,
                backgroundColor: theme.colors.gold,
                marginTop: 10,
                opacity: 0.4,
              }}
            />
          </View>

          <Text
            style={[
              styles.heroTagline,
              {
                marginBottom: layout.isSmallPhone ? 8 : 12,
              },
            ]}
          >
            {tOr(t, 'user_welcome_back', 'Welcome Back')}
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
            {tOr(t, 'user_dashboard_title', 'DASHBOARD')}
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
            {tOr(
              t,
              'user_dashboard_subtitle',
              'Track your progress on the path to refined mastery.'
            )}
          </Text>

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
              <Text style={styles.heroStatNum}>
                {dashboardStats.completedCount}/{dashboardStats.totalModules}
              </Text>
              <Text style={styles.heroStatLabel}>
                {dashboardStats.inProgress
                  ? tOr(t, 'stat_in_progress', 'In Progress')
                  : tOr(t, 'stat_completed', 'Completed')}
              </Text>
            </View>

            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{dashboardStats.viewedTopics}</Text>
              <Text style={styles.heroStatLabel}>
                {tOr(t, 'stat_viewed_topics', 'Read / Viewed')}
              </Text>
            </View>

            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{dashboardStats.percentTotal}%</Text>
              <Text style={styles.heroStatLabel}>
                {tOr(t, 'stat_overall_progress', 'Overall Progress')}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              paddingHorizontal: layout.isSmallPhone ? 10 : 20,
              marginBottom: layout.sectionSpacing,
            }}
          >
            <Text
              style={[
                styles.heroStatLabel,
                {
                  textAlign: 'left',
                  marginBottom: layout.isSmallPhone ? 8 : 10,
                  opacity: 0.5,
                  letterSpacing: 1.2,
                },
              ]}
            >
              {tOr(t, 'last_visited', 'LAST VISITED')}
            </Text>

            <Pressable
              onPress={() => {
                if (lastResolvedModule?.core?.id) {
                  navigate('module', lastResolvedModule.core.id);
                } else {
                  navigate('blocks');
                }
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 14,
                  padding: layout.cardPadding,
                  borderWidth: 1,
                  borderColor: 'rgba(216, 144, 24, 0.25)',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.colors.gold,
                  fontSize: layout.isSmallPhone ? 10 : 11,
                  fontFamily: 'CormorantGaramond_500',
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {lastResolvedModule?.core?.id || 'MODULE'}
              </Text>

              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: layout.isSmallPhone ? 18 : 20,
                  fontFamily: 'PlayfairDisplay_600',
                  marginBottom: 6,
                }}
              >
                {lastResolvedModule?.content?.title ||
                  tOr(t, 'nav_modules', 'Modules')}
              </Text>

              <Text
                style={{
                  color: theme.colors.textDim,
                  fontSize: layout.isSmallPhone ? 14 : 15,
                  fontFamily: 'CormorantGaramond_400',
                  lineHeight: layout.isSmallPhone ? 18 : 20,
                }}
                numberOfLines={2}
              >
                {lastResolvedModule?.content?.subtitle ||
                  tOr(t, 'continue_desc', 'Resume exactly where you left off.')}
              </Text>

              <View
                style={{
                  position: 'absolute',
                  right: 15,
                  top: layout.isSmallPhone ? 18 : 22,
                }}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.colors.gold}
                  style={{ opacity: 0.4 }}
                />
              </View>
            </Pressable>
          </View>

          <View style={{ marginBottom: layout.isSmallPhone ? 12 : 18 }}>
            <Text
              style={{
                color: theme.colors.gold,
                fontSize: layout.isSmallPhone ? 13 : 14,
                textAlign: 'center',
              }}
            >
              {tOr(t, 'stat_avg_score', 'Average Score')}: {dashboardStats.avgScore}%
            </Text>
          </View>

          <Animated.View
            style={{
              marginTop: layout.ctaTop,
              transform: [{ scale: scaleCTA }],
              alignItems: 'center',
            }}
          >
            <Pressable
              onPressIn={onPressInCTA}
              onPressOut={onPressOutCTA}
              onPress={() => navigate('LEARNING_CENTER')}
            >
              <LinearGradient
                colors={[theme.colors.gold, theme.colors.goldDark]}
                style={[
                  styles.ctaBtn,
                  {
                    paddingVertical: layout.isSmallPhone ? 12 : 14,
                    paddingHorizontal: layout.isSmallPhone ? 28 : 40,
                  },
                ]}
              >
                <Text style={styles.ctaText}>
                  Centrum Nauki
                </Text>
              </LinearGradient>
            </Pressable>

                        <Pressable
              onPress={handleLogout}
              hitSlop={10}
              style={({ pressed }) => ({
                opacity: pressed ? 0.55 : 0.82,
                marginTop: layout.isSmallPhone ? 24 : 32,
                paddingVertical: 4,
                paddingHorizontal: 6,
                alignSelf: 'center',
              })}
            >
              <Text
                style={{
                  color: 'rgba(212,175,55,0.72)',
                  fontSize: layout.isSmallPhone ? 13 : 14,
                  letterSpacing: 0.8,
                  fontFamily: 'CormorantGaramond_500',
                  textAlign: 'center',
                }}
              >
                {tOr(t, 'logout', 'Log out')}
              </Text>

              <View
                style={{
                  alignSelf: 'center',
                  marginTop: 4,
                  width: layout.isSmallPhone ? 42 : 48,
                  height: 1,
                  backgroundColor: 'rgba(212,175,55,0.22)',
                }}
              />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}