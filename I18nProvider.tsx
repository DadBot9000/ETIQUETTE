import React, { createContext, useContext, useMemo } from 'react';
import { TRANSLATION_REGISTRY } from './registryBuilder';
import type { SupportedLang } from './contentRegistry';

type InterpolationValues = Record<string, string | number | boolean | null | undefined>;

type TranslationFn = (key: string, vars?: InterpolationValues) => string;

type I18nContextValue = {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: TranslationFn;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, vars?: InterpolationValues): string {
  if (!vars) return template;

  return template.replace(/\{(\w+)\}/g, (_, token) => {
    const value = vars[token];
    return value === undefined || value === null ? `{${token}}` : String(value);
  });
}

function resolveTranslation(key: string, lang: SupportedLang): string {
  const registry = TRANSLATION_REGISTRY;

  const directEntry = registry[key];
  const legacyUiAlias = key.startsWith('ui.') || key.startsWith('content.')
    ? undefined
    : registry[`ui.${key}`];

  const entry = directEntry || legacyUiAlias;

  if (!entry) {
    return __DEV__ ? `[missing: ${key}]` : key;
  }

  const localized = entry[lang];
  if (localized && localized.trim()) {
    return localized;
  }

  const fallback = entry.EN;
  if (fallback && fallback.trim()) {
    return fallback;
  }

  return __DEV__ ? `[missing: ${key}]` : key;
}

export function I18nProvider({
  lang,
  setLang,
  children,
}: {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const t: TranslationFn = (key, vars) => {
      const resolved = resolveTranslation(key, lang);
      return interpolate(resolved, vars);
    };

    return {
      lang,
      setLang,
      t,
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used inside I18nProvider');
  }

  return context;
}