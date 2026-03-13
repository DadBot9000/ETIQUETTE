import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { evaluateCertification } from '../../domain/learning/certification';
import { getModuleDefinition } from '../../domain/learning/resolver';
import type {
  CulturalTrackId,
  LearningPathsState,
  LearningProgress,
  TrackProgressEntry,
} from '../../domain/learning/types';

const STORAGE_KEY = '@learning_paths_state_v3_profiles';

const EMPTY_PROGRESS: LearningProgress = {
  PL: {},
  EN: {},
  DE: {},
  ES: {},
  FR: {},
  JP: {},
  SE: {},
  BR: {},
  IT: {},
  AE: {},
  US: {},
  KR: {},
};

const DEFAULT_STATE: LearningPathsState = {
  enrolledTracks: ['PL'],
  activeTrackOrder: ['PL'],
  progress: EMPTY_PROGRESS,
  lastVisitedByTrack: {},
};

type LearningPathsContextValue = {
  state: LearningPathsState;
  enrollTrack: (trackId: CulturalTrackId) => void;
  unenrollTrack: (trackId: CulturalTrackId) => void;
  setPrimaryTrack: (trackId: CulturalTrackId) => void;
  toggleEnrollment: (trackId: CulturalTrackId) => void;
  getProgress: (
    trackId: CulturalTrackId,
    moduleId: string
  ) => TrackProgressEntry | null;
  saveAssessmentResult: (
    trackId: CulturalTrackId,
    moduleId: string,
    score: number
  ) => void;
  markVisited: (trackId: CulturalTrackId, moduleId: string) => void;
};

const LearningPathsContext = createContext<LearningPathsContextValue | null>(null);

function dedupeTracks(tracks: CulturalTrackId[]): CulturalTrackId[] {
  return Array.from(new Set(tracks)) as CulturalTrackId[];
}

function normalizeState(input?: Partial<LearningPathsState> | null): LearningPathsState {
  const rawEnrolledTracks = Array.isArray(input?.enrolledTracks)
    ? input.enrolledTracks
    : [];

  const enrolledTracks: CulturalTrackId[] =
  rawEnrolledTracks.length > 0
    ? dedupeTracks(rawEnrolledTracks)
    : ['PL'];

  const rawActiveTrackOrder = Array.isArray(input?.activeTrackOrder)
    ? input.activeTrackOrder
    : [];

  const activeTrackOrder: CulturalTrackId[] =
    rawActiveTrackOrder.length > 0
      ? rawActiveTrackOrder.filter((trackId) => enrolledTracks.includes(trackId))
      : [...enrolledTracks];

  return {
    enrolledTracks,
    activeTrackOrder:
      activeTrackOrder.length > 0 ? activeTrackOrder : [...enrolledTracks],
    progress: {
  PL: input?.progress?.PL ?? {},
  EN: input?.progress?.EN ?? {},
  DE: input?.progress?.DE ?? {},
  ES: input?.progress?.ES ?? {},
  FR: input?.progress?.FR ?? {},
  JP: input?.progress?.JP ?? {},
  SE: input?.progress?.SE ?? {},
  BR: input?.progress?.BR ?? {},
  IT: input?.progress?.IT ?? {},
  AE: input?.progress?.AE ?? {},
  US: input?.progress?.US ?? {},
  KR: input?.progress?.KR ?? {},
},
    lastVisitedByTrack: input?.lastVisitedByTrack ?? {},
  };
}

