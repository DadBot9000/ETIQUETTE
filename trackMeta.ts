import type { LegacyCulturalTrackId } from './types';

export interface CulturalTrackMeta {
  id: LegacyCulturalTrackId;
  short: string;
  label: string;
}

export const CULTURAL_TRACK_META: Record<LegacyCulturalTrackId, CulturalTrackMeta> = {
  A: {
    id: 'A',
    short: 'CEE',
    label: 'Central & Eastern Europe',
  },
  B: {
    id: 'B',
    short: 'Anglo-Saxon',
    label: 'Anglo-Saxon World',
  },
  C: {
    id: 'C',
    short: 'Iberoamérica',
    label: 'Iberoamérica',
  },
  D: {
    id: 'D',
    short: 'DACH',
    label: 'DACH',
  },
};