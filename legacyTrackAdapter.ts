import type {
  AppLanguage,
  BloomLevel,
  CulturalTrackId,
  LocalizedText,
  LocalizedTextLike,
  ModuleCoreDefinition,
  ModuleDefinition,
  ModuleQuizItem,
  ModuleTopicContent,
  ModuleTrackContent,
} from './types';

type LegacyQuizType =
  | 'factual'
  | 'caseStudy'
  | 'single-choice'
  | 'multi-choice'
  | 'true-false';

type LegacyLocalizedContent = {
  title?: LocalizedTextLike;
  subtitle?: LocalizedTextLike;
  culturalContext?: LocalizedTextLike;
  culturalNote?: LocalizedTextLike;
  topics?: Array<{
    id?: string;
    title: LocalizedTextLike;
    content: LocalizedTextLike;
    bloomLevel?: number;
    culturalScope?: string;
  }>;
  quiz?: Array<{
    question: LocalizedTextLike;
    options: LocalizedTextLike[];
    correct: number | number[] | boolean;
    type?: LegacyQuizType;
    explanation?: LocalizedTextLike;
  }>;
};

type LegacyTrackModule = {
  id: string | number;
  lang?: string;
  culturalContext?: LocalizedTextLike;
  block?: number | string;
  blockName?: string;
  blockTitle?: string;
  culturalRegion?: string;
  culturalRegions?: string[];
  weight: number;
  difficulty: number;
  bloomLevel?: number;
  bloomLevelDominant?: number;
  cutoffPass: number;
  cutoffExpert: number;
  quizCount: number;
  quizStructure?: Record<string, number>;
  title?: LocalizedTextLike;
  subtitle?: LocalizedTextLike;
  culturalNote?: LocalizedTextLike;
  topics?: Array<{
    id?: string;
    title: LocalizedTextLike;
    content: LocalizedTextLike;
    bloomLevel?: number;
    culturalScope?: string;
  }>;
  quiz?: Array<{
    question: LocalizedTextLike;
    options: LocalizedTextLike[];
    correct: number | number[] | boolean;
    type?: LegacyQuizType;
    explanation?: LocalizedTextLike;
  }>;
  content?: Record<string, LegacyLocalizedContent>;
};

function normalizePercent(value: number): number {
  if (value <= 1) return Math.round(value * 100);
  return Math.round(value);
}

function normalizeDifficulty(value: number): 1 | 2 | 3 | 4 | 5 {
  if (value <= 1) {
    const mapped = Math.round(value * 5);
    return Math.max(1, Math.min(5, mapped || 1)) as 1 | 2 | 3 | 4 | 5;
  }

  return Math.max(1, Math.min(5, Math.round(value))) as 1 | 2 | 3 | 4 | 5;
}

function normalizeBloom(value?: number): BloomLevel {
  const raw = Math.round(value ?? 1);
  return Math.max(1, Math.min(6, raw)) as BloomLevel;
}

function toRomanBlock(value: string): string {
  const map: Record<string, string> = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V',
    '6': 'VI',
    I: 'I',
    II: 'II',
    III: 'III',
    IV: 'IV',
    V: 'V',
    VI: 'VI',
  };

  return map[value] || 'I';
}

function normalizeBlock(value: number | string | undefined): string {
  if (typeof value === 'number') {
    return `BLOCK ${toRomanBlock(String(value))}`;
  }

  if (typeof value === 'string' && value.trim()) {
    const cleaned = value.trim().toUpperCase();
    const normalized = cleaned.replace('BLOK ', '').replace('BLOCK ', '').trim();
    return `BLOCK ${toRomanBlock(normalized)}`;
  }

  return 'BLOCK I';
}

function normalizeQuizType(): 'single-choice' {
  return 'single-choice';
}

function normalizeCulturalScope(
  value?: string
): 'local' | 'regional' | 'global' | 'cross-cultural' | 'universal' {
  if (
    value === 'local' ||
    value === 'regional' ||
    value === 'global' ||
    value === 'cross-cultural' ||
    value === 'universal'
  ) {
    return value;
  }

  return 'regional';
}

