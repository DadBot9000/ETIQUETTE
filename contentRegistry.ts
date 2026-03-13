export type SupportedLang = 'EN' | 'PL' | 'ES' | 'DE';

export type TranslationEntry = Partial<Record<SupportedLang, string>>;

export type TranslationRegistry = Record<string, TranslationEntry>;

/**
 * PHASE 1:
 * Content registry starts empty on purpose.
 * We first stabilize the engine and App wiring.
 * Dynamic content migration will happen in later phases.
 */
export const CONTENT_REGISTRY: TranslationRegistry = {};