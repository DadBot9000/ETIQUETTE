export type SourceLanguage = 'PL';

export type CulturalProfileId =
  | 'PL'
  | 'US'
  | 'DE'
  | 'ES'
  | 'FR'
  | 'JP'
  | 'SE'
  | 'BR'
  | 'IT'
  | 'AE'
  | 'KR'
  | 'RU'
  | 'CN'
  | 'EN';

export type BloomLevel =
  | 'knowledge'
  | 'understanding'
  | 'application'
  | 'analysis'
  | 'evaluation'
  | 'creation';

export type QuizQuestionKind = 'factual' | 'caseStudy';

export interface SourceModuleTopic {
  title: string;
  content: string;
  bloomLevel: BloomLevel;
  culturalScope: CulturalProfileId | 'local' | 'regional' | 'global' | 'cross-cultural' | 'universal';
}

export interface SourceModuleQuizItem {
  question: string;
  options: string[];
  correct: number | number[] | boolean;
  type?: string;
  questionKind?: QuizQuestionKind;
  explanation: string;
}

export interface SourceModuleFileContent {
  weight: number;
  difficulty: number;
  cutoffPass: number;
  cutoffExpert: number;
  quizCount: number;
  topics: SourceModuleTopic[];
  quiz: SourceModuleQuizItem[];
}

export interface SourceModuleRecord {
  moduleId: string;
  moduleNumber: number;
  profileId: CulturalProfileId;
  sourceLanguage: SourceLanguage;
  sourceFile: string;
  content: SourceModuleFileContent;
}

export type SourceModuleRegistry = Record<
  string,
  Partial<Record<CulturalProfileId, SourceModuleRecord>>
>;