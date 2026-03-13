import { T } from '../data/translations';
import { CONTENT_REGISTRY, type TranslationRegistry, type SupportedLang } from './contentRegistry';

type LegacyTranslations = Record<string, any>;

const SUPPORTED_LANGS: SupportedLang[] = ['EN', 'PL', 'ES', 'DE'];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function flattenObject(
  input: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(input)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result[nextKey] = value;
      continue;
    }

    if (isPlainObject(value)) {
      Object.assign(result, flattenObject(value, nextKey));
    }
  }

  return result;
}

/**
 * Builds a normalized UI registry from legacy T.
 *
 * Compatibility rules:
 * - keep legacy keys, e.g. "nav_home"
 * - add namespaced aliases, e.g. "ui.nav_home"
 * - keep nested keys flattened, e.g. "blocks.I.title"
 * - add namespaced nested aliases, e.g. "ui.blocks.I.title"
 */
function buildUiRegistry(): TranslationRegistry {
  const registry: TranslationRegistry = {};

  for (const lang of SUPPORTED_LANGS) {
    const langTree = (T as LegacyTranslations)?.[lang] || {};
    const flat = flattenObject(langTree);

    for (const [flatKey, value] of Object.entries(flat)) {
      if (!registry[flatKey]) {
        registry[flatKey] = {};
      }
      registry[flatKey][lang] = value;

      const namespacedKey = flatKey.startsWith('ui.') ? flatKey : `ui.${flatKey}`;
      if (!registry[namespacedKey]) {
        registry[namespacedKey] = {};
      }
      registry[namespacedKey][lang] = value;
    }
  }

  return registry;
}

export const UI_REGISTRY: TranslationRegistry = buildUiRegistry();

/**
 * Final translation registry used by the runtime translator.
 *
 * Priority:
 * 1. content registry (dynamic texts)
 * 2. ui registry (static interface labels)
 */
export const TRANSLATION_REGISTRY: TranslationRegistry = {
  ...CONTENT_REGISTRY,
  ...UI_REGISTRY,
};