function getSourceLanguage(raw: LegacyTrackModule): AppLanguage {
  const langKey = String(raw.lang || '').trim().toUpperCase();

  if (langKey === 'PL' || langKey === 'EN' || langKey === 'ES' || langKey === 'DE') {
    return langKey;
  }

  if (raw.content?.PL) return 'PL';
  if (raw.content?.EN) return 'EN';
  if (raw.content?.ES) return 'ES';
  if (raw.content?.DE) return 'DE';

  return 'EN';
}

function getLocalizedSource(raw: LegacyTrackModule): LegacyLocalizedContent {
  if (!raw.content) {
    return raw;
  }

  const sourceLang = getSourceLanguage(raw);

  if (raw.content[sourceLang]) {
    return raw.content[sourceLang];
  }

  if (raw.content.PL) return raw.content.PL;
  if (raw.content.EN) return raw.content.EN;
  if (raw.content.ES) return raw.content.ES;
  if (raw.content.DE) return raw.content.DE;

  const first = Object.values(raw.content)[0];
  return first || raw;
}
function inferBlockFromModuleId(moduleId: string): string {
  const numeric = Number(String(moduleId).replace(/\D/g, ''));

  if (numeric >= 1 && numeric <= 4) return 'BLOCK I';
  if (numeric >= 5 && numeric <= 11) return 'BLOCK II';
  if (numeric >= 12 && numeric <= 18) return 'BLOCK III';
  if (numeric >= 19 && numeric <= 22) return 'BLOCK IV';
  if (numeric >= 23 && numeric <= 25) return 'BLOCK V';
  if (numeric >= 26 && numeric <= 28) return 'BLOCK VI';

  return 'BLOCK I';
}

function toLocalizedText(
  value: LocalizedTextLike | undefined,
  sourceLang: AppLanguage
): LocalizedTextLike {
  if (!value) return '';

  if (typeof value === 'string') {
    return {
      [sourceLang]: value,
    } as LocalizedText;
  }

  return value;
}

function buildTrackContent(raw: LegacyTrackModule): ModuleTrackContent {
  const source = getLocalizedSource(raw);
  const sourceLang = getSourceLanguage(raw);

  const topics: ModuleTopicContent[] = Array.isArray(source.topics)
    ? source.topics.map((topic) => ({
        title: toLocalizedText(topic.title, sourceLang),
        content: toLocalizedText(topic.content, sourceLang),
        bloomLevel: normalizeBloom(topic.bloomLevel),
        culturalScope: normalizeCulturalScope(topic.culturalScope),
      }))
    : [];

  const quiz: ModuleQuizItem[] = Array.isArray(source.quiz)
    ? source.quiz.map((question) => {
        const rawType = String(question.type || '').trim().toLowerCase();

        return {
          question: toLocalizedText(question.question, sourceLang),
          options: (Array.isArray(question.options) ? question.options : []).map((option) =>
            toLocalizedText(option, sourceLang)
          ),
          correct: question.correct,
          type: normalizeQuizType(),
          explanation: toLocalizedText(question.explanation || '', sourceLang),
          questionKind:
            rawType === 'casestudy' ||
            rawType === 'case-study' ||
            rawType === 'case_study'
              ? 'caseStudy'
              : 'factual',
        };
      })
    : [];

  return {
    title: toLocalizedText(source.title, sourceLang),
    subtitle: toLocalizedText(source.subtitle, sourceLang),
    culturalContext: toLocalizedText(
      source.culturalContext || raw.culturalContext || '',
      sourceLang
    ),
    culturalNote: {
      title: toLocalizedText('Cultural note', sourceLang),
      body: toLocalizedText(
        source.culturalNote || raw.culturalNote || raw.culturalContext || '',
        sourceLang
      ),
    },
    topics,
    quiz,
  };
}

function isValidLegacyTrack(track: unknown): track is LegacyTrackModule {
  if (!track || typeof track !== 'object') {
    return false;
  }

  const candidate = track as Partial<LegacyTrackModule>;

  return (
    typeof candidate.weight === 'number' &&
    typeof candidate.difficulty === 'number' &&
    typeof candidate.cutoffPass === 'number' &&
    typeof candidate.cutoffExpert === 'number' &&
    typeof candidate.quizCount === 'number'
  );
}

