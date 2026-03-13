import type { ModuleTrackContent } from './types';
import type {
  LocalizedQuizItemOverlay,
  LocalizedTopicOverlay,
  ModuleTranslationOverlay,
} from './moduleTranslationTypes';

type WithOptionalId = {
  id?: string;
};

function normalizeStableId(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function buildOverlayIndexById<T extends WithOptionalId>(
  items: T[] | undefined
): Map<string, T> {
  const map = new Map<string, T>();

  for (const item of Array.isArray(items) ? items : []) {
    const stableId = normalizeStableId(item?.id);
    if (!stableId || map.has(stableId)) {
      continue;
    }

    map.set(stableId, item);
  }

  return map;
}

function resolveOverlayByIdOrIndex<TBase extends WithOptionalId, TOverlay extends WithOptionalId>(
  baseItem: TBase,
  overlayItems: TOverlay[] | undefined,
  overlayIndexById: Map<string, TOverlay>,
  index: number
): TOverlay | undefined {
  const stableId = normalizeStableId(baseItem?.id);

  if (stableId) {
    const byId = overlayIndexById.get(stableId);
    if (byId) {
      return byId;
    }
  }

  return Array.isArray(overlayItems) ? overlayItems[index] : undefined;
}

function mergeTopic(
  baseTopic: ModuleTrackContent['topics'][number],
  overlay?: (LocalizedTopicOverlay & WithOptionalId) | undefined
) {
  if (!overlay) {
    return baseTopic;
  }

  return {
    ...baseTopic,
    title: overlay.title ?? baseTopic.title,
    content: overlay.content ?? baseTopic.content,
  };
}

function mergeQuizItem(
  baseQuestion: ModuleTrackContent['quiz'][number],
  overlay?: (LocalizedQuizItemOverlay & WithOptionalId) | undefined
) {
  if (!overlay) {
    return baseQuestion;
  }

  return {
    ...baseQuestion,
    question: overlay.question ?? baseQuestion.question,
    explanation: overlay.explanation ?? baseQuestion.explanation,
    options: Array.isArray(overlay.options) ? overlay.options : baseQuestion.options,
  };
}

export function mergeModuleTranslationOverlay(
  sourceContent: ModuleTrackContent,
  overlay: ModuleTranslationOverlay | null
): ModuleTrackContent {
  if (!overlay) {
    return sourceContent;
  }

  const overlayContent = overlay.content || {};
  const topicOverlayIndexById = buildOverlayIndexById(
    overlayContent.topics as (LocalizedTopicOverlay & WithOptionalId)[] | undefined
  );
  const quizOverlayIndexById = buildOverlayIndexById(
    overlayContent.quiz as (LocalizedQuizItemOverlay & WithOptionalId)[] | undefined
  );

  const mergedTopics = Array.isArray(sourceContent.topics)
    ? sourceContent.topics.map((topic, index) =>
        mergeTopic(
          topic,
          resolveOverlayByIdOrIndex(
            topic,
            overlayContent.topics as (LocalizedTopicOverlay & WithOptionalId)[] | undefined,
            topicOverlayIndexById,
            index
          )
        )
      )
    : sourceContent.topics;

  const mergedQuiz = Array.isArray(sourceContent.quiz)
    ? sourceContent.quiz.map((question, index) =>
        mergeQuizItem(
          question,
          resolveOverlayByIdOrIndex(
            question,
            overlayContent.quiz as (LocalizedQuizItemOverlay & WithOptionalId)[] | undefined,
            quizOverlayIndexById,
            index
          )
        )
      )
    : sourceContent.quiz;

  return {
    ...sourceContent,
    title: overlayContent.title ?? sourceContent.title,
    subtitle: overlayContent.subtitle ?? sourceContent.subtitle,
    culturalContext:
      overlayContent.culturalContext ?? sourceContent.culturalContext,
    culturalNote: {
      ...sourceContent.culturalNote,
      title:
        overlayContent.culturalNote?.title ?? sourceContent.culturalNote.title,
      body:
        overlayContent.culturalNote?.body ?? sourceContent.culturalNote.body,
    },
    topics: mergedTopics,
    quiz: mergedQuiz,
  };
}