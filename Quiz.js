import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useLearningPaths } from '../state/learning/LearningPathsContext';
import { theme } from '../styles/theme';

function normalizeQuestionType(question) {
  const rawKind = String(question?.questionKind || '').trim().toLowerCase();
  const rawType = String(question?.type || '').trim().toLowerCase();
  const value = rawKind || rawType;

  if (
    value === 'casestudy' ||
    value === 'case-study' ||
    value === 'case_study'
  ) {
    return 'caseStudy';
  }

  return 'factual';
}

function classifyQuestions(quiz) {
  const all = Array.isArray(quiz) ? quiz : [];

  return {
    all,
    factual: all.filter((q) => normalizeQuestionType(q) === 'factual'),
    caseStudy: all.filter((q) => normalizeQuestionType(q) === 'caseStudy'),
  };
}

function isAnswerCorrect(question, selected) {
  const correct = question?.correct;

  if (typeof correct === 'number') {
    return selected === correct;
  }

  if (typeof correct === 'boolean') {
    return selected === correct;
  }

  return false;
}

function typeLabel(question, t) {
  return normalizeQuestionType(question) === 'caseStudy'
    ? t('case_study_label')
    : t('factual_label');
}

function MetaPill({ active, label }) {
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? 'rgba(212,175,55,0.10)' : 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: active ? 'rgba(212,175,55,0.22)' : 'rgba(255,255,255,0.08)',
      }}
    >
      <Text
        style={{
          color: active ? theme.colors.gold : 'rgba(255,255,255,0.68)',
          fontSize: 12,
          letterSpacing: 0.4,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function ResultPill({ label, value, accent = false }) {
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: accent ? 'rgba(212,175,55,0.22)' : 'rgba(255,255,255,0.08)',
        backgroundColor: accent ? 'rgba(212,175,55,0.10)' : 'rgba(255,255,255,0.04)',
      }}
    >
      <Text
        style={{
          color: accent ? theme.colors.gold : 'rgba(255,255,255,0.72)',
          fontSize: 12,
        }}
      >
        {label}: {value}
      </Text>
    </View>
  );
}

export default function Quiz({
  moduleCore,
  moduleContent,
  activeTrackId,
  t,
  quiz,
  setQuiz,
  onBackToModules,
}) {
  const { saveAssessmentResult } = useLearningPaths();

  const quizData = Array.isArray(moduleContent?.quiz) ? moduleContent.quiz : [];
  const totalQuestions = quizData.length;
  const { factual, caseStudy } = useMemo(() => classifyQuestions(quizData), [quizData]);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (quiz.submitted) {
      Animated.spring(resultAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 22,
        friction: 8,
      }).start();
    } else {
      slideAnim.setValue(24);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 30,
        friction: 9,
      }).start();
    }
  }, [quiz.current, quiz.submitted, resultAnim, slideAnim]);

  if (!totalQuestions) {
    return (
      <View
        style={{
          borderRadius: 28,
          padding: 24,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.07)',
          backgroundColor: 'rgba(255,255,255,0.03)',
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
          {t('assessment_coming_soon_title')}
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.62)',
            fontSize: 15,
            lineHeight: 24,
          }}
        >
          {t('assessment_coming_soon_desc')}
        </Text>
      </View>
    );
  }

  const qIdx = quiz.current;
  const question = quizData[qIdx];
  const selected = quiz.answers[qIdx] !== undefined ? quiz.answers[qIdx] : null;
  const confirmed = Boolean(quiz.confirmed?.[qIdx]);
  const isLast = qIdx === totalQuestions - 1;
  const currentType = normalizeQuestionType(question);

  const pct = Math.round(((qIdx + 1) / totalQuestions) * 100);
  const nextLabel = confirmed ? (isLast ? t('finish') : t('next')) : t('confirm');
  const canAdvance = confirmed || selected !== null;

  const selectOption = (index) => {
    if (confirmed) return;

    setQuiz((prev) => {
      const answers = [...(prev.answers || [])];
      answers[qIdx] = index;
      return { ...prev, answers };
    });
  };

  const finishQuiz = (prev) => {
    let correctCount = 0;

    for (let i = 0; i < totalQuestions; i += 1) {
      if (isAnswerCorrect(quizData[i], prev.answers[i])) {
        correctCount += 1;
      }
    }

    const score = Math.round((correctCount / totalQuestions) * 100);
    saveAssessmentResult(activeTrackId, moduleCore.id, score);

    return {
      ...prev,
      score,
      submitted: true,
    };
  };

  const next = () => {
    setQuiz((prev) => {
      const confirmedMap = { ...(prev.confirmed || {}) };

      if (!confirmedMap[prev.current]) {
        confirmedMap[prev.current] = true;
        return { ...prev, confirmed: confirmedMap };
      }

      if (prev.current < totalQuestions - 1) {
        return {
          ...prev,
          current: prev.current + 1,
          confirmed: confirmedMap,
        };
      }

      return finishQuiz({ ...prev, confirmed: confirmedMap });
    });
  };

  const retry = () => {
    setQuiz({
      current: 0,
      answers: [],
      confirmed: {},
      submitted: false,
      score: 0,
    });
  };

  if (quiz.submitted) {
    const passed = quiz.score >= moduleCore.cutoffPass;
    const expert = quiz.score >= moduleCore.cutoffExpert;

    return (
      <Animated.View
        style={{
          opacity: resultAnim,
          transform: [
            {
              translateY: resultAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <LinearGradient
          colors={
            passed
              ? ['rgba(212,175,55,0.18)', 'rgba(255,255,255,0.03)']
              : ['rgba(150,56,56,0.20)', 'rgba(255,255,255,0.03)']
          }
          style={{
            borderRadius: 30,
            borderWidth: 1,
            borderColor: passed ? 'rgba(212,175,55,0.24)' : 'rgba(190,90,90,0.24)',
            padding: 26,
          }}
        >
          <View
            style={{
              width: 144,
              height: 144,
              borderRadius: 72,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 22,
              borderWidth: 1,
              borderColor: passed ? 'rgba(212,175,55,0.28)' : 'rgba(190,90,90,0.28)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <Text
              style={{
                color: passed ? theme.colors.gold : '#F1B1B1',
                fontSize: 36,
                fontFamily: 'PlayfairDisplay_700',
              }}
            >
              {quiz.score}%
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.52)',
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {t('score_label').replace(':', '')}
            </Text>
          </View>

          <Text
            style={{
              color: passed ? theme.colors.gold : '#F3C0C0',
              textAlign: 'center',
              fontSize: 28,
              fontFamily: 'PlayfairDisplay_700',
              marginBottom: 8,
            }}
          >
            {passed ? t('result_pass') : t('result_fail')}
          </Text>

          <Text
            style={{
              color: 'rgba(255,255,255,0.72)',
              textAlign: 'center',
              fontSize: 15,
              lineHeight: 24,
              marginBottom: 18,
            }}
          >
            {passed ? t('result_pass_msg') : t('result_fail_msg')}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 20,
            }}
          >
            <ResultPill label={t('factual_label')} value={String(factual.length)} />
            <ResultPill label={t('case_study_label')} value={String(caseStudy.length)} />
            {expert ? (
              <ResultPill
                label={t('status_label')}
                value={t('expert_label')}
                accent
              />
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Pressable onPress={retry}>
              <LinearGradient
                colors={[theme.colors.gold, '#9A7A17']}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 22,
                  borderRadius: 18,
                  minWidth: 190,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#111',
                    fontSize: 14,
                    fontFamily: 'PlayfairDisplay_700',
                  }}
                >
                  {t('retry')}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={typeof onBackToModules === 'function' ? onBackToModules : () => {}}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 22,
                borderRadius: 18,
                minWidth: 190,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.09)',
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              <Text style={{ color: theme.colors.text, fontSize: 14 }}>
                {t('back_to_modules')}
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }

  const isCorrectSelected = confirmed && isAnswerCorrect(question, selected);

  return (
    <Animated.View
      style={{
        opacity: slideAnim.interpolate({
          inputRange: [0, 24],
          outputRange: [1, 0],
        }),
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 14,
        }}
      >
        <MetaPill
          active={currentType === 'factual'}
          label={`${t('factual_label')} · ${factual.length}`}
        />
        <MetaPill
          active={currentType === 'caseStudy'}
          label={`${t('case_study_label')} · ${caseStudy.length}`}
        />
      </View>

      <View
        style={{
          marginBottom: 16,
          borderRadius: 18,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <LinearGradient
            colors={[theme.colors.gold, '#9A7A17']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${pct}%`, height: '100%' }}
          />
        </View>

        <View style={{ paddingHorizontal: 14, paddingVertical: 11 }}>
          <Text
            style={{
              color: 'rgba(255,255,255,0.62)',
              fontSize: 12,
              letterSpacing: 0.4,
            }}
          >
            {t('q_label')} {qIdx + 1} {t('of')} {totalQuestions} · {typeLabel(question, t)}
          </Text>
        </View>
      </View>

      <LinearGradient
        colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
        style={{
          borderRadius: 30,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.07)',
          padding: 22,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 56,
            height: 2,
            borderRadius: 999,
            backgroundColor: 'rgba(212,175,55,0.70)',
            marginBottom: 14,
          }}
        />

        <Text
          style={{
            color: theme.colors.gold,
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {typeLabel(question, t)}
        </Text>

        <Text
          style={{
            color: theme.colors.text,
            fontSize: 25,
            lineHeight: 35,
            fontFamily: 'PlayfairDisplay_700',
            marginBottom: 22,
          }}
        >
          {question?.question}
        </Text>

        <View style={{ gap: 12 }}>
          {(Array.isArray(question?.options) ? question.options : []).map((option, index) => {
            const selectedThis = selected === index;
            const correctThis = confirmed && isAnswerCorrect(question, index);
            const wrongSelected = confirmed && selectedThis && !correctThis;

            return (
              <Pressable
                key={`${moduleCore.id}-${activeTrackId}-q-${qIdx}-opt-${index}`}
                onPress={() => selectOption(index)}
                style={{
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: correctThis
                    ? 'rgba(88,180,115,0.38)'
                    : wrongSelected
                      ? 'rgba(216,98,98,0.38)'
                      : selectedThis
                        ? 'rgba(212,175,55,0.28)'
                        : 'rgba(255,255,255,0.08)',
                  backgroundColor: correctThis
                    ? 'rgba(88,180,115,0.12)'
                    : wrongSelected
                      ? 'rgba(216,98,98,0.12)'
                      : selectedThis
                        ? 'rgba(212,175,55,0.10)'
                        : 'rgba(255,255,255,0.03)',
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.gold,
                        fontSize: 12,
                        fontFamily: 'PlayfairDisplay_700',
                      }}
                    >
                      {'ABCD'[index] || '?'}
                    </Text>
                  </View>

                  <Text
                    style={{
                      flex: 1,
                      color: correctThis
                        ? '#D9F4DE'
                        : wrongSelected
                          ? '#FFD9D9'
                          : theme.colors.text,
                      fontSize: 15,
                      lineHeight: 23,
                    }}
                  >
                    {option}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {confirmed ? (
          <View
            style={{
              marginTop: 18,
              borderRadius: 18,
              padding: 15,
              borderWidth: 1,
              borderColor: isCorrectSelected ? 'rgba(88,180,115,0.24)' : 'rgba(216,98,98,0.24)',
              backgroundColor: isCorrectSelected ? 'rgba(88,180,115,0.08)' : 'rgba(216,98,98,0.08)',
            }}
          >
            <Text
              style={{
                color: isCorrectSelected ? '#CDEFD4' : '#FFD5D5',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 1.1,
                marginBottom: 6,
              }}
            >
              {t('explanation_label')}
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.80)',
                fontSize: 14,
                lineHeight: 22,
              }}
            >
              {question?.explanation}
            </Text>
          </View>
        ) : null}
      </LinearGradient>

      <Pressable
        disabled={!canAdvance}
        onPress={next}
        style={{ opacity: canAdvance ? 1 : 0.45 }}
      >
        <LinearGradient
          colors={[theme.colors.gold, '#9A7A17']}
          style={{
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#111',
              fontSize: 15,
              fontFamily: 'PlayfairDisplay_700',
            }}
          >
            {nextLabel}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}