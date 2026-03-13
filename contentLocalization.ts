import type {
  AppLanguage,
  LocalizedText,
  LocalizedTextLike,
  ModuleTrackContent,
} from './types';

const FALLBACK_ORDER: AppLanguage[] = [
  'EN',
  'PL',
  'DE',
  'ES',
  'FR',
  'JA',
  'SV',
  'PT-BR',
  'IT',
  'AR',
  'KO',
  'RU',
  'CN',
];

export function resolveLocalizedText(
  value: LocalizedTextLike | undefined | null,
  lang: AppLanguage
): string {
  if (!value) return '';

  if (typeof value === 'string') {
    return value;
  }

  const localized = value as LocalizedText;

  if (localized[lang]) {
    return localized[lang] as string;
  }

  for (const fallbackLang of FALLBACK_ORDER) {
    if (localized[fallbackLang]) {
      return localized[fallbackLang] as string;
    }
  }

  return '';
}

export function localizeModuleContent(
  content: ModuleTrackContent,
  lang: AppLanguage
): ModuleTrackContent {
  return {
    ...content,
    title: resolveLocalizedText(content.title, lang),
    subtitle: resolveLocalizedText(content.subtitle, lang),
    culturalContext: resolveLocalizedText(content.culturalContext, lang),
    culturalNote: {
      title: resolveLocalizedText(content.culturalNote?.title, lang),
      body: resolveLocalizedText(content.culturalNote?.body, lang),
    },
    topics: (content.topics || []).map((topic) => ({
      ...topic,
      title: resolveLocalizedText(topic.title, lang),
      content: resolveLocalizedText(topic.content, lang),
    })),
    quiz: (content.quiz || []).map((question) => ({
      ...question,
      question: resolveLocalizedText(question.question, lang),
      explanation: resolveLocalizedText(question.explanation, lang),
      options: (question.options || []).map((option) =>
        resolveLocalizedText(option, lang)
      ),
    })),
  };
}