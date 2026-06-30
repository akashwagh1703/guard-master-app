import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import fonts from '../theme/fonts';

const map = {
  present: { bg: colors.successLight, text: colors.successDark, dot: colors.success },
  active: { bg: colors.successLight, text: colors.successDark, dot: colors.success },
  inside: { bg: colors.primarySoft, text: colors.primary, dot: colors.primary },
  pending: { bg: colors.warningLight, text: colors.warning, dot: colors.warning },
  approved: { bg: colors.successLight, text: colors.successDark, dot: colors.success },
  rejected: { bg: colors.dangerLight, text: colors.dangerDark, dot: colors.danger },
  open: { bg: colors.dangerLight, text: colors.dangerDark, dot: colors.danger },
  resolved: { bg: colors.successLight, text: colors.successDark, dot: colors.success },
  exited: { bg: colors.borderLight, text: colors.textSecondary, dot: colors.textMuted },
  paid: { bg: colors.successLight, text: colors.successDark, dot: colors.success },
  absent: { bg: colors.dangerLight, text: colors.dangerDark, dot: colors.danger },
};

export default function Badge({ status, label, large }) {
  const s = map[status?.toLowerCase()] || map.pending;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }, large && styles.large]}>
      <View style={[styles.dot, { backgroundColor: s.dot }]} />
      <Text style={[styles.text, { color: s.text }, large && styles.textLarge]}>{label || status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  large: { paddingHorizontal: 14, paddingVertical: 8 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontFamily: fonts.semibold, fontSize: 12, textTransform: 'capitalize' },
  textLarge: { fontSize: 14 },
});
