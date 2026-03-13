import React, { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';

import { styles } from '../styles/styles';
import { clampFont } from '../utils/responsive';
import { listModuleDefinitions, resolveModuleView } from '../domain/learning/resolver';
import { useLearningPaths } from '../state/learning/LearningPathsContext';

export default function CertsScreen({ t }) {
  const { width } = Dimensions.get('window');
  const titleSize = useMemo(() => clampFont(25.6, 5, 40), [width]);
  const { state, getProgress } = useLearningPaths();

  const earned = useMemo(() => {
    const modules = listModuleDefinitions();
    const rows = [];

    for (const trackId of state.enrolledTracks) {
      for (const module of modules) {
        const progress = getProgress(trackId, module.core.id);
        if (!progress?.passed) continue;

        const resolved = resolveModuleView(module.core.id, [trackId]);
        if (!resolved) continue;

        rows.push({
          key: `${trackId}-${module.core.id}`,
          trackId,
          moduleId: module.core.id,
          icon: module.core.icon,
          title: resolved.content.title,
          score: progress.bestScore,
          date: progress.certifiedAt || progress.lastAttemptAt || '',
        });
      }
    }

    return rows;
  }, [state.enrolledTracks, getProgress]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionPre}>{t('certs_pre')}</Text>
        <Text style={[styles.sectionTitle, { fontSize: titleSize }]}>{t('certs_title')}</Text>
        <Text style={styles.sectionDesc}>{t('certs_desc')}</Text>
      </View>

      <View style={styles.certsSection}>
        {earned.length === 0 ? (
          <View style={styles.noCerts}>
            <Text style={[styles.noCertsIcon, { color: '#ffd040' }]}>✦</Text>
            <Text style={styles.noCertsText}>{t('no_certs')}</Text>
          </View>
        ) : (
          earned.map((row) => (
            <View key={row.key} style={styles.certCard}>
              <Text style={styles.certIconLg}>{row.icon}</Text>
              <Text style={styles.certModuleName}>
                {row.title} · {row.trackId}
              </Text>
              <Text style={styles.certDate}>{row.date}</Text>
                            <View style={styles.certScoreDisplay}>
                <Text style={styles.certScoreText}>
                  {t('score_passed_label').replace('{score}', String(row.score))}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}