function getFirstAvailableTrack(
  tracks: Partial<Record<CulturalTrackId, LegacyTrackModule>>
): { trackId: CulturalTrackId; track: LegacyTrackModule } | null {
  const order = Object.keys(tracks) as CulturalTrackId[];

  for (const trackId of order) {
    const track = tracks[trackId];

    if (isValidLegacyTrack(track)) {
      return { trackId, track };
    }

    if (track) {
      console.warn(
        `[legacyTrackAdapter] Invalid track ${trackId}. ` +
          `Expected numeric fields: weight, difficulty, cutoffPass, cutoffExpert, quizCount.`
      );
    }
  }

  return null;
}

function buildResolvedTrackContent(
  moduleId: string,
  tracks: Partial<Record<CulturalTrackId, LegacyTrackModule>>
): Partial<Record<CulturalTrackId, ModuleTrackContent>> {
  return (Object.entries(tracks) as Array<[CulturalTrackId, LegacyTrackModule | undefined]>)
    .reduce<Partial<Record<CulturalTrackId, ModuleTrackContent>>>(
      (acc, [trackId, track]) => {
        if (!track) {
          console.warn(
            `[legacyTrackAdapter] Missing track ${trackId} for module ${moduleId}.`
          );
          return acc;
        }

        acc[trackId] = buildTrackContent(track);
        return acc;
      },
      {}
    );
}

export function buildModuleFromLegacyTracks(input: {
  moduleId: string;
  icon: string;
  sortOrder: number;
  tracks: Partial<Record<CulturalTrackId, LegacyTrackModule>>;
}): ModuleDefinition {
  const fallback = getFirstAvailableTrack(input.tracks);

      if (!fallback) {
    console.warn(
      `[legacyTrackAdapter] No valid tracks provided for module ${input.moduleId}. ` +
        `Returning placeholder content instead of crashing runtime.`
    );

    const fallbackBlock = inferBlockFromModuleId(input.moduleId);

    const core: ModuleCoreDefinition = {
      id: input.moduleId,
      sortOrder: input.sortOrder,
      block: normalizeBlock(fallbackBlock),
      icon: input.icon,
      weight: 0,
      difficulty: normalizeDifficulty(0),
      bloomLevel: normalizeBloom(undefined),
      cutoffPass: 100,
      cutoffExpert: 100,
      quizCount: 0,
      quizStructure: {
        singleChoice: 0,
        multiChoice: 0,
        trueFalse: 0,
      },
    };

    return {
      core,
      content: {
        A: {
          title: `Module ${input.moduleId}`,
          subtitle: 'Content temporarily unavailable',
          culturalContext:
            'This module has been registered, but its track payload is not valid yet.',
          culturalNote: {
            title: 'Technical note',
            body:
              'The module was loaded in safe mode because no valid learning track was available.',
          },
          topics: [],
          quiz: [],
        },
      },
    };
  }

  const baseTrack = fallback.track;

  const resolvedBlock =
    baseTrack.block ??
    baseTrack.blockName ??
    baseTrack.blockTitle ??
    inferBlockFromModuleId(input.moduleId);

  const core: ModuleCoreDefinition = {
    id: input.moduleId,
    sortOrder: input.sortOrder,
    block: normalizeBlock(resolvedBlock),
    icon: input.icon,
    weight: baseTrack.weight,
    difficulty: normalizeDifficulty(baseTrack.difficulty),
    bloomLevel: normalizeBloom(
      baseTrack.bloomLevel ?? baseTrack.bloomLevelDominant
    ),
    cutoffPass: normalizePercent(baseTrack.cutoffPass),
    cutoffExpert: normalizePercent(baseTrack.cutoffExpert),
    quizCount: baseTrack.quizCount,
    quizStructure: {
      singleChoice: baseTrack.quizCount,
      multiChoice: 0,
      trueFalse: 0,
    },
  };

  return {
    core,
    content: buildResolvedTrackContent(input.moduleId, input.tracks),
  };
}