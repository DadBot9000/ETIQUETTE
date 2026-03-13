import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Quiz from '../components/Quiz';
import TopicCard from '../components/TopicCard';
import { resolveLocalizedText } from '../domain/learning/contentLocalization';
import { getResolvedModulePresentation } from '../domain/learning/selectors';
import { useLearningPaths } from '../state/learning/LearningPathsContext';
import { theme } from '../styles/theme';

function SegmentButton({ active, onPress, label, sublabel }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={
          active
            ? ['rgba(212,175,55,0.22)', 'rgba(212,175,55,0.08)']
            : ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: active ? 'rgba(212,175,55,0.34)' : 'rgba(255,255,255,0.08)',
          borderRadius: 18,
        }}
      >
        <Text
          style={{
            color: active ? theme.colors.gold : theme.colors.text,
            fontSize: 15,
            fontFamily: active ? 'PlayfairDisplay_700' : 'PlayfairDisplay_500',
            marginBottom: 3,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: active ? 'rgba(255,240,190,0.78)' : 'rgba(255,255,255,0.45)',
            fontSize: 11,
          }}
        >
          {sublabel}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

function DetailRow({ label, value, isLast = false }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        paddingVertical: 10,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <Text
        style={{
          color: 'rgba(255,255,255,0.56)',
          fontSize: 13,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: theme.colors.text,
          fontSize: 13,
          textAlign: 'right',
          flexShrink: 1,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function ModuleInfoDropdown({
  t,
  open,
  onToggle,
  topicsCount,
  quizCount,
  factualCount,
  caseStudyCount,
  passScore,
  culturalNote,
}) {
  return (
    <View
      style={{
        marginBottom: 18,
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      <Pressable onPress={onToggle}>
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
          style={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 15,
                fontFamily: 'PlayfairDisplay_600',
                marginBottom: 3,
              }}
            >
              {t('module_info_title')}
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.46)',
                fontSize: 12,
              }}
            >
              {t('module_info_subtitle')}
            </Text>
          </View>

          <Text
            style={{
              color: open ? theme.colors.gold : 'rgba(255,255,255,0.54)',
              fontSize: 18,
              transform: [{ rotate: open ? '180deg' : '0deg' }],
            }}
          >
            ▾
          </Text>
        </LinearGradient>
      </Pressable>

      {open ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.015)']}
          style={{
            marginTop: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.06)',
            paddingHorizontal: 16,
            paddingTop: 6,
            paddingBottom: 14,
          }}
        >
          <DetailRow label={t('module_topics_count')} value={String(topicsCount)} />
          <DetailRow label={t('module_quiz_count')} value={String(quizCount)} />
          <DetailRow label={t('module_factual_count')} value={String(factualCount)} />
          <DetailRow label={t('module_case_study_count')} value={String(caseStudyCount)} />
          <DetailRow label={t('module_pass_threshold')} value={`${passScore}%`} isLast={!culturalNote} />

          {culturalNote ? (
            <View
              style={{
                marginTop: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: 14,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255,255,255,0.56)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                {t('module_context_label')}
              </Text>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.74)',
                  fontSize: 14,
                  lineHeight: 22,
                }}
              >
                {culturalNote}
              </Text>
            </View>
          ) : null}
        </LinearGradient>
      ) : null}
    </View>
  );
}

