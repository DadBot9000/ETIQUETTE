import React, { useMemo, useState } from 'react';
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
import { TRACK_IDS, TRACK_META } from '../data/culturalProfiles';
import { T } from '../data/translations';
import { theme } from '../styles/theme';


const BLOCK_IDS = ['I', 'II', 'III', 'IV', 'V', 'VI'];



function getCopy(lang) {
  if (lang === 'PL') {
    return {
      eyebrow: 'Learning Center',
      title: 'Centrum Nauki',
      text:
        'Skonfiguruj aktywną ścieżkę kulturową, zobacz stan programu i przejdź do wybranego bloku w spójnym, premium flow.',
      path: 'Ścieżka kulturowa',
      completed: 'Ukończone moduły',
      blocks: 'Bloki programu',
      recommended: 'Rekomendowany blok',
      switchPath: 'Zmień ścieżkę',
      close: 'Zamknij',
      activeProfile: 'Aktywny profil',
      activeBlock: 'Aktywny blok',
      programmeNavigation: 'Program Navigation',
      programmeTitle: 'Program Akademii',
      programmeText:
        'Wybierz blok programu, do którego chcesz przejść. Możesz swobodnie wracać do bloków aktywnych i kontynuować naukę w swoim tempie.',
      openProgramme: 'Otwórz program',
      pathTitle: 'Perspektywa kulturowa',
      pathText:
        'Zmiana ścieżki aktualizuje program, progres, rekomendowany blok i dalsze decyzje nawigacyjne dla tego profilu.',
      progressTitle: 'Progres ścieżki',
      inProgress: 'w toku',
      completedLabel: 'ukończono',
      recommendedNow: 'Rekomendowany teraz',
      pathButton: 'Pełny ekran ścieżki kulturowej',
    };
  }

  return {
    eyebrow: 'Learning Center',
    title: 'Learning Center',
    text:
      'Configure the active cultural path, review programme status and continue into the right block through a premium learning flow.',
    path: 'Cultural path',
    completed: 'Completed modules',
    blocks: 'Programme blocks',
    recommended: 'Recommended block',
    switchPath: 'Change path',
    close: 'Close',
    activeProfile: 'Active profile',
    activeBlock: 'Active block',
    programmeNavigation: 'Programme Navigation',
    programmeTitle: 'Academy Programme',
    programmeText:
      'Choose the programme block you want to enter. You can return to active blocks freely and continue at your own pace.',
    openProgramme: 'Open programme',
    pathTitle: 'Cultural perspective',
    pathText:
      'Changing the path updates programme status, progress, recommended block and the next navigation decisions for that profile.',
    progressTitle: 'Path progress',
    inProgress: 'in progress',
    completedLabel: 'completed',
    recommendedNow: 'Recommended now',
    pathButton: 'Full cultural path screen',
  };
}

