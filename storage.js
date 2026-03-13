import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_LANG = 'etq_lang';
const KEY_PROGRESS = 'etq_progress';

export async function loadState() {
  try {
    const lang = await AsyncStorage.getItem(KEY_LANG);
    const prog = await AsyncStorage.getItem(KEY_PROGRESS);
    const progress = prog ? JSON.parse(prog) : {};
    return { lang, progress };
  } catch {
    return { lang: null, progress: {} };
  }
}

export async function saveState({ lang, progress }) {
  try {
    if (lang) await AsyncStorage.setItem(KEY_LANG, lang);
    await AsyncStorage.setItem(KEY_PROGRESS, JSON.stringify(progress || {}));
  } catch {
    // noop
  }
}

export function setProgress(prev, moduleId, score, passed) {
  const next = { ...(prev || {}) };
  next[moduleId] = { passed, score, date: new Date().toLocaleDateString() };
  return next;
}