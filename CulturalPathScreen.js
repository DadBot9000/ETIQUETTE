import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import CulturalTrackSwitcher from '../components/CulturalTrackSwitcher';
import { useLearningPaths } from '../state/learning/LearningPathsContext';
import { theme } from '../styles/theme';

const TRACK_META = {
  PL: {
    title: 'Polska',
    family: 'Central European',
    region: 'Europa Środkowa',
    description:
      'Polska ścieżka akcentuje takt, elegancję relacyjną, szacunek do formy oraz wyważenie między serdecznością a profesjonalnym dystansem. W praktyce oznacza to większą uważność na ton wypowiedzi, kontekst społeczny i jakość pierwszego wrażenia.',
    etiquette:
      'Kluczowe są: kultura osobista, stosowność, wyczucie sytuacji oraz umiejętność łączenia uprzejmości z naturalnością.',
  },
  EN: {
    title: 'Anglo-Saxon',
    family: 'British / Anglo',
    region: 'Anglia / Wielka Brytania',
    description:
      'Profil anglosaski wzmacnia klarowność komunikacji, punktualność, dyscyplinę organizacyjną oraz wysoką wagę uprzejmości proceduralnej. Duże znaczenie mają precyzja wypowiedzi, szacunek do czasu i przewidywalność interakcji.',
    etiquette:
      'Kluczowe są: structured communication, understatement, time discipline i profesjonalna powściągliwość.',
  },
  DE: {
    title: 'Germanic / DACH',
    family: 'Germanic',
    region: 'Niemcy',
    description:
      'Ścieżka niemiecka podkreśla strukturę, porządek, przygotowanie merytoryczne oraz wysoką kulturę formalnej odpowiedzialności. Interakcje są bardziej zadaniowe, a wiarygodność buduje się przez precyzję i konsekwencję.',
    etiquette:
      'Kluczowe są: punktualność, dokładność, przejrzystość ustaleń i wysoki standard formalnego przygotowania.',
  },
  ES: {
    title: 'Hispanic',
    family: 'Iberian',
    region: 'Hiszpania / Iberyjska',
    description:
      'Profil iberyjski akcentuje relacyjność, społeczną płynność, energię kontaktu i bardziej naturalną ekspresję. W komunikacji liczy się dynamika, obecność osobista i zdolność tworzenia komfortu w relacjach.',
    etiquette:
      'Kluczowe są: otwartość, płynność rozmowy, naturalność relacji i wyczucie społecznego rytmu interakcji.',
  },
  FR: {
    title: 'French',
    family: 'Francophone',
    region: 'Francja / Frankofonia',
    description:
      'Ścieżka frankofońska wzmacnia wyrafinowanie formy, subtelność języka, estetykę prezentacji i kulturę rozmowy. Ważne są elegancja myślenia, jakość stylu i umiejętność prowadzenia interakcji z klasą.',
    etiquette:
      'Kluczowe są: precyzja języka, estetyka, forma, ton i intelektualna jakość komunikacji.',
  },
  JP: {
    title: 'Japanese',
    family: 'East Asian',
    region: 'Japonia',
    description:
      'Profil japoński opiera się na harmonii, hierarchii, szacunku i dbałości o rytuał społeczny. Komunikacja jest bardziej pośrednia, a znaczenie ma uważność na role, kontekst i zachowanie twarzy każdej ze stron.',
    etiquette:
      'Kluczowe są: harmony, hierarchy, restraint, ceremonial precision i wysoka kultura szacunku.',
  },
  SE: {
    title: 'Scandinavian',
    family: 'Nordic',
    region: 'Szwecja / Nordycka',
    description:
      'Ścieżka nordycka akcentuje prostotę, równość, przejrzystość relacji i spokojny profesjonalizm bez ostentacji. Dominuje komunikacja czysta, rzeczowa i pozbawiona nadmiarowej hierarchizacji.',
    etiquette:
      'Kluczowe są: przejrzystość, równość, prostota, spokój i brak komunikacyjnej przesady.',
  },
  BR: {
    title: 'Brazilian',
    family: 'Lusophone / Latin',
    region: 'Brazylia',
    description:
      'Profil brazylijski wzmacnia ciepło relacyjne, energię społeczną, spontaniczność i większą rolę kontaktu osobistego. Relacje bardzo często otwierają drogę do efektywnej współpracy.',
    etiquette:
      'Kluczowe są: warmth, presence, relational ease, kontaktowość i żywy styl komunikacji.',
  },
  IT: {
    title: 'Mediterranean',
    family: 'Italian / Southern European',
    region: 'Włochy',
    description:
      'Ścieżka śródziemnomorska podkreśla styl, obecność osobistą, ekspresję i wagę pierwszego wrażenia. W komunikacji istotna jest zarówno treść, jak i sposób jej podania.',
    etiquette:
      'Kluczowe są: presence, elegance, expressive communication i kultura relacji oparta na osobistej jakości kontaktu.',
  },
  AE: {
    title: 'Gulf / Emirati',
    family: 'GCC / Arab Gulf',
    region: 'ZEA / GCC',
    description:
      'Profil GCC wzmacnia znaczenie godności, gościnności, ceremonialności i uważnego zarządzania relacjami. Hierarchia i szacunek są kluczowymi elementami dobrze prowadzonej interakcji.',
    etiquette:
      'Kluczowe są: dignity, hospitality, hierarchy, ceremonial awareness i wysoka jakość relacyjna.',
  },
  US: {
    title: 'American',
    family: 'North American',
    region: 'USA',
    description:
      'Ścieżka amerykańska kładzie nacisk na skuteczność, bezpośredniość, inicjatywę, networking i praktyczność działania. Komunikacja jest często szybsza, bardziej zadaniowa i skoncentrowana na rezultacie.',
    etiquette:
      'Kluczowe są: efficiency, directness, confidence, networking i action-oriented communication.',
  },
  KR: {
    title: 'Korean',
    family: 'East Asian',
    region: 'Korea Południowa',
    description:
      'Profil koreański łączy nowoczesność z hierarchią, szybkie tempo profesjonalne z dużą wrażliwością na role społeczne i zawodowe. Komunikacja wymaga wyczucia statusu, tonu i formalności.',
    etiquette:
      'Kluczowe są: hierarchy, formality, pace, group awareness i szacunek wobec struktury relacyjnej.',
  },
};

