import { Audio } from 'expo-av';

/**
 * MAPOWANIE ZASOBÓW STATYCZNYCH
 * Zweryfikuj czy pliki na dysku nie mają spacji (np. JB1.mp3 zamiast JB 1.mp3)
 */
const MSC_RESOURCES = {
  // CLASSIC
  0: require('../assets/audio/CLS1.mp3'),
  1: require('../assets/audio/CLS2.mp3'),
  2: require('../assets/audio/CLS3.mp3'),

  // FUNKY/JAZZ
  10: require('../assets/audio/FJ1.mp3'),
  11: require('../assets/audio/FJ2.mp3'),
  12: require('../assets/audio/FJ3.mp3'),

  // JAZZ/BLUES
  20: require('../assets/audio/JB1.mp3'),
  21: require('../assets/audio/JB2.mp3'),
  22: require('../assets/audio/JB3.mp3'),

  // AMBIENT
  30: require('../assets/audio/ABT1.mp3'),
  31: require('../assets/audio/ABT2.mp3'),
  32: require('../assets/audio/ABT3.mp3'),
};

export async function playSynthTrack(sourceKey, volume = 0.6, shouldPlay = true, isCustom = false) {
  const source = isCustom ? { uri: sourceKey } : MSC_RESOURCES[sourceKey];

  if (!source) {
    console.error(`[Audio Engine] Key Error: ${sourceKey}`);
    return null;
  }

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const { sound } = await Audio.Sound.createAsync(
      source,
      { shouldPlay, volume, isLooping: true },
      null,
      isCustom
    );

    return sound;
  } catch (error) {
    console.error('[Platinum Engine] Playback Error:', error);
    return null;
  }
}