import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useLearningPaths } from '../state/learning/LearningPathsContext';
import { theme } from '../styles/theme';

const TRACK_META = {
  PL: {
    short: 'PL',
    labelKey: 'track_label_cee',
    fallbackLabel: 'Europa Środkowa',
  },
  EN: {
    short: 'EN',
    labelKey: 'track_label_anglo_saxon',
    fallbackLabel: 'Anglia / Anglo-Saxon',
  },
  DE: {
    short: 'DE',
    labelKey: 'track_label_dach',
    fallbackLabel: 'DACH',
  },
  ES: {
    short: 'ES',
    labelKey: 'track_label_iberoamerica',
    fallbackLabel: 'Iberyjska',
  },
  FR: {
    short: 'FR',
    labelKey: 'track_label_francophonie',
    fallbackLabel: 'Frankofonia',
  },
  JP: {
    short: 'JP',
    labelKey: 'track_label_east_asia',
    fallbackLabel: 'Azja Wschodnia',
  },
  SE: {
    short: 'SE',
    labelKey: 'track_label_nordic',
    fallbackLabel: 'Nordycka',
  },
  BR: {
    short: 'BR',
    labelKey: 'track_label_lusophony',
    fallbackLabel: 'Lusofonia',
  },
  IT: {
    short: 'IT',
    labelKey: 'track_label_mediterranean',
    fallbackLabel: 'Śródziemnomorska',
  },
  AE: {
    short: 'AE',
    labelKey: 'track_label_gcc',
    fallbackLabel: 'Świat Arabski (GCC)',
  },
  US: {
    short: 'US',
    labelKey: 'track_label_anglosphere',
    fallbackLabel: 'Anglosfera',
  },
  KR: {
    short: 'KR',
    labelKey: 'track_label_east_asia',
    fallbackLabel: 'Azja Wschodnia',
  },
} as const;

const TRACK_IDS = ['PL', 'EN', 'DE', 'ES', 'FR', 'JP', 'SE', 'BR', 'IT', 'AE', 'US', 'KR'] as const;

function TrackOption({
  trackId,
  active,
  onPress,
  t,
}: {
  trackId: string;
  active: boolean;
  onPress: () => void;
  t: (key: string) => string;
}) {
  const meta = TRACK_META[trackId];

if (!meta) {
  return null;
}

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={
          active
            ? ['rgba(212,175,55,0.16)', 'rgba(255,255,255,0.04)']
            : ['rgba(255,255,255,0.035)', 'rgba(255,255,255,0.015)']
        }
        style={{
          borderRadius: 22,
          borderWidth: 1,
          borderColor: active ? 'rgba(212,175,55,0.22)' : 'rgba(255,255,255,0.07)',
          paddingHorizontal: 16,
          paddingVertical: 15,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: active ? theme.colors.gold : theme.colors.text,
            fontSize: 15,
            fontFamily: active ? 'PlayfairDisplay_700' : 'PlayfairDisplay_600',
            marginBottom: 4,
          }}
        >
          {trackId} · {meta.short}
        </Text>

        <Text
          style={{
            color: active ? 'rgba(255,240,190,0.72)' : 'rgba(255,255,255,0.52)',
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {(() => {
  const translated = t(meta.labelKey);
  return !translated || translated === meta.labelKey
    ? meta.fallbackLabel
    : translated;
})()}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

export default function CulturalTrackSwitcher({ t }: { t: (key: string) => string }) {
  const { state, setPrimaryTrack } = useLearningPaths();
console.log('[CulturalTrackSwitcher] activeTrackOrder=', state.activeTrackOrder);
console.log('[CulturalTrackSwitcher] firstTrack=', state.activeTrackOrder?.[0]);  
  const [open, setOpen] = useState(false);

  const activeTrackRaw = state.activeTrackOrder?.[0];
const activeTrack = activeTrackRaw && TRACK_META[activeTrackRaw] ? activeTrackRaw : 'PL';
const activeMeta = TRACK_META[activeTrack];
console.log('[CulturalTrackSwitcher] activeTrack=', activeTrack);
console.log('[CulturalTrackSwitcher] hasMeta=', Boolean(TRACK_META[activeTrack]));

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <LinearGradient
          colors={['rgba(212,175,55,0.16)', 'rgba(255,255,255,0.04)']}
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: 'rgba(212,175,55,0.22)',
            paddingVertical: 14,
            paddingHorizontal: 14,
            minWidth: 168,
          }}
        >
          <Text
            style={{
              color: 'rgba(255,240,190,0.68)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1.4,
              marginBottom: 4,
            }}
          >
                        {t('cultural_path')}
          </Text>

          <Text
            style={{
              color: theme.colors.gold,
              fontSize: 15,
              fontFamily: 'PlayfairDisplay_700',
            }}
          >
            {activeTrack} · {activeMeta.short} ▾
          </Text>
        </LinearGradient>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.58)',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}
        >
          <Pressable
            onPress={() => setOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <LinearGradient
            colors={['rgba(18,18,20,0.98)', 'rgba(10,10,12,0.98)']}
            style={{
              borderRadius: 28,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              padding: 22,
            }}
          >
            <Text
              style={{
                color: theme.colors.gold,
                fontSize: 24,
                fontFamily: 'PlayfairDisplay_700',
                marginBottom: 8,
              }}
            >
                          {t('cultural_path')}
            </Text>

            <Text
              style={{
                color: 'rgba(255,255,255,0.58)',
                fontSize: 14,
                lineHeight: 22,
                marginBottom: 18,
              }}
            >
                            {t('cultural_path_desc')}
            </Text>

            <ScrollView
  style={{ maxHeight: 420 }}
  showsVerticalScrollIndicator={false}
>
  {TRACK_IDS.map((trackId) => (
    <TrackOption
      key={trackId}
      trackId={trackId}
      active={activeTrack === trackId}
      onPress={() => {
        setPrimaryTrack(trackId);
        setOpen(false);
      }}
      t={t}
    />
  ))}
</ScrollView>

            <Pressable
              onPress={() => setOpen(false)}
              style={{
                alignSelf: 'flex-end',
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                marginTop: 6,
              }}
            >
              <Text style={{ color: theme.colors.textMuted, fontSize: 14 }}>
                                {t('close')}
              </Text>
            </Pressable>
          </LinearGradient>
        </View>
      </Modal>
    </>
  );
}