function StatPill({ value, label, accent = false, style }) {
  return (
    <View
      style={[
        {
          minWidth: 150,
          flex: 1,
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

function PathChip({ trackId, active, onPress }) {
  const meta = TRACK_META[trackId];
  if (!meta) return null;

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={
          active
            ? ['rgba(212,175,55,0.16)', 'rgba(255,255,255,0.04)']
            : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.015)']
        }
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: active ? 'rgba(212,175,55,0.24)' : 'rgba(255,255,255,0.08)',
          paddingVertical: 12,
          paddingHorizontal: 14,
          marginRight: 10,
          minWidth: 190,
        }}
      >
        <Text
          style={{
            color: active ? theme.colors.gold : theme.colors.text,
            fontSize: 15,
            fontFamily: active ? 'PlayfairDisplay_700' : 'PlayfairDisplay_600',
            marginBottom: 3,
          }}
        >
          {trackId} · {meta.title}
        </Text>
        <Text
          style={{
            color: active ? 'rgba(255,240,190,0.72)' : 'rgba(255,255,255,0.52)',
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {meta.region}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

function BlockMiniCard({
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
          width: 220,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: selected ? 'rgba(212,175,55,0.24)' : 'rgba(255,255,255,0.08)',
          paddingHorizontal: 16,
          paddingVertical: 16,
          marginRight: 12,
        }}
      >
        <Text
          style={{
            color: selected ? theme.colors.gold : 'rgba(255,255,255,0.52)',
            fontSize: 11,
            letterSpacing: 1.1,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {lang === 'PL' ? 'BLOK' : 'BLOCK'} {blockId}
        </Text>

        <Text
          style={{
            color: selected ? theme.colors.gold : theme.colors.text,
            fontSize: 18,
            lineHeight: 24,
            fontFamily: selected ? 'PlayfairDisplay_700' : 'PlayfairDisplay_600',
            marginBottom: 12,
            minHeight: 48,
          }}
        >
          {title}
        </Text>

        <ProgressBar value={percentage} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.56)', fontSize: 12 }}>
            {completedModules}/{totalModules}
          </Text>
          <Text
            style={{
              color: selected ? theme.colors.gold : 'rgba(255,255,255,0.50)',
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

export default function LearningCenterScreen({
  navigate,
  lang = 'PL',
}) {
  const { width } = Dimensions.get('window');
  const isWide = width >= 980;
  const translations = T[lang] || T.EN;
  const copy = getCopy(lang);

  const { state, setPrimaryTrack } = useLearningPaths();
  const [pathMenuOpen, setPathMenuOpen] = useState(false);

  const activeTrackId = state.activeTrackOrder?.[0] || 'PL';
  const activeTrackMeta = TRACK_META[activeTrackId] || TRACK_META.PL;
  const progressByTrack = state.progress?.[activeTrackId] || {};
  const blockMetaMap = translations.blocks || T.EN.blocks || {};

  const blockCards = useMemo(() => {
    return BLOCK_IDS.map((blockId) => {
      const modules = getModulesForBlock(blockId) || [];
      const moduleIds = modules.map((item) => item?.core?.id).filter(Boolean);

      const completedModules = moduleIds.filter(
        (moduleId) => !!progressByTrack?.[moduleId]?.passed
      ).length;

      const inProgressModules = moduleIds.filter(
        (moduleId) => !!progressByTrack?.[moduleId] && !progressByTrack?.[moduleId]?.passed
      ).length;

      const totalModules = moduleIds.length;
      const percentage =
        totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

      return {
        blockId,
        title: blockMetaMap?.[blockId]?.title || `${lang === 'PL' ? 'BLOK' : 'BLOCK'} ${blockId}`,
        subtitle: blockMetaMap?.[blockId]?.subtitle || '',
        totalModules,
        completedModules,
        inProgressModules,
        percentage,
      };
    });
  }, [blockMetaMap, lang, progressByTrack]);

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

  const [selectedBlockId, setSelectedBlockId] = useState(recommendedBlockId);

  useMemo(() => {
    if (selectedBlockId !== recommendedBlockId && !BLOCK_IDS.includes(selectedBlockId)) {
      setSelectedBlockId(recommendedBlockId);
    }
  }, [recommendedBlockId, selectedBlockId]);

  const selectedBlock =
    blockCards.find((block) => block.blockId === selectedBlockId) ||
    blockCards.find((block) => block.blockId === recommendedBlockId) ||
    blockCards[0];

  const completedModulesCount = useMemo(() => {
    return Object.values(progressByTrack || {}).filter((entry) => !!entry?.passed).length;
  }, [progressByTrack]);

  const activeBlocksCount = useMemo(() => {
    return blockCards.filter(
      (block) => block.inProgressModules > 0 || block.completedModules > 0
    ).length;
  }, [blockCards]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 46,
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
          {translations.learning_center || copy.title}
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
          {translations.learning_center_desc || copy.text}
        </Text>

        <View
          style={{
            flexDirection: isWide ? 'row' : 'column',
            gap: 12,
            alignItems: 'stretch',
            marginBottom: 22,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <StatPill
              value={activeTrackMeta.title}
              label={copy.path}
              accent
              style={{ minWidth: isWide ? 210 : 150 }}
            />
            <StatPill value={String(completedModulesCount)} label={copy.completed} />
            <StatPill value={String(BLOCK_IDS.length)} label={copy.blocks} />
            <StatPill value={recommendedBlockId} label={copy.recommended} />
          </View>

          <Pressable onPress={() => setPathMenuOpen((prev) => !prev)}>
            <LinearGradient
              colors={[theme.colors.gold, theme.colors.goldDark]}
              style={{
                borderRadius: 18,
                borderWidth: 1,
                borderColor: 'rgba(212,175,55,0.24)',
                paddingVertical: 14,
                paddingHorizontal: 18,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: isWide ? 190 : undefined,
              }}
            >
              <Text
                style={{
                  color: '#1A1306',
                  fontSize: 14,
                  fontFamily: 'PlayfairDisplay_700',
                  letterSpacing: 0.3,
                }}
              >
                {pathMenuOpen
                  ? (translations.close || copy.close)
                  : (translations.switch_path || copy.switchPath)}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {pathMenuOpen ? (
          <View
            style={{
              borderRadius: 24,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TRACK_IDS.map((trackId) => (
                <PathChip
                  key={trackId}
                  trackId={trackId}
                  active={trackId === activeTrackId}
                  onPress={() => {
                    setPrimaryTrack(trackId);
                    setPathMenuOpen(false);
                  }}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </LinearGradient>

      <View
        style={{
          flexDirection: isWide ? 'row' : 'column',
          gap: 18,
        }}
      >
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.045)',
            'rgba(255,255,255,0.022)',
            'rgba(255,255,255,0.01)',
          ]}
          style={{
            flex: 1.1,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
            <Text
              style={{
                color: 'rgba(255,240,190,0.62)',
                fontSize: 11,
                letterSpacing: 1.8,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              {copy.programmeNavigation}
            </Text>

            <Text
              style={{
                color: theme.colors.text,
                fontSize: 30,
                lineHeight: 36,
                fontFamily: 'PlayfairDisplay_700',
                marginBottom: 10,
              }}
            >
              {copy.programmeTitle}
            </Text>

            <Text
              style={{
                color: 'rgba(255,255,255,0.62)',
                fontSize: 14,
                lineHeight: 22,
                marginBottom: 20,
              }}
            >
              {copy.programmeText}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 10 }}
            >
              {blockCards.map((block) => (
                <BlockMiniCard
                  key={block.blockId}
                  lang={lang}
                  blockId={block.blockId}
                  title={block.title}
                  percentage={block.percentage}
                  completedModules={block.completedModules}
                  totalModules={block.totalModules}
                  selected={block.blockId === selectedBlock.blockId}
                  onPress={() => setSelectedBlockId(block.blockId)}
                />
              ))}
            </ScrollView>

            <View
              style={{
                marginTop: 18,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: 18,
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
                {copy.activeBlock}
              </Text>

              <Text
                style={{
                  color: theme.colors.gold,
                  fontSize: 26,
                  fontFamily: 'PlayfairDisplay_700',
                  marginBottom: 6,
                }}
              >
                {lang === 'PL' ? 'BLOK' : 'BLOCK'} {selectedBlock.blockId}
              </Text>

              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 18,
                  lineHeight: 24,
                  fontFamily: 'PlayfairDisplay_600',
                  marginBottom: 8,
                }}
              >
                {selectedBlock.title}
              </Text>

              {!!selectedBlock.subtitle && (
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.58)',
                    fontSize: 13,
                    lineHeight: 20,
                    marginBottom: 14,
                  }}
                >
                  {selectedBlock.subtitle}
                </Text>
              )}

              <ProgressBar value={selectedBlock.percentage} />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginTop: 10,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: theme.colors.text, fontSize: 13 }}>
                  {selectedBlock.completedModules}/{selectedBlock.totalModules} {copy.completedLabel}
                </Text>
                <Text style={{ color: theme.colors.gold, fontSize: 13 }}>
                  {selectedBlock.percentage}%
                </Text>
              </View>

              <Text
                style={{
                  color: 'rgba(255,255,255,0.48)',
                  fontSize: 12,
                  marginBottom: 16,
                }}
              >
                {selectedBlock.inProgressModules} {copy.inProgress}
              </Text>

              <Pressable onPress={() => navigate('BLOCKS')}>
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
                    {copy.openProgramme}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={[
            'rgba(255,255,255,0.045)',
            'rgba(255,255,255,0.022)',
            'rgba(255,255,255,0.01)',
          ]}
          style={{
            flex: 0.9,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
            <Text
              style={{
                color: 'rgba(255,240,190,0.62)',
                fontSize: 11,
                letterSpacing: 1.8,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              {copy.pathTitle}
            </Text>

            <Text
              style={{
                color: theme.colors.text,
                fontSize: 30,
                lineHeight: 36,
                fontFamily: 'PlayfairDisplay_700',
                marginBottom: 10,
              }}
            >
              {activeTrackMeta.title}
            </Text>

            <Text
              style={{
                color: 'rgba(255,255,255,0.62)',
                fontSize: 14,
                lineHeight: 22,
                marginBottom: 18,
              }}
            >
              {copy.pathText}
            </Text>

            <View
              style={{
                borderRadius: 22,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: 18,
                marginBottom: 16,
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
                {copy.activeProfile}
              </Text>

              <Text
                style={{
                  color: theme.colors.gold,
                  fontSize: 24,
                  fontFamily: 'PlayfairDisplay_700',
                  marginBottom: 6,
                }}
              >
                {activeTrackId}
              </Text>

              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 17,
                  lineHeight: 24,
                  fontFamily: 'PlayfairDisplay_600',
                  marginBottom: 6,
                }}
              >
                {activeTrackMeta.title}
              </Text>

              <Text
                style={{
                  color: 'rgba(255,255,255,0.58)',
                  fontSize: 13,
                  lineHeight: 20,
                  marginBottom: 12,
                }}
              >
                {activeTrackMeta.region}
              </Text>

              <Text
                style={{
                  color: 'rgba(255,255,255,0.68)',
                  fontSize: 14,
                  lineHeight: 22,
                }}
              >
                {activeTrackMeta.description}
              </Text>
            </View>

            <View
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: 14,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255,255,255,0.48)',
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {copy.progressTitle}
              </Text>

              <ProgressBar
                value={
                  blockCards.length > 0
                    ? Math.round(
                        blockCards.reduce((sum, block) => sum + block.percentage, 0) /
                          blockCards.length
                      )
                    : 0
                }
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: theme.colors.text, fontSize: 13 }}>
                  {completedModulesCount} {copy.completedLabel}
                </Text>
                <Text style={{ color: theme.colors.gold, fontSize: 13 }}>
                  {copy.recommendedNow}: {recommendedBlockId}
                </Text>
              </View>

              <Text
                style={{
                  color: 'rgba(255,255,255,0.48)',
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                {activeBlocksCount} / {BLOCK_IDS.length} bloków aktywnych lub rozpoczętych
              </Text>
            </View>

            <Pressable onPress={() => navigate('CULTURAL_PATH')}>
              <LinearGradient
                colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
                style={{
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                  paddingVertical: 15,
                  paddingHorizontal: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 15,
                    fontFamily: 'PlayfairDisplay_700',
                    letterSpacing: 0.3,
                  }}
                >
                  {copy.pathButton}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}