function InfoCard({ title, body, accent = false, children }) {
  return (
    <LinearGradient
      colors={
        accent
          ? [
              'rgba(212,175,55,0.14)',
              'rgba(255,255,255,0.04)',
              'rgba(255,255,255,0.015)',
            ]
          : [
              'rgba(255,255,255,0.045)',
              'rgba(255,255,255,0.02)',
              'rgba(255,255,255,0.01)',
            ]
      }
      style={{
        borderRadius: 28,
        borderWidth: 1,
        borderColor: accent ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.08)',
        paddingHorizontal: 22,
        paddingVertical: 22,
        marginBottom: 18,
      }}
    >
      <Text
        style={{
          color: accent ? theme.colors.gold : theme.colors.text,
          fontSize: 24,
          lineHeight: 30,
          fontFamily: 'PlayfairDisplay_700',
          marginBottom: 10,
        }}
      >
        {title}
      </Text>

      {!!body && (
        <Text
          style={{
            color: 'rgba(255,255,255,0.68)',
            fontSize: 14,
            lineHeight: 22,
            marginBottom: children ? 16 : 0,
          }}
        >
          {body}
        </Text>
      )}

      {children}
    </LinearGradient>
  );
}

function MetaPill({ label, value }) {
  return (
    <View
      style={{
        minWidth: 150,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        paddingVertical: 12,
        paddingHorizontal: 14,
      }}
    >
      <Text
        style={{
          color: theme.colors.gold,
          fontSize: 16,
          fontFamily: 'PlayfairDisplay_700',
          marginBottom: 2,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: 'rgba(255,255,255,0.52)',
          fontSize: 11,
          lineHeight: 16,
          textTransform: 'uppercase',
          letterSpacing: 0.7,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function CulturalPathScreen({ navigate, t }) {
  const { state } = useLearningPaths();
  const activeTrackId = state.activeTrackOrder?.[0] || 'PL';
  const activeTrackMeta = TRACK_META[activeTrackId] || TRACK_META.PL;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 48,
        paddingBottom: 140,
        paddingHorizontal: 20,
        maxWidth: 1180,
        alignSelf: 'center',
        width: '100%',
      }}
    >
      <LinearGradient
        colors={[
          'rgba(212,175,55,0.13)',
          'rgba(255,255,255,0.04)',
          'rgba(255,255,255,0.015)',
        ]}
        style={{
          borderRadius: 32,
          borderWidth: 1,
          borderColor: 'rgba(212,175,55,0.16)',
          paddingHorizontal: 26,
          paddingVertical: 26,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: 'rgba(255,240,190,0.62)',
            fontSize: 11,
            letterSpacing: 1.8,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Cultural Perspective
        </Text>

        <Text
          style={{
            color: theme.colors.gold,
            fontSize: 40,
            lineHeight: 46,
            fontFamily: 'PlayfairDisplay_700',
            marginBottom: 12,
          }}
        >
          {t ? t('cultural_path') : 'Ścieżka kulturowa'}
        </Text>

        <Text
          style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: 16,
            lineHeight: 26,
            maxWidth: 820,
          }}
        >
          {t
            ? t('cultural_path_desc')
            : 'Wybierz aktywną perspektywę kulturową programu.'}
        </Text>
      </LinearGradient>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <MetaPill label="Kod ścieżki" value={activeTrackId} />
        <MetaPill label="Profil" value={activeTrackMeta.title} />
        <MetaPill label="Region" value={activeTrackMeta.region} />
        <MetaPill label="Rodzina kulturowa" value={activeTrackMeta.family} />
      </View>

      <InfoCard
        accent
        title={`${activeTrackId} · ${activeTrackMeta.title}`}
        body={activeTrackMeta.description}
      >
        <View
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <Text
            style={{
              color: 'rgba(255,255,255,0.48)',
              fontSize: 11,
              letterSpacing: 1.1,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {t ? t('savoir_vivre_profile') : 'Charakterystyka savoir-vivre'}
          </Text>

          <Text
            style={{
              color: 'rgba(255,255,255,0.78)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {activeTrackMeta.etiquette}
          </Text>
        </View>
      </InfoCard>

      <InfoCard
        title={t ? t('path_selection_title') : 'Wybór ścieżki'}
        body={
          t
            ? t('path_selection_desc')
            : 'Zmiana aktywnej ścieżki wpływa na kontekst modułów, ich interpretację oraz sposób prowadzenia użytkownika przez program.'
        }
      >
        <CulturalTrackSwitcher t={t} />
      </InfoCard>

      <InfoCard
                title={t ? t('programme_impact_title') : 'Wpływ na program'}
        body={
          t
            ? t('programme_impact_desc')
            : 'Ta ścieżka kulturowa synchronizuje się z programem, modułami i ekranami nauki. Po zmianie profilu aplikacja powinna prezentować właściwy kontekst edukacyjny dla danej kultury.'
        }
      />

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => navigate('BLOCKS')}
          style={{ flex: 1, minWidth: 220 }}
        >
          <LinearGradient
            colors={[theme.colors.gold, theme.colors.goldDark]}
            style={{
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(212,175,55,0.20)',
              paddingVertical: 16,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: '#1A1306',
                fontSize: 15,
                fontFamily: 'PlayfairDisplay_700',
                letterSpacing: 0.3,
              }}
            >
              {t ? t('go_to_blocks') : 'Przejdź do bloków'}
            </Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => navigate('LEARNING_CENTER')}
          style={{ flex: 1, minWidth: 220 }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
            style={{
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              paddingVertical: 16,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 15,
                fontFamily: 'PlayfairDisplay_700',
                letterSpacing: 0.3,
              }}
            >
              {t ? t('back_to_learning_center') : 'Wróć do Centrum Nauki'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );
}