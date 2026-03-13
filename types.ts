export type AppLanguage =
  | 'PL'
  | 'EN'
  | 'DE'
  | 'ES'
  | 'FR'
  | 'JA'
  | 'SV'
  | 'PT-BR'
  | 'IT'
  | 'AR'
  | 'KO'
  | 'RU'
  | 'CN';

export type CulturalProfileId =
  | 'PL'
  | 'EN'
  | 'DE'
  | 'ES'
  | 'FR'
  | 'JP'
  | 'SE'
  | 'BR'
  | 'IT'
  | 'AE'
  | 'US'
  | 'KR';

export type CulturalTrackId = CulturalProfileId;

export type LocalizedText = Partial<Record<AppLanguage, string>>;
export type LocalizedTextLike = string | LocalizedText;

export type BloomLevel =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 'knowledge'
  | 'understanding'
  | 'application'
  | 'analysis'
  | 'evaluation'
  | 'creation';

export type DifficultyLevel = number;

export type QuizInteractionType =
  | 'single-choice'
  | 'multi-choice'
  | 'true-false';

export type QuizQuestionKind = 'factual' | 'caseStudy';

export interface QuizStructure {
  singleChoice: number;
  multiChoice: number;
  trueFalse: number;
}

export interface ModuleCoreDefinition {
  id: string;
  sortOrder: number;
  block: string;
  icon: string;
  weight: number;
  difficulty: DifficultyLevel;
  bloomLevel: BloomLevel;
  cutoffPass: number;
  cutoffExpert: number;
  quizCount: number;
  quizStructure: QuizStructure;
}

export interface CulturalNote {
  title: LocalizedTextLike;
  body: LocalizedTextLike;
}

export type TopicCulturalScope =
  | CulturalProfileId
  | 'local'
  | 'regional'
  | 'global'
  | 'cross-cultural'
  | 'universal';

export interface ModuleTopicContent {
  /**
   * Stabilny identyfikator logiczny tematu.
   * Opcjonalny dla kompatybilności wstecznej ze starymi modułami.
   * Jeśli jest obecny zarówno w source, jak i overlay, merge powinien używać id zamiast indeksu.
   */
  id?: string;
  title: LocalizedTextLike;
  content: LocalizedTextLike;
  bloomLevel: BloomLevel;
  culturalScope: TopicCulturalScope;
}

export interface ModuleQuizItem {
  /**
   * Stabilny identyfikator logiczny pytania.
   * Opcjonalny dla kompatybilności wstecznej ze starymi modułami.
   * Jeśli jest obecny zarówno w source, jak i overlay, merge powinien używać id zamiast indeksu.
   */
  id?: string;
  question: LocalizedTextLike;
  options: LocalizedTextLike[];
  correct: number | number[] | boolean;
  type?: QuizInteractionType | QuizQuestionKind | string;
  explanation: LocalizedTextLike;
  questionKind?: QuizQuestionKind;
}

export interface ModuleTrackContent {
  title: LocalizedTextLike;
  subtitle: LocalizedTextLike;
  culturalContext: LocalizedTextLike;
  culturalNote: CulturalNote;
  topics: ModuleTopicContent[];
  quiz: ModuleQuizItem[];

  /**
   * Opcjonalne pola pomocnicze pod nowy model M_XX_PROFILE.ts
   * Nie są wymagane przez obecny UI, ale pozwalają bezpiecznie
   * przejść na profile kulturowe bez kolejnego łamania kontraktu.
   */
  profileId?: CulturalProfileId;
  sourceLanguage?: 'PL';
}

export interface ModuleDefinition {
  core: ModuleCoreDefinition;
  content: Partial<Record<CulturalProfileId, ModuleTrackContent>>;
}

export interface CertificationResult {
  score: number;
  passed: boolean;
  expert: boolean;
}

export interface TrackProgressEntry {
  attempts: number;
  latestScore: number;
  bestScore: number;
  passed: boolean;
  expert: boolean;
  certifiedAt?: string;
  lastAttemptAt?: string;
}

export type TrackProgressMap = Record<string, TrackProgressEntry>;
export type LearningProgress = Record<CulturalTrackId, TrackProgressMap>;

export interface LearningPathsState {
  enrolledTracks: CulturalTrackId[];
  activeTrackOrder: CulturalTrackId[];
  progress: LearningProgress;
  lastVisitedByTrack: Partial<Record<CulturalTrackId, string>>;
}

export interface ResolvedModuleView {
  moduleId: string;
  core: ModuleCoreDefinition;
  trackId: CulturalTrackId;
  profileId: CulturalProfileId;
  content: ModuleTrackContent;
}