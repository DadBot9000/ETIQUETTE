import { MODULE_TRANSLATION_REGISTRY } from './translationRegistry';
import type { AppLanguage, CulturalProfileId } from './types';
import type {
  ModuleTranslationLanguageMap,
  ModuleTranslationOverlay,
} from './moduleTranslationTypes';

function uniqueLanguages(languages: AppLanguage[]): AppLanguage[] {
  const seen = new Set<string>();
  const result: AppLanguage[] = [];

  for (const language of Array.isArray(languages) ? languages : []) {
    const normalized = String(language || '').trim() as AppLanguage;

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

export function buildTranslationLanguageOrder(
  language: AppLanguage
): AppLanguage[] {
  return uniqueLanguages([language, 'EN', 'PL']);
}

export function getModuleTranslationLanguageMap(
  moduleId: string,
  profileId: CulturalProfileId
): ModuleTranslationLanguageMap | null {
  return MODULE_TRANSLATION_REGISTRY?.[moduleId]?.[profileId] ?? null;
}

export function resolveModuleTranslationOverlay(
  moduleId: string,
  profileId: CulturalProfileId,
  language: AppLanguage
): ModuleTranslationOverlay | null {
  const languageMap = getModuleTranslationLanguageMap(moduleId, profileId);

  if (!languageMap) {
    return null;
  }

  const fallbackOrder = buildTranslationLanguageOrder(language);

  for (const candidateLanguage of fallbackOrder) {
    const overlay = languageMap[candidateLanguage];
    if (overlay) {
      return overlay;
    }
  }

  return null;
}