export function LearningPathsProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [state, setState] = useState<LearningPathsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;

        if (!raw) {
          setHydrated(true);
          return;
        }

        const parsed = JSON.parse(raw) as Partial<LearningPathsState>;
        setState(normalizeState(parsed));
        setHydrated(true);
      } catch (error) {
        console.warn('[LP] Failed to hydrate learning paths state', error);
        setHydrated(true);
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error) => {
      console.warn('[LP] Failed to persist learning paths state', error);
    });
  }, [state, hydrated]);

  const enrollTrack = useCallback((trackId: CulturalTrackId) => {
    setState((prev) => {
      if (prev.enrolledTracks.includes(trackId)) {
        return prev;
      }

      return {
        ...prev,
        enrolledTracks: [...prev.enrolledTracks, trackId],
        activeTrackOrder: [trackId, ...prev.activeTrackOrder],
      };
    });
  }, []);

  const unenrollTrack = useCallback((trackId: CulturalTrackId) => {
    setState((prev) => {
      if (prev.enrolledTracks.length === 1) {
        return prev;
      }

      if (!prev.enrolledTracks.includes(trackId)) {
        return prev;
      }

      const enrolledTracks = prev.enrolledTracks.filter((id) => id !== trackId);
      const activeTrackOrder = prev.activeTrackOrder.filter((id) => id !== trackId);

      return {
        ...prev,
        enrolledTracks,
        activeTrackOrder:
          activeTrackOrder.length > 0 ? activeTrackOrder : [...enrolledTracks],
      };
    });
  }, []);

  const setPrimaryTrack = useCallback((trackId: CulturalTrackId) => {
    setState((prev) => {
      const enrolledTracks = prev.enrolledTracks.includes(trackId)
        ? prev.enrolledTracks
        : [...prev.enrolledTracks, trackId];

      const rest = prev.activeTrackOrder.filter((id) => id !== trackId);

      return {
        ...prev,
        enrolledTracks,
        activeTrackOrder: [trackId, ...rest],
      };
    });
  }, []);

  const toggleEnrollment = useCallback((trackId: CulturalTrackId) => {
    setState((prev) => {
      if (prev.enrolledTracks.includes(trackId)) {
        if (prev.enrolledTracks.length === 1) {
          return prev;
        }

        const enrolledTracks = prev.enrolledTracks.filter((id) => id !== trackId);
        const activeTrackOrder = prev.activeTrackOrder.filter((id) => id !== trackId);

        return {
          ...prev,
          enrolledTracks,
          activeTrackOrder:
            activeTrackOrder.length > 0 ? activeTrackOrder : [...enrolledTracks],
        };
      }

      return {
        ...prev,
        enrolledTracks: [...prev.enrolledTracks, trackId],
        activeTrackOrder: [trackId, ...prev.activeTrackOrder],
      };
    });
  }, []);

  const getProgress = useCallback(
    (trackId: CulturalTrackId, moduleId: string): TrackProgressEntry | null => {
      return state.progress[trackId]?.[moduleId] ?? null;
    },
    [state.progress]
  );

  const saveAssessmentResult = useCallback(
    (trackId: CulturalTrackId, moduleId: string, score: number) => {
      const module = getModuleDefinition(moduleId);
      if (!module) {
        console.warn(`[LP] Module not found for assessment result: ${moduleId}`);
        return;
      }

      const certification = evaluateCertification(module.core, score);
      const now = new Date().toISOString();

      setState((prev) => {
        const previous = prev.progress[trackId]?.[moduleId];

        const nextEntry: TrackProgressEntry = {
          attempts: (previous?.attempts ?? 0) + 1,
          latestScore: certification.score,
          bestScore: Math.max(previous?.bestScore ?? 0, certification.score),
          passed: Boolean(previous?.passed || certification.passed),
          expert: Boolean(previous?.expert || certification.expert),
          certifiedAt: certification.passed
            ? previous?.certifiedAt ?? now
            : previous?.certifiedAt,
          lastAttemptAt: now,
        };

        return {
          ...prev,
          progress: {
            ...prev.progress,
            [trackId]: {
              ...prev.progress[trackId],
              [moduleId]: nextEntry,
            },
          },
        };
      });
    },
    []
  );

  const markVisited = useCallback((trackId: CulturalTrackId, moduleId: string) => {
    setState((prev) => ({
      ...prev,
      lastVisitedByTrack: {
        ...prev.lastVisitedByTrack,
        [trackId]: moduleId,
      },
    }));
  }, []);

  const value = useMemo<LearningPathsContextValue>(
    () => ({
      state,
      enrollTrack,
      unenrollTrack,
      setPrimaryTrack,
      toggleEnrollment,
      getProgress,
      saveAssessmentResult,
      markVisited,
    }),
    [
      state,
      enrollTrack,
      unenrollTrack,
      setPrimaryTrack,
      toggleEnrollment,
      getProgress,
      saveAssessmentResult,
      markVisited,
    ]
  );

  return (
    <LearningPathsContext.Provider value={value}>
      {children}
    </LearningPathsContext.Provider>
  );
}

export function useLearningPaths(): LearningPathsContextValue {
  const context = useContext(LearningPathsContext);


  if (!context) {
    throw new Error('useLearningPaths must be used inside LearningPathsProvider');
  }

  return context;
}