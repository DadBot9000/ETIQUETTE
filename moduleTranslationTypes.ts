import type { AppLanguage, CulturalProfileId } from './types';

export type TranslationSourceLanguage = 'PL';

export interface ModuleTranslationMetadata {
  moduleId: string;
  profileId: CulturalProfileId;
  language: AppLanguage;
  sourceLanguage: TranslationSourceLanguage;
  sourceHash: string;
  schemaVersion: 1;
  generatedAt?: string;
  updatedAt?: string;
}

export interface LocalizedCulturalNoteOverlay {
  title?: string;
  body?: string;
}

export interface LocalizedTopicOverlay {
  /**
   * Stabilny identyfikator tematu.
   * Jeśli obecny, overlay zostanie dopasowany po id zamiast indeksu.
   */
  id?: string;

  title?: string;
  content?: string;
}

export interface LocalizedQuizItemOverlay {
  /**
   * Stabilny identyfikator pytania quizowego.
   * Jeśli obecny, overlay zostanie dopasowany po id zamiast indeksu.
   */
  id?: string;

  question?: string;
  options?: string[];
  explanation?: string;
}

export interface ModuleTranslationOverlayContent {
  title?: string;
  subtitle?: string;
  culturalContext?: string;
  culturalNote?: LocalizedCulturalNoteOverlay;
  topics?: LocalizedTopicOverlay[];
  quiz?: LocalizedQuizItemOverlay[];
}

export interface ModuleTranslationOverlay {
  meta: ModuleTranslationMetadata;
  content: ModuleTranslationOverlayContent;
}

export type ModuleTranslationLanguageMap = Partial<
  Record<AppLanguage, ModuleTranslationOverlay>
>;

export type ModuleTranslationProfileMap = Partial<
  Record<CulturalProfileId, ModuleTranslationLanguageMap>
>;

export type ModuleTranslationRegistry = Record<
  string,
  ModuleTranslationProfileMap
>;