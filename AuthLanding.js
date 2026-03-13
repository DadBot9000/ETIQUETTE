import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function AuthLanding({ navigate }) {
  useEffect(() => {
    navigate('auth');
  }, [navigate]);

  return <View style={s.container} />;
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});