export default function ModuleScreen({
  t,
  lang = 'EN',
  navigate,
  currentModuleId,
  currentMode,
  setCurrentMode,
  quiz,
  setQuiz,
}) {
  const { width } = Dimensions.get('window');
  const isWide = width >= 860;
  const { state, markVisited } = useLearningPaths();
  const [infoOpen, setInfoOpen] = useState(false);

  const activeTrackId = state.activeTrackOrder?.[0] || 'PL';
  const cultureProfile = activeTrackId;

  const presentation = useMemo(() => {
    return getResolvedModulePresentation(
      currentModuleId,
      [cultureProfile],
      lang
    );
  }, [currentModuleId, lang, cultureProfile]);

  const moduleView = presentation?.resolved || null;

  useEffect(() => {
    if (!moduleView) return;
    markVisited(moduleView.trackId, moduleView.core.id);
  }, [moduleView, markVisited]);

  const switchMode = (mode) => {
    setCurrentMode(mode);
    if (mode === 'test') {
      setQuiz({
        current: 0,
        answers: [],
        confirmed: {},
        submitted: false,
        score: 0,
      });
    }
  };

  if (!moduleView) {
    return (
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
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
            marginBottom: 22,
          }}
        >
          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: 12,
              letterSpacing: 0.3,
            }}
          >
            ← {t('back').replace('← ', '')}
          </Text>
        </Pressable>

        <Text
          style={{
            color: theme.colors.text,
            fontSize: 24,
            fontFamily: 'PlayfairDisplay_700',
            marginBottom: 8,
          }}
        >
          {t('module_missing_content')}
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.58)',
            fontSize: 13,
            lineHeight: 20,
          }}
        >
          moduleId: {String(currentModuleId || 'UNKNOWN')}
        </Text>
      </View>
    );
  }

  const { core, content } = moduleView;

  const localizedTitle = resolveLocalizedText(content?.title, lang);
  const localizedSubtitle = resolveLocalizedText(content?.subtitle, lang);

  const localizedCulturalContext = resolveLocalizedText(
    content?.culturalContext,
    lang
  );

  const topics = Array.isArray(content?.topics)
    ? content.topics.map((topic) => ({
        ...topic,
        title: resolveLocalizedText(topic.title, lang),
        content: resolveLocalizedText(topic.content, lang),
      }))
    : [];

  const quizData = Array.isArray(content?.quiz)
    ? content.quiz.map((question) => ({
        ...question,
        question: resolveLocalizedText(question.question, lang),
        explanation: resolveLocalizedText(question.explanation, lang),
        options: Array.isArray(question.options)
          ? question.options.map((option) =>
              resolveLocalizedText(option, lang)
            )
          : [],
      }))
    : [];

  const topicsCount = presentation?.metrics?.topicsCount ?? topics.length;
  const quizCount = presentation?.metrics?.quizCount ?? quizData.length;
  const factualCount = presentation?.metrics?.factualCount ?? 0;
  const caseStudyCount = presentation?.metrics?.caseStudyCount ?? 0;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 120,
          maxWidth: 1120,
          alignSelf: 'center',
          width: '100%',
        }}
      >
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
            marginBottom: 22,
          }}
        >
          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: 12,
              letterSpacing: 0.3,
            }}
          >
            ← {t('back').replace('← ', '')}
          </Text>
        </Pressable>

        <LinearGradient
          colors={[
            'rgba(212,175,55,0.12)',
            'rgba(255,255,255,0.035)',
            'rgba(255,255,255,0.012)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 34,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            paddingHorizontal: width > 480 ? 28 : 22,
            paddingVertical: width > 480 ? 28 : 22,
            marginBottom: 20,
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
              backgroundColor: 'rgba(212,175,55,0.22)',
            }}
          />

          <View
            style={{
              width: 56,
              height: 2,
              borderRadius: 999,
              backgroundColor: 'rgba(212,175,55,0.75)',
              marginBottom: 18,
            }}
          />

          <View
            style={{
              flexDirection: isWide ? 'row' : 'column',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <View style={{ flex: 1, maxWidth: 860 }}>
              <Text
                style={{
                  color: 'rgba(255,240,190,0.60)',
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                {t('module_experience_label')}
              </Text>

              <Text
                style={{
                  fontSize: width > 480 ? 52 : 42,
                  marginBottom: 14,
                }}
              >
                {core.icon}
              </Text>

              <Text
                style={{
                  color: theme.colors.gold,
                  fontSize: width > 480 ? 40 : 31,
                  lineHeight: width > 480 ? 48 : 38,
                  fontFamily: 'PlayfairDisplay_700',
                  marginBottom: 12,
                }}
              >
                {localizedTitle}
              </Text>

              <Text
                style={{
                  color: 'rgba(255,255,255,0.78)',
                  fontSize: width > 480 ? 19 : 17,
                  lineHeight: width > 480 ? 28 : 25,
                  fontFamily: 'CormorantGaramond_400_Italic',
                  marginBottom: 14,
                  maxWidth: 760,
                }}
              >
                {localizedSubtitle}
              </Text>

              <Text
                style={{
                  color: 'rgba(255,255,255,0.52)',
                  fontSize: 13,
                  lineHeight: 22,
                  maxWidth: 760,
                }}
              >
                {t('module_intro_text')}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <ModuleInfoDropdown
          t={t}
          open={infoOpen}
          onToggle={() => setInfoOpen((prev) => !prev)}
          topicsCount={topicsCount}
          quizCount={quizCount}
          factualCount={factualCount}
          caseStudyCount={caseStudyCount}
          passScore={core.cutoffPass}
          culturalNote={presentation?.culturalNote || ''}
        />

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            marginBottom: 18,
          }}
        >
          <SegmentButton
            active={currentMode === 'study'}
            onPress={() => switchMode('study')}
            label={t('study_mode')}
            sublabel={t('module_study_materials')}
          />
          <SegmentButton
            active={currentMode === 'test'}
            onPress={() => switchMode('test')}
            label={t('test_mode')}
            sublabel={t('module_assessment_label')}
          />
        </View>

        {currentMode === 'study' ? (
          <View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              {topics.map((topic, index) => (
                <View
                  key={`${core.id}-topic-${index}`}
                  style={{
                    width: isWide ? '48.8%' : '100%',
                  }}
                >
                  <TopicCard
                    index={index}
                    title={topic.title}
                    content={topic.content}
                    bloomLevel={topic.bloomLevel}
                    culturalScope={topic.culturalScope}
                    t={t}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Quiz
              moduleCore={core}
              moduleContent={{
                ...content,
                title: localizedTitle,
                subtitle: localizedSubtitle,
                culturalContext: localizedCulturalContext,
                culturalNote: {
                  ...content.culturalNote,
                  title: resolveLocalizedText(content?.culturalNote?.title, lang),
                  body: resolveLocalizedText(content?.culturalNote?.body, lang),
                },
                topics,
                quiz: quizData,
              }}
              activeTrackId={moduleView.trackId}
              t={t}
              quiz={quiz}
              setQuiz={setQuiz}
              onBackToModules={() => navigate('BLOCKS')}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}