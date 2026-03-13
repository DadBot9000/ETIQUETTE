import type { ModuleTranslationOverlay } from './moduleTranslationTypes';

export type ModuleTranslationStatus =
  | 'missing'
  | 'available'
  | 'stale'
  | 'invalid';

export function getModuleTranslationStatus(params: {
  overlay: ModuleTranslationOverlay | null;
  expectedSourceHash: string | null;
}): ModuleTranslationStatus {
  const { overlay, expectedSourceHash } = params;

  if (!overlay) {
    return 'missing';
  }

  if (!overlay.meta?.sourceHash || !expectedSourceHash) {
    return 'invalid';
  }

  if (overlay.meta.sourceHash !== expectedSourceHash) {
    return 'stale';
  }

  return 'available';
}