import { StyleSheet, Platform } from 'react-native';
import { theme } from './theme';

export const styles = StyleSheet.create({
  langToggleBtn: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },

  langDropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: theme.colors.surface, // Wykorzystuje zaktualizowany klucz z theme.js
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 6,
    minWidth: 60,
    zIndex: 2000,
    // Dodano cienie dla efektu głębi (Premium feel)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },

  appRoot: {
    flex: 1
  },

  // MAIN LAYOUT
  mainContent: {
    flex: 1,
    paddingTop: 72
  },

  // ─── HEADER ───────────────────────────────────────────────────────────────
  appHeader: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  // Lewa "szyna" — stała szerokość, restart button
  headerLeft: {
    width: 72,
    alignItems: 'flex-start',
    paddingLeft: 12,
  },

  // Elastyczny środek — logo + tagline zawsze wycentrowane
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    overflow: 'hidden',
  },

  // Prawa "szyna" — stała szerokość, lang switcher
  // ⚠️ headerLeft.width === headerRight.width → matematyczny środek
  headerRight: {
    width: 72,
    alignItems: 'flex-end',
    paddingRight: 12,
  },

  headerLogoText: {
    fontFamily: 'PlayfairDisplay_700',
    fontSize: 17.6,
    letterSpacing: 0.3 * 16,
    color: theme.colors.gold,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  headerDot: {
    width: 4, height: 4,
    backgroundColor: theme.colors.gold,
    borderRadius: 2,
    marginHorizontal: 6,
    opacity: 0.7
  },

  headerTagline: {
    fontFamily: 'CormorantGaramond_400_Italic',
    fontSize: 11,
    letterSpacing: 0.2 * 8.8,
    color: theme.colors.textDim,
    textAlign: 'center',
    marginTop: 2,
  },

  // ─── LANG SWITCHER ────────────────────────────────────────────────────────
  langSwitcher: {
    flexDirection: 'row',
    gap: 2,
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 28,
    padding: 0,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  langBtn: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    minHeight: 36,
    justifyContent: 'flex-start'
  },

  langBtnText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 12.8,
    letterSpacing: 0.08 * 12.8,
    color: theme.colors.textMuted
  },

  langBtnTextActive: {
    color: theme.colors.gold
  },

  langBtnActive: {
    backgroundColor: theme.colors.goldDim
  },

  // ─── DEV BTN ──────────────────────────────────────────────────────────────
  devBtn: {
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    borderRadius: theme.radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 10
  },

  devBtnFloating: {
    position: 'absolute',
    top: 78,
    left: 14,
    zIndex: 1100,
    elevation: 20
  },

  devBtnText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 11.2,
    letterSpacing: 0.1 * 11.2,
    color: theme.colors.gold
  },

  // ─── RESTART BTN ──────────────────────────────────────────────────────────
  restartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
// Usuń całkowicie restartBtnFloating lub wyczyść jego właściwości

  restartBtnFloating: {
  position: 'absolute',
  right: 325,
  top: 120,
  zIndex: 9999,
  elevation: 20,
},

  restartBtnText: {
    fontFamily: 'PlayfairDisplay_700',
    fontSize: 18,
    lineHeight: 18,
    textAlign: 'center',
    includeFontPadding: false,
    color: theme.colors.text,
    transform: [
      { translateX: 0 },
      { translateY: -2 },
    ],
  },

  // ─── E BUTTON (splash) ────────────────────────────────────────────────────
  eBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  eBtnText: {
    fontFamily: 'PlayfairDisplay_700',
    lineHeight: 18,
    textAlign: 'center',
    includeFontPadding: false,
    color: theme.colors.gold,
  },

  // ─── HERO ─────────────────────────────────────────────────────────────────
  hero: {
    minHeight: '100%',
    paddingHorizontal: 16,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },

  
    // ─── HERO ORNAMENT (RING + E) ───────────────────────────────────────────
  heroOrnamentRingWrap: {
  position: 'absolute',
  top: 110,
  left: 0,
  right: 0,
  alignItems: 'center',
  zIndex: 999,
  elevation: 50,
},

  heroOrnamentRingOuter: {
  width: 48,
  height: 48,
  borderRadius: 24,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
},

  // "dziura" (środek przezroczysty)
  heroOrnamentRingInner: {
  position: 'absolute',
  backgroundColor: theme.colors.bg,

},

  heroOrnamentRingE: {
    fontFamily: 'PlayfairDisplay_400',
    fontSize: 24,
    lineHeight: 24,
    color: '#ffffff',
    textAlign: 'center',
    includeFontPadding: false,

    // miękki błysk litery
    textShadowColor: 'rgba(255,255,255,0.85)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 9,
  },
  heroOrnamentRingBox: {
  width: 48,
  height: 48,
},

  heroTagline: {
    fontFamily: 'CormorantGaramond_400_Italic',
    fontSize: 11.2,
    letterSpacing: 0.25 * 11.2,
    color: theme.colors.gold,
    textTransform: 'uppercase',
    marginBottom: 12,
    opacity: 0.85,
    textAlign: 'center'
  },

  heroTitle: {
    fontFamily: 'PlayfairDisplay_700',
    letterSpacing: 0.15 * 48,
    color: theme.colors.text,
    textTransform: 'uppercase',
    marginBottom: 8,
    lineHeight: 50.4,
    textAlign: 'center'
  },

  heroSubtitle: {
    fontFamily: 'CormorantGaramond_400_Italic',
    color: theme.colors.textMuted,
    marginBottom: 18,
    maxWidth: 480,
    textAlign: 'center'
  },

  heroDivider: {
    width: 72,
    height: 1,
    marginBottom: 18,
    opacity: 1
  },

  heroStats: {
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 22
  },

  heroStat: {
    alignItems: 'center'
  },

  heroStatNum: {
    fontFamily: 'PlayfairDisplay_400',
    fontSize: 28.8,
    color: theme.colors.gold,
    lineHeight: 28.8
  },

  heroStatLabel: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 11.52,
    letterSpacing: 0.15 * 11.52,
    textTransform: 'uppercase',
    color: theme.colors.textMuted
  },

  // ─── CTA ──────────────────────────────────────────────────────────────────
  ctaBtn: {
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 40,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: 'rgba(212,175,55,0.3)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 20
        }
      : {
          elevation: 6
        })
  },

  ctaText: {
    fontFamily: 'PlayfairDisplay_700',
    fontSize: 13.6,
    letterSpacing: 0.2 * 13.6,
    textTransform: 'uppercase',
    color: theme.colors.bg,
    textAlign: 'center'
  },

  // ─── SECTION HEADER ───────────────────────────────────────────────────────
  sectionHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center'
  },

  sectionPre: {
    fontFamily: 'CormorantGaramond_400_Italic',
    fontSize: 12,
    letterSpacing: 0.3 * 12,
    textTransform: 'uppercase',
    color: theme.colors.gold,
    opacity: 0.8,
    marginBottom: 10
  },

  sectionTitle: {
    fontFamily: 'PlayfairDisplay_400',
    marginBottom: 12,
    textAlign: 'center',
    color: theme.colors.gold
  },

  sectionDesc: {
    fontFamily: 'CormorantGaramond_400_Italic',
    color: theme.colors.textMuted,
    fontSize: 16,
    maxWidth: 500,
    textAlign: 'center'
  },

  // ─── MODULES GRID ─────────────────────────────────────────────────────────
  modulesGrid: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    maxWidth: 1100,
    alignSelf: 'center',
    gap: 16
  },

  moduleCard: {
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: 24,
    position: 'relative',
    overflow: 'hidden'
  },

  moduleCardTopLine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    opacity: 0
  },

  moduleCardCompleted: {
    borderColor: 'rgba(76,175,128,0.4)'
  },

  moduleIcon: {
    fontSize: 28.8,
    marginBottom: 12
  },

  moduleNum: {
    fontFamily: 'PlayfairDisplay_400',
    fontSize: 10.4,
    letterSpacing: 0.2 * 10.4,
    textTransform: 'uppercase',
    color: theme.colors.gold,
    opacity: 0.7,
    marginBottom: 4
  },

  moduleName: {
    fontFamily: 'PlayfairDisplay_600',
    fontSize: 18.4,
    marginBottom: 8,
    color: theme.colors.text
  },

  moduleDesc: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 14.08,
    color: theme.colors.textMuted,
    lineHeight: 22.528,
    marginBottom: 16
  },

  moduleProgressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 1,
    marginBottom: 10,
    overflow: 'hidden'
  },

  moduleProgressFill: {
    height: '100%',
    borderRadius: 1
  },

  moduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  moduleStatusText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 12,
    color: theme.colors.textDim,
    letterSpacing: 0.05 * 12
  },

  moduleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20
  },

  moduleBadgeText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 10.4,
    letterSpacing: 0.08 * 10.4,
    textTransform: 'uppercase',
    fontWeight: '600'
  },

  badgePending: { backgroundColor: 'rgba(255,255,255,0.06)' },
  badgePendingText: { color: theme.colors.textDim },

  badgePassed: { backgroundColor: 'rgba(76,175,128,0.15)' },
  badgePassedText: { color: theme.colors.success },

  badgeFailed: { backgroundColor: 'rgba(224,82,82,0.15)' },
  badgeFailedText: { color: theme.colors.danger },

  // ─── MODULE VIEW ──────────────────────────────────────────────────────────
  moduleView: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 140,
    maxWidth: 800,
    alignSelf: 'center'
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // KLUCZOWA ZMIANA: przycisk zajmuje tylko tyle miejsca, ile ma treści
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0)',
    borderRadius: theme.radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 28,
    minWidth: 80, // Gwarantuje minimalną wygodną strefę kliknięcia
    justifyContent: 'center'
  },

  backBtnText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 13.6,
    letterSpacing: 0.1 * 13.6,
    color: theme.colors.textMuted
  },

  moduleHeader: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },

  moduleHeaderIcon: {
    fontSize: 40,
    marginBottom: 12
  },

  moduleHeaderTitle: {
    fontFamily: 'PlayfairDisplay_400',
    marginBottom: 8,
    color: theme.colors.gold
  },

  moduleHeaderSubtitle: {
    fontFamily: 'CormorantGaramond_400_Italic',
    color: theme.colors.textMuted,
    fontSize: 20
  },

  modeToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    marginBottom: 32
  },

  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    alignItems: 'center'
  },

  modeBtnLast: {
    borderRightWidth: 0
  },

  modeBtnActive: {
    backgroundColor: theme.colors.goldDim
  },

  modeBtnText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 14.4,
    letterSpacing: 0.1 * 14.4,
    color: theme.colors.textMuted
  },

  modeBtnTextActive: {
    color: theme.colors.gold
  },

  // ─── TOPICS ───────────────────────────────────────────────────────────────
  topicsList: {
    gap: 16
  },

  topicCard: {
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    overflow: 'hidden'
  },

  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 20
  },

  topicNum: {
    fontFamily: 'PlayfairDisplay_400',
    fontSize: 19.2,
    color: theme.colors.gold,
    opacity: 0.6,
    width: 28,
    fontStyle: 'italic'
  },

  topicTitle: {
    fontFamily: 'PlayfairDisplay_600',
    fontSize: 16,
    flex: 1
  },

  topicChevron: {
    color: theme.colors.textDim
  },

  topicBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },

  topicContent: {
    paddingTop: 16
  },

  topicContentText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 15.2,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 27.36
  },

  topicRuleRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginTop: 6
  },

  topicRuleDiamond: {
    color: theme.colors.gold,
    opacity: 0.6,
    fontSize: 8,
    marginTop: 6
  },

  topicRuleText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 14.08,
    color: theme.colors.text
  },

  // ─── QUIZ ─────────────────────────────────────────────────────────────────
  quizProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28
  },

  quizTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden'
  },

  quizFill: {
    height: '100%'
  },

  quizProgressLabel: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 12.48,
    color: theme.colors.textMuted,
    letterSpacing: 0.05 * 12.48
  },

  questionCard: {
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: 28,
    marginBottom: 16
  },

  questionNum: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 12,
    letterSpacing: 0.2 * 12,
    textTransform: 'uppercase',
    color: theme.colors.gold,
    opacity: 0.7,
    marginBottom: 10
  },

  questionText: {
    fontFamily: 'PlayfairDisplay_400',
    fontSize: 17.6,
    lineHeight: 26.4,
    marginBottom: 24
  },

  optionsList: {
    gap: 10
  },

  optionBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 16
  },

  optionText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 15.2,
    lineHeight: 22.8,
    color: theme.colors.text,
    flex: 1
  },

  optionLetter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1
  },

  optionLetterText: {
    fontFamily: 'PlayfairDisplay_600',
    fontSize: 11.52,
    color: theme.colors.gold,
    fontWeight: '600'
  },

  optionSelected: {
    borderColor: theme.colors.gold,
    backgroundColor: theme.colors.goldDim
  },

  optionCorrect: {
    borderColor: theme.colors.success,
    backgroundColor: 'rgba(76,175,128,0.12)'
  },

  optionCorrectText: {
    color: theme.colors.success
  },

  optionWrong: {
    borderColor: theme.colors.danger,
    backgroundColor: 'rgba(224,82,82,0.12)'
  },

  optionWrongText: {
    color: theme.colors.danger
  },

  quizNav: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20
  },

  btnPrimary: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },

  btnPrimaryText: {
    fontFamily: 'PlayfairDisplay_700',
    fontSize: 13.12,
    letterSpacing: 0.15 * 13.12,
    textTransform: 'uppercase',
    color: theme.colors.bg
  },

  btnSecondary: {
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 20
  },

  btnSecondaryText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 13.6,
    color: theme.colors.textMuted
  },

  // ─── RESULT ───────────────────────────────────────────────────────────────
  resultCard: {
    backgroundColor: theme.colors.bg2,
    borderRadius: theme.radius.lg,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border
  },

  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },

  scoreCirclePass: {
    borderWidth: 2,
    borderColor: theme.colors.success,
    ...(Platform.OS === 'ios'
      ? { shadowColor: 'rgba(76,175,128,0.2)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30 }
      : { elevation: 6 })
  },

  scoreCircleFail: {
    borderWidth: 2,
    borderColor: theme.colors.danger,
    ...(Platform.OS === 'ios'
      ? { shadowColor: 'rgba(224,82,82,0.15)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30 }
      : { elevation: 6 })
  },

  resultPercent: {
    fontFamily: 'PlayfairDisplay_400',
    fontSize: 32,
    lineHeight: 32
  },

  resultPctLabel: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 10.4,
    letterSpacing: 0.15 * 10.4,
    textTransform: 'uppercase',
    opacity: 0.7
  },

  resultTitle: {
    fontFamily: 'PlayfairDisplay_400',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center'
  },

  resultMsg: {
    fontFamily: 'CormorantGaramond_400_Italic',
    color: theme.colors.textMuted,
    fontSize: 15.2,
    marginBottom: 28,
    textAlign: 'center'
  },

  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.gold,
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginBottom: 28
  },

  certBadgeText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 13.6,
    letterSpacing: 0.1 * 13.6,
    color: theme.colors.gold
  },

  // ─── CERTS ────────────────────────────────────────────────────────────────
  certsSection: {
    paddingHorizontal: 20,
    paddingBottom: 140,
    maxWidth: 800,
    alignSelf: 'center'
  },

  certCard: {
    borderWidth: 1,
    borderColor: theme.colors.gold,
    borderRadius: theme.radius.lg,
    padding: 32,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center'
  },

  certIconLg: { fontSize: 32, marginBottom: 12 },

  certModuleName: {
    fontFamily: 'PlayfairDisplay_400',
    fontSize: 20.8,
    color: theme.colors.gold,
    marginBottom: 6,
    textAlign: 'center'
  },

  certDate: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 12.8,
    color: theme.colors.textDim,
    letterSpacing: 0.1 * 12.8
  },

  certScoreDisplay: {
    marginTop: 14,
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(76,175,128,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,128,0.3)',
    borderRadius: 20
  },

  certScoreText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 12.8,
    color: theme.colors.success,
    letterSpacing: 0.1 * 12.8
  },

  noCerts: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center'
  },

  noCertsIcon: { fontSize: 48, opacity: 0.3, marginBottom: 16 },

  noCertsText: {
    fontFamily: 'CormorantGaramond_400_Italic',
    color: theme.colors.textMuted,
    fontSize: 16.8,
    textAlign: 'center'
  },

  // ─── TOAST ────────────────────────────────────────────────────────────────
  toastWrapper: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2000,
    pointerEvents: 'none'
  },

  toast: {
    backgroundColor: theme.colors.bg2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...(Platform.OS === 'ios'
      ? { shadowColor: 'rgba(0,0,0,0.5)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 32 }
      : { elevation: 10 })
  },

  toastText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 14.4,
    color: theme.colors.text
  },

  toastSuccess: { borderColor: theme.colors.success },
  toastError: { borderColor: theme.colors.danger },

  // ─── MSC PANEL ────────────────────────────────────────────────────────────
    mscPanel: {
    position: 'absolute',
    bottom: 0, // Panel pozycjonujemy względem dołu, ale przesunięcie damy w mscBody
    right: 20,
    zIndex: 3000,
    elevation: 50
  },

  mscToggle: {
    width: 48, // Lekko zwiększony dla lepszej ergonomii
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.bg3, // Ciemniejszy, głębszy przycisk
    borderWidth: 1.5,
    borderColor: theme.colors.gold, // Wyraźniejsze złoto w stanie zamkniętym
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'ios'
      ? { shadowColor: theme.colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }
      : { elevation: 12 })
  },

  mscToggleText: {
  fontSize: 30,
  lineHeight: 30,
  textAlign: 'center',
  includeFontPadding: false,
  textAlignVertical: 'center',
  color: theme.colors.gold,
},

    mscBody: {
    position: 'absolute',
    bottom: 64, // Większy odstęp od przycisku
    right: 0,
    width: 260, // Nieco szerszy dla oddechu tekstu
    backgroundColor: theme.colors.bg3, // ROZJAŚNIONE TŁO PANELU dla czytelności
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)', // Mocniejsze złote obramowanie
    borderRadius: theme.radius.lg,
    padding: 18,
    zIndex: 3001,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.6, shadowRadius: 24 }
      : { elevation: 55 })
  },

  mscTitle: {
    fontFamily: 'PlayfairDisplay_700', // Pogrubiony tytuł
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: theme.colors.gold,
    marginBottom: 16,
    textAlign: 'center'
  },

  mscTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    marginBottom: 4,
    backgroundColor: 'rgba(255,255,255,0.02)', // Subtelne tło dla każdego wiersza
  },

  mscTrackText: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 14, // Powiększony font
    color: 'rgba(255,255,255,0.85)', // DUŻO WYŻSZY KONTRAST TEKSTU
    flex: 1
  },

  mscTrackPlaying: {
    backgroundColor: theme.colors.goldDim,
    borderColor: 'rgba(212,175,55,0.3)',
    borderWidth: 0.5,
  },

  mscTrackPlayingText: {
    color: theme.colors.gold,
    fontFamily: 'CormorantGaramond_500', // Średni akcent dla grającego utworu
  },

  mscControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)'
  },

  mscMute: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)'
  },

  mscMuteText: {
    fontSize: 14,
    color: theme.colors.textMuted
  },

  // ─── BOTTOM NAV ───────────────────────────────────────────────────────────
  bottomNav: {
    position: 'absolute',
    left: 0, right: 0,
    bottom: 0,
    zIndex: 800,
    backgroundColor: theme.colors.bg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 10
  },

  navItem: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: theme.radius.sm,
    minWidth: 60
  },

  navIcon: {
    fontSize: 18.4
  },

  navLabel: {
    fontFamily: 'CormorantGaramond_400',
    fontSize: 9.92,
    letterSpacing: 0.1 * 9.92,
    textTransform: 'uppercase'
  }
});
