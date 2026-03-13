import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, G, Text as SvgText } from 'react-native-svg';

export default function CoinMark({ size = 56 }) {
  // viewBox 100x100 dla prostego skalowania
  const s = size;

  return (
    <View style={{ width: s, height: s }}>
      <Svg width={s} height={s} viewBox="0 0 100 100">
        <Defs>
          {/* Ring metal gradient (inspirowany drawRing() z Twojego splash) */}
          <LinearGradient id="ringMetal" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#1a0c00" />
            <Stop offset="12%" stopColor="#8a5008" />
            <Stop offset="28%" stopColor="#d89018" />
            <Stop offset="44%" stopColor="#ffd040" />
            <Stop offset="50%" stopColor="#fff4a0" />
            <Stop offset="56%" stopColor="#ffd040" />
            <Stop offset="72%" stopColor="#b07010" />
            <Stop offset="88%" stopColor="#6a3a00" />
            <Stop offset="100%" stopColor="#1a0c00" />
          </LinearGradient>

          {/* Subtelny highlight (metal shine) */}
          <LinearGradient id="ringHighlight" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="rgba(255,250,185,0.85)" />
            <Stop offset="55%" stopColor="rgba(255,250,185,0.10)" />
            <Stop offset="100%" stopColor="rgba(255,250,185,0)" />
          </LinearGradient>
        </Defs>

        {/* Ring: zewnętrzny + “wycięcie” środka robimy przez dwa okręgi */}
        <G>
  {/* PRAWIDŁOWY DONUT (środek = prawdziwa przezroczystość) */}
  <Path
    d="
      M 50 50
      m -46 0
      a 46 46 0 1 0 92 0
      a 46 46 0 1 0 -92 0
      M 50 50
      m -34 0
      a 34 34 0 1 1 68 0
      a 34 34 0 1 1 -68 0
    "
    fill="url(#ringMetal)"
    fillRule="evenodd"
    clipRule="evenodd"
  />

  {/* delikatne obwódki (OK) */}
  <Circle cx="50" cy="50" r="34.5" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
  <Circle cx="50" cy="50" r="45.5" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

  {/* highlight jako łuk/stroke na obręczy (NIE dysk) */}
  <Circle
    cx="50"
    cy="50"
    r="44.8"
    fill="none"
    stroke="rgba(255,250,185,0.35)"
    strokeWidth="3"
    strokeLinecap="round"
    strokeDasharray="70 220"
    strokeDashoffset="20"
  />
</G>

        {/* Litera E */}
        <SvgText
          x="50"
          y="58"
          fontSize="46"
          fontWeight="300"
          textAnchor="middle"
          fill="#ffffff"
          opacity="0.96"
        >
          E
        </SvgText>
      </Svg>
    </View>
  );
}