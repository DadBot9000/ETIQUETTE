import React, { useMemo } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import ModuleCard from '../components/ModuleCard';
import { getBlockDefinition, getModulesForBlock } from '../domain/learning/blockSelectors';
import { T } from '../data/translations';
import { useLearningPaths } from '../state/learning/LearningPathsContext';
import { theme } from '../styles/theme';

function getBlockLabel(lang) {
  if (lang === 'PL') return 'BLOK';
  if (lang === 'ES') return 'BLOQUE';
  return 'BLOCK';
}

export default function ModulesScreen({
  navigate,
  lang = 'EN',
  currentModuleId,
}) {
  const { width } = Dimensions.get('window');
  const isWide = width >= 980;
  const isMedium = width >= 700;
  const { state } = useLearningPaths();

  const activeTrackId = state.activeTrackOrder?.[0] || 'PL';
  const translations = T[lang] || T.EN;
  const blockMetaMap = translations.blocks || T.EN.blocks;
  const blockLabel = getBlockLabel(lang);

  const activeBlockId = currentModuleId || 'I';

  const activeBlock = useMemo(() => {
    return getBlockDefinition(activeBlockId);
  }, [activeBlockId]);

  const modules = useMemo(() => {
    return getModulesForBlock(activeBlockId) || [];
  }, [activeBlockId]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 52,
        paddingBottom: 140,
        paddingHorizontal: 20,
        maxWidth: 1220,
        alignSelf: 'center',
        width: '100%',
      }}
    >
      <View style={{ marginBottom: 18 }}>
        <Pressable
          onPress={() => navigate('BLOCKS')}
          style={{
            alignSelf: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            marginBottom: 18,
          }}
        >
          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: 12,
              letterSpacing: 0.3,
            }}
          >
            ← Zmień blok
          </Text>
        </Pressable>

        <Text
          style={{
            color: 'rgba(255,255,255,0.54)',
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {blockLabel} {activeBlock?.id || 'I'}
        </Text>

        <Text
          style={{
            color: theme.colors.gold,
            fontSize: 28,
            fontFamily: 'PlayfairDisplay_700',
            marginBottom: 8,
          }}
        >
          {blockMetaMap?.[activeBlock?.id || 'I']?.title ||
            `${blockLabel} ${activeBlock?.id || 'I'}`}
        </Text>

        {!!blockMetaMap?.[activeBlock?.id || 'I']?.subtitle && (
          <Text
            style={{
              color: 'rgba(255,255,255,0.58)',
              fontSize: 14,
              lineHeight: 22,
              marginBottom: 18,
              maxWidth: 760,
            }}
          >
            {blockMetaMap[activeBlock?.id || 'I'].subtitle}
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 18,
          }}
        >
          {modules.map((module) => (
            <View
              key={`wrap-${lang}-${activeTrackId}-${module.core.id}`}
              style={{
                width: isWide ? '31.5%' : isMedium ? '48.7%' : '100%',
              }}
            >
              <ModuleCard
                key={`card-${lang}-${activeTrackId}-${module.core.id}`}
                module={module}
                activeTrackId={activeTrackId}
                lang={lang}
                onOpen={() => navigate('MODULE', module.core.id)}
              />
            </View>
          ))}
        </View>

        {!modules.length ? (
          <LinearGradient
            colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.015)']}
            style={{
              marginTop: 10,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              paddingVertical: 24,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: theme.colors.gold,
                fontSize: 22,
                fontFamily: 'PlayfairDisplay_700',
                marginBottom: 8,
              }}
            >
              {lang === 'PL'
                ? 'Brak modułów w tym bloku'
                : lang === 'ES'
                  ? 'No hay módulos en este bloque'
                  : lang === 'DE'
                    ? 'Keine Module in diesem Block'
                    : 'No modules in this block'}
            </Text>

            <Text
              style={{
                color: 'rgba(255,255,255,0.58)',
                fontSize: 14,
                lineHeight: 22,
              }}
            >
              {lang === 'PL'
                ? 'Ten blok nie ma jeszcze przypisanych modułów w aktualnym registry.'
                : lang === 'ES'
                  ? 'Este bloque todavía no tiene módulos asignados en el registro actual.'
                  : lang === 'DE'
                    ? 'Diesem Block sind im aktuellen Register noch keine Module zugewiesen.'
                    : 'This block does not yet have modules assigned in the current registry.'}
            </Text>
          </LinearGradient>
        ) : null}
      </View>
    </ScrollView>
  );
}