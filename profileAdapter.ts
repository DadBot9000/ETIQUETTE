import type { CulturalProfileId, CulturalTrackId } from './types';

export function isLegacyCulturalTrackId(id: string): boolean {
  return id === 'A' || id === 'B' || id === 'C' || id === 'D';
}

export function resolveProfileFromTrack(trackId: CulturalTrackId): CulturalProfileId {
  switch (trackId) {
    case 'A':
      return 'FR';
    case 'B':
      return 'JP';
    case 'C':
      return 'SE';
    case 'D':
      return 'FR';
    default:
      return 'FR';
  }
}