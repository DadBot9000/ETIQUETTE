import type { CertificationResult, ModuleCoreDefinition } from './types';

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Wzór certyfikacji S pozostaje odizolowany od treści kulturowej.
 * Operuje wyłącznie na core + score.
 */
export function evaluateCertification(
  core: ModuleCoreDefinition,
  rawScore: number
): CertificationResult {
  const score = clampScore(rawScore);

  return {
    score,
    passed: score >= core.cutoffPass,
    expert: score >= core.cutoffExpert,
  };
}