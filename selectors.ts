import { resolveLocalizedText } from './contentLocalization';
import { resolveModuleView } from './resolver';
import type {
  AppLanguage,
  CulturalProfileId,
  CulturalTrackId,
  ModuleDefinition,
  LocalizedTextLike,
  ResolvedModuleView,
} from './types';

export interface ResolvedModuleMetrics {
  topicsCount: number;
  quizCount: number;
  factualCount: number;
  caseStudyCount: number;
  passThreshold: number;
  expertThreshold: number;
}

export interface ResolvedModulePresentation {
  moduleId: string;
  icon: string;
  block: string;
  trackId: CulturalTrackId;
  profileId: CulturalProfileId;
  title: string;
  subtitle: string;
  culturalNote: string;
  metrics: ResolvedModuleMetrics;
  resolved: ResolvedModuleView;
}

function normalizeQuestionKind(question: {
  questionKind?: string;
  type?: string;
}): 'factual' | 'caseStudy' {
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

/**
 * Selector musi być odporny na dwa stany danych:
 * 1. content już zlokalizowany do stringów przez resolver
 * 2. content jeszcze zawierający LocalizedText
 *
 * Dzięki temu nie wywracamy obecnego runtime i jednocześnie
 * ograniczamy ryzyko "double localization".
 */
function readResolvedText(
  value: LocalizedTextLike | undefined,
  lang: AppLanguage
): string {
  if (typeof value === 'string') {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return '';
  }

  return (
    resolveLocalizedText(value, lang) ||
    resolveLocalizedText(value, 'EN') ||
    resolveLocalizedText(value, 'PL') ||
    ''
  );
}

export function getResolvedModuleMetrics(
  moduleView: ResolvedModuleView
): ResolvedModuleMetrics {
  const topics = Array.isArray(moduleView?.content?.topics)
    ? moduleView.content.topics
    : [];

  const quiz = Array.isArray(moduleView?.content?.quiz)
    ? moduleView.content.quiz
    : [];

  const factualCount = quiz.filter(
    (question) => normalizeQuestionKind(question) === 'factual'
  ).length;

  const caseStudyCount = quiz.filter(
    (question) => normalizeQuestionKind(question) === 'caseStudy'
  ).length;

  return {
    topicsCount: topics.length,
    quizCount: quiz.length,
    factualCount,
    caseStudyCount,
    passThreshold: moduleView.core.cutoffPass,
    expertThreshold: moduleView.core.cutoffExpert,
  };
}

export function getResolvedModulePresentation(
  moduleId: string,
  activeTrackOrder: CulturalTrackId[],
  lang: AppLanguage = 'EN'
): ResolvedModulePresentation | null {
  const moduleView = resolveModuleView(moduleId, activeTrackOrder, lang);

  if (!moduleView) {
    return null;
  }

  const culturalNote =
    readResolvedText(moduleView.content.culturalNote?.body, lang) ||
    readResolvedText(moduleView.content.culturalContext, lang) ||
    '';

  const title = readResolvedText(moduleView.content.title, lang);
  const subtitle = readResolvedText(moduleView.content.subtitle, lang) || culturalNote;

  return {
    moduleId: moduleView.core.id,
    icon: moduleView.core.icon,
    block: moduleView.core.block,
    trackId: moduleView.trackId,
    profileId: moduleView.profileId,
    title,
    subtitle,
    culturalNote,
    metrics: getResolvedModuleMetrics(moduleView),
    resolved: moduleView,
  };
}

export function getModuleCoreCatalogItem(module: ModuleDefinition) {
  return {
    id: module.core.id,
    icon: module.core.icon,
    block: module.core.block,
    sortOrder: module.core.sortOrder,
  };
}