import { MODULE_REGISTRY, MODULE_REGISTRY_BY_ID } from './registry';
import { localizeModuleContent } from './contentLocalization';
import { mergeModuleTranslationOverlay } from './moduleTranslationMerge';
import { resolveModuleTranslationOverlay } from './moduleTranslationResolver';
import { isLegacyCulturalTrackId, resolveProfileFromTrack } from './profileAdapter';
import type {
  AppLanguage,
  CulturalProfileId,
  CulturalTrackId,
  ModuleDefinition,
  ModuleTrackContent,
  ResolvedModuleView,
} from './types';

function normalizeTrackToProfile(trackId: CulturalTrackId): CulturalProfileId {
  if (isLegacyCulturalTrackId(String(trackId))) {
    return resolveProfileFromTrack(trackId);
  }

  return trackId as CulturalProfileId;
}

function uniqueProfileOrder(trackOrder: CulturalTrackId[]): CulturalProfileId[] {
  const seen = new Set<string>();
  const result: CulturalProfileId[] = [];

  for (const trackId of Array.isArray(trackOrder) ? trackOrder : []) {
    const profileId = normalizeTrackToProfile(trackId);

    if (!profileId || seen.has(profileId)) {
      continue;
    }

    seen.add(profileId);
    result.push(profileId);
  }

  return result;
}

function buildContentFallbackOrder(
  trackOrder: CulturalTrackId[]
): CulturalProfileId[] {
  return uniqueProfileOrder(trackOrder);
}
export function listModuleDefinitions(): ModuleDefinition[] {
  return MODULE_REGISTRY;
}

export function listModuleCores() {
  return MODULE_REGISTRY.map((module) => module.core);
}

function buildModuleIdAliases(moduleId: string): string[] {
  const value = String(moduleId || '').trim();
  if (!value) return [];

  const aliases = new Set<string>();
  aliases.add(value);

  const underscoredToCompact = value.replace(/^M_(\d{2})$/, 'M$1');
  const compactToUnderscored = value.replace(/^M(\d{2})$/, 'M_$1');

  aliases.add(underscoredToCompact);
  aliases.add(compactToUnderscored);

  return Array.from(aliases);
}

export function getModuleDefinition(moduleId: string): ModuleDefinition | null {
  for (const candidate of buildModuleIdAliases(moduleId)) {
    const hit = MODULE_REGISTRY_BY_ID[candidate];
    if (hit) {
      return hit;
    }
  }

  return null;
}

export function resolveModuleContent(
  moduleId: string,
  trackOrder: CulturalTrackId[]
): { trackId: CulturalProfileId; content: ModuleTrackContent } | null {
  const module = getModuleDefinition(moduleId);

  if (!module) {
    console.warn('[resolver] module not found in registry', {
      moduleId,
      aliasesTried: buildModuleIdAliases(moduleId),
      trackOrder,
    });
    return null;
  }

  const resolutionOrder = buildContentFallbackOrder(trackOrder);
  const availableContentKeys = Object.keys(module.content || {}) as CulturalProfileId[];

  for (const profileId of resolutionOrder) {
    const content = module.content?.[profileId];
    if (content) {
      return { trackId: profileId, content };
    }
  }

  const fallbackProfileId = availableContentKeys[0];
  if (fallbackProfileId) {
    const fallbackContent = module.content?.[fallbackProfileId];
    if (fallbackContent) {
      console.warn('[resolver] using first available content fallback', {
        moduleId,
        fallbackProfileId,
        requestedTrackOrder: trackOrder,
        resolutionOrder,
        availableContentKeys,
      });

      return {
        trackId: fallbackProfileId,
        content: fallbackContent,
      };
    }
  }

  console.warn('[resolver] module found but no content available', {
    moduleId,
    requestedTrackOrder: trackOrder,
    resolutionOrder,
    availableContentKeys,
  });

  return null;
}

export function resolveModuleView(
  moduleId: string,
  trackOrder: CulturalTrackId[],
  lang: AppLanguage = 'EN'
): ResolvedModuleView | null {
  const module = getModuleDefinition(moduleId);
  if (!module) return null;

  const resolved = resolveModuleContent(moduleId, trackOrder);
  if (!resolved) return null;

  const translationOverlay = resolveModuleTranslationOverlay(
    moduleId,
    resolved.trackId,
    lang
  );

  const mergedContent = mergeModuleTranslationOverlay(
    resolved.content,
    translationOverlay
  );

  return {
    moduleId,
    core: module.core,
    trackId: resolved.trackId,
    profileId: resolved.trackId,
    content: localizeModuleContent(mergedContent, lang),
  };
}