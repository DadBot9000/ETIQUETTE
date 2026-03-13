// ─────────────────────────────────────────────────────────────────────────────
// HEADER CONFIG — Stabilizacja Architektury Kolumnowej
// ─────────────────────────────────────────────────────────────────────────────

export const HEADER = {

  // ── Wysokość headera (bez safe area / insetsTop) ──────────────────────────
  HEIGHT: 72,

  // ── Szerokości "szyn" bocznych ────────────────────────────────────────────
  // Zwiększamy do 80, aby dać oddech przyciskom E i GLOBUS
  LEFT_WIDTH: 80,
  RIGHT_WIDTH: 80,

  // ── Padding wewnętrzny headera ────────────────────────────────────────────
  PADDING_LEFT: 12,
  PADDING_RIGHT: 12,

  // ── E Button (Header Context) — Precyzyjne wyśrodkowanie wewnątrz szyny ───
  // Resetujemy offsety, ponieważ przycisk jest teraz w flex-boxie
  E_OFFSET_X: 0,
  E_OFFSET_Y: 0,

  // Rozmiar E buttona (zgodnie ze styles.js)
  E_SIZE: 40,
  E_FONT_SIZE: 16,

  // ── Lang Switcher — Precyzyjne wyśrodkowanie wewnątrz szyny ───────────────
  LANG_OFFSET_X: 0,
  LANG_OFFSET_Y: 0,

  // ── Logo / Tagline — padding poziomy środkowej kolumny ───────────────────
  CENTER_PADDING_H: 4,

  // ── Rozmiary fontów — Optymalizacja pod luksusowy minimalizm ──────────────
  // Zmniejszamy logo, by zyskać przestrzeń na tagline w ES/DE
  LOGO_FONT_SIZE: 17.6, 
  TAGLINE_FONT_SIZE: 11,

  LOGO_FONT: 'PlayfairDisplay_700',
  TAGLINE_FONT: 'CormorantGaramond_400_Italic',
};