import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getModulesForBlock } from '../domain/learning/blockSelectors';
import { useLearningPaths } from '../state/learning/LearningPathsContext';
import { T } from '../data/translations';
import { theme } from '../styles/theme';

const BLOCK_IDS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const CULTURE_NAMES = {
  PL: 'Polska',
  EN: 'Anglo-Saxon',
  DE: 'Germanic',
  ES: 'Hispanic',
  FR: 'French',
  JP: 'Japanese',
  SE: 'Scandinavian',
  BR: 'Brazilian',
  IT: 'Italian',
  AE: 'Gulf / Emirati',
  US: 'American',
  KR: 'Korean',
};

function getBlockLabel(lang) {
  if (lang === 'PL') return 'BLOK';
  if (lang === 'ES') return 'BLOQUE';
  return 'BLOCK';
}

function getHeroCopy(lang) {
  if (lang === 'PL') {
    return {
      eyebrow: 'Program Akademii',
      title: 'Wybierz blok nauki',
      text:
        'Wybierz blok programu i przejdź dalej do przypisanych modułów. Każdy blok pokazuje aktualny postęp, status i rekomendowany kierunek nauki.',
      path: 'Ścieżka kulturowa',
      completed: 'Ukończone moduły',
      blocks: 'Bloki programu',
      recommended: 'Rekomendowany blok',
      activeSelection: 'Aktywny wybór',
      continue: 'Wejdź do modułów',
      progressTitle: 'Postęp',
      inProgress: 'w toku',
      completedLabel: 'ukończono',
      emptyTitle: 'Brak modułów w tym bloku',
      emptyText: 'Ten blok nie ma jeszcze przypisanych modułów dla aktualnego rejestru.',
    };
  }

  return {
    eyebrow: 'Academy Programme',
    title: 'Choose your learning block',
    text:
      'Select a programme block and proceed to its assigned modules. Each block shows current progress, status, and the recommended learning direction.',
    path: 'Cultural path',
    completed: 'Completed modules',
    blocks: 'Programme blocks',
    recommended: 'Recommended block',
    activeSelection: 'Active selection',
    continue: 'Open modules',
    progressTitle: 'Progress',
    inProgress: 'in progress',
    completedLabel: 'completed',
    emptyTitle: 'No modules in this block',
    emptyText: 'This block does not yet have modules assigned in the current registry.',
  };
}

function StatPill({ value, label, accent = false, style }) {
  return (
    <View
      style={[
        {
          minWidth: 150,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: accent ? 'rgba(212,175,55,0.22)' : 'rgba(255,255,255,0.08)',
          backgroundColor: accent ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
          paddingVertical: 12,
          paddingHorizontal: 14,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: accent ? theme.colors.gold : theme.colors.text,
          fontSize: 17,
          fontFamily: 'PlayfairDisplay_700',
          marginBottom: 2,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: 'rgba(255,255,255,0.52)',
          fontSize: 11,
          lineHeight: 16,
          textTransform: 'uppercase',
          letterSpacing: 0.7,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function ProgressBar({ value }) {
  return (
    <View
      style={{
        height: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: '100%',
          borderRadius: 999,
          backgroundColor: theme.colors.gold,
        }}
      />
    </View>
  );
}

function BlockChip({
  lang,
  blockId,
  title,
  percentage,
  completedModules,
  totalModules,
  selected,
  onPress,
}) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={
          selected
            ? [
                'rgba(212,175,55,0.18)',
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0.015)',
              ]
            : [
                'rgba(255,255,255,0.045)',
                'rgba(255,255,255,0.022)',
                'rgba(255,255,255,0.01)',
              ]
        }
        style={{
          width: 232,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: selected ? 'rgba(212,175,55,0.24)' : 'rgba(255,255,255,0.08)',
          paddingHorizontal: 18,
          paddingVertical: 18,
          marginRight: 14,
        }}
      >
        <Text
          style={{
            color: selected ? theme.colors.gold : 'rgba(255,255,255,0.52)',
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {getBlockLabel(lang)} {blockId}
        </Text>

        <Text
          style={{
            color: selected ? theme.colors.gold : theme.colors.text,
            fontSize: 20,
            lineHeight: 26,
            fontFamily: selected ? 'PlayfairDisplay_700' : 'PlayfairDisplay_600',
            marginBottom: 12,
            minHeight: 52,
          }}
        >
          {title}
        </Text>

        <ProgressBar value={percentage} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: 'rgba(255,255,255,0.58)',
              fontSize: 12,
            }}
          >
            {completedModules}/{totalModules}
          </Text>

          <Text
            style={{
              color: selected ? theme.colors.gold : 'rgba(255,255,255,0.48)',
              fontSize: 12,
            }}
          >
            {percentage}%
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function BlocksScreen({
  navigate,
  lang = 'PL',
  progress = {},
  currentModuleId,
}) {
  const { width } = Dimensions.get('window');
  const isWide = width >= 980;
  const translations = T[lang] || T.EN;
  const copy = getHeroCopy(lang);
  const { state } = useLearningPaths();
  const railRef = useRef(null);

  const activeTrackId = state.activeTrackOrder?.[0] || 'PL';
  const activeCultureName = CULTURE_NAMES[activeTrackId] || activeTrackId;
  const blockMetaMap = translations.blocks || T.EN.blocks || {};

  const blockCards = useMemo(() => {
    return BLOCK_IDS.map((blockId) => {
      const modules = getModulesForBlock(blockId) || [];
      const moduleIds = modules.map((item) => item?.core?.id).filter(Boolean);

      const completedModules = moduleIds.filter(
        (moduleId) => !!progress?.[moduleId]?.passed
      ).length;

      const inProgressModules = moduleIds.filter(
        (moduleId) => !!progress?.[moduleId] && !progress?.[moduleId]?.passed
      ).length;

      const totalModules = moduleIds.length;
      const percentage =
        totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

      return {
        blockId,
        title: blockMetaMap?.[blockId]?.title || `${getBlockLabel(lang)} ${blockId}`,
        subtitle: blockMetaMap?.[blockId]?.subtitle || '',
        totalModules,
        completedModules,
        inProgressModules,
        percentage,
      };
    });
  }, [blockMetaMap, lang, progress]);

  const recommendedBlockId = useMemo(() => {
    const firstInProgress = blockCards.find(
      (block) => block.inProgressModules > 0 && block.totalModules > 0
    );
    if (firstInProgress) return firstInProgress.blockId;

    const firstNotCompleted = blockCards.find(
      (block) => block.completedModules < block.totalModules
    );
    if (firstNotCompleted) return firstNotCompleted.blockId;

    return blockCards[0]?.blockId || 'I';
  }, [blockCards]);

  const [selectedBlockId, setSelectedBlockId] = useState(
    currentModuleId && BLOCK_IDS.includes(currentModuleId)
      ? currentModuleId
      : recommendedBlockId
  );

  useEffect(() => {
    const nextSelected =
      currentModuleId && BLOCK_IDS.includes(currentModuleId)
        ? currentModuleId
        : recommendedBlockId;

    setSelectedBlockId(nextSelected);
  }, [currentModuleId, recommendedBlockId]);

  useEffect(() => {
    const index = BLOCK_IDS.indexOf(selectedBlockId);
    if (index < 0 || !railRef.current) return;

    const itemWidth = 246;
    railRef.current.scrollTo({
      x: Math.max(0, index * itemWidth - 20),
      animated: true,
    });
  }, [selectedBlockId]);

  const totalCompletedModules = useMemo(() => {
    return blockCards.reduce((sum, block) => sum + block.completedModules, 0);
  }, [blockCards]);

  const selectedBlock =
    blockCards.find((block) => block.blockId === selectedBlockId) || blockCards[0];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 48,
        paddingBottom: 140,
        paddingHorizontal: 20,
        maxWidth: 1240,
        width: '100%',
        alignSelf: 'center',
      }}
    >
      <LinearGradient
        colors={[
          'rgba(212,175,55,0.14)',
          'rgba(255,255,255,0.04)',
          'rgba(255,255,255,0.015)',
        ]}
        style={{
          borderRadius: 34,
          borderWidth: 1,
          borderColor: 'rgba(212,175,55,0.16)',
          paddingHorizontal: width > 520 ? 30 : 22,
          paddingVertical: width > 520 ? 30 : 22,
          marginBottom: 24,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(212,175,55,0.24)',
          }}
        />

        <Text
          style={{
            color: 'rgba(255,240,190,0.64)',
            fontSize: 11,
            letterSpacing: 1.8,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {copy.eyebrow}
        </Text>

        <Text
          style={{
            color: theme.colors.gold,
            fontSize: width > 520 ? 42 : 34,
            lineHeight: width > 520 ? 48 : 40,
            fontFamily: 'PlayfairDisplay_700',
            marginBottom: 12,
          }}
        >
          {copy.title}
        </Text>

        <Text
          style={{
            color: 'rgba(255,255,255,0.74)',
            fontSize: 16,
            lineHeight: 26,
            maxWidth: 860,
            marginBottom: 22,
          }}
        >
          {copy.text}
        </Text>

        <View
          style={{
            flexDirection: isWide ? 'row' : 'column',
            alignItems: isWide ? 'stretch' : 'stretch',
            gap: 12,
            marginBottom: 22,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: isWide ? 'nowrap' : 'wrap',
              gap: 12,
              flex: 1,
            }}
          >
            <StatPill value={activeCultureName} label={copy.path} accent />
            <StatPill value={String(totalCompletedModules)} label={copy.completed} />
            <StatPill value={String(BLOCK_IDS.length)} label={copy.blocks} />
            <StatPill value={recommendedBlockId} label={copy.recommended} />
          </View>
        </View>

        <View
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            paddingHorizontal: 18,
            paddingVertical: 18,
          }}
        >
          <Text
            style={{
              color: 'rgba(255,255,255,0.50)',
              fontSize: 11,
              letterSpacing: 1.1,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            {copy.activeSelection}
          </Text>

          <ScrollView
            ref={railRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 10 }}
          >
            {blockCards.map((block) => (
              <BlockChip
                key={block.blockId}
                lang={lang}
                blockId={block.blockId}
                title={block.title}
                percentage={block.percentage}
                completedModules={block.completedModules}
                totalModules={block.totalModules}
                selected={block.blockId === selectedBlockId}
                onPress={() => setSelectedBlockId(block.blockId)}
              />
            ))}
          </ScrollView>

          {!!selectedBlock && (
            <View
              style={{
                marginTop: 18,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                paddingHorizontal: 18,
                paddingVertical: 18,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255,255,255,0.48)',
                  fontSize: 11,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {getBlockLabel(lang)} {selectedBlock.blockId}
              </Text>

              <Text
                style={{
                  color: theme.colors.gold,
                  fontSize: 28,
                  lineHeight: 34,
                  fontFamily: 'PlayfairDisplay_700',
                  marginBottom: 8,
                }}
              >
                {selectedBlock.title}
              </Text>

              {!!selectedBlock.subtitle && (
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.60)',
                    fontSize: 14,
                    lineHeight: 22,
                    marginBottom: 16,
                    maxWidth: 820,
                  }}
                >
                  {selectedBlock.subtitle}
                </Text>
              )}

              <View
                style={{
                  marginBottom: 16,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  padding: 14,
                }}
              >
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.50)',
                    fontSize: 11,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  {copy.progressTitle}
                </Text>

                <ProgressBar value={selectedBlock.percentage} />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontSize: 13,
                    }}
                  >
                    {selectedBlock.completedModules}/{selectedBlock.totalModules} {copy.completedLabel}
                  </Text>

                  <Text
                    style={{
                      color: theme.colors.gold,
                      fontSize: 13,
                    }}
                  >
                    {selectedBlock.percentage}%
                  </Text>
                </View>

                <Text
                  style={{
                    color: 'rgba(255,255,255,0.48)',
                    fontSize: 12,
                    marginTop: 8,
                  }}
                >
                  {selectedBlock.inProgressModules} {copy.inProgress}
                </Text>
              </View>

              <Pressable
                onPress={() => navigate('MODULES', selectedBlock.blockId)}
              >
                <LinearGradient
                  colors={[theme.colors.gold, theme.colors.goldDark]}
                  style={{
                    borderRadius: 18,
                    paddingVertical: 15,
                    paddingHorizontal: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#1A1306',
                      fontSize: 15,
                      fontFamily: 'PlayfairDisplay_700',
                      letterSpacing: 0.3,
                    }}
                  >
                    {copy.continue}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {!!selectedBlock && selectedBlock.totalModules === 0 && (
            <View
              style={{
                marginTop: 14,
              }}
            >
              <Text
                style={{
                  color: theme.colors.gold,
                  fontSize: 18,
                  fontFamily: 'PlayfairDisplay_700',
                  marginBottom: 6,
                }}
              >
                {copy.emptyTitle}
              </Text>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.58)',
                  fontSize: 13,
                  lineHeight: 20,
                }}
              >
                {copy.emptyText}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </ScrollView>
  );
}