import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import fonts from '../theme/fonts';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.desc}>{description}</Text>}
      {action}
    </View>
  );
}

export function ErrorState({ icon, title, description, action }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, styles.errorWrap]}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.desc}>{description}</Text>}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl, flex: 1 },
  iconWrap: { width: 88, height: 88, borderRadius: 28, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  errorWrap: { backgroundColor: colors.dangerLight },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.text, textAlign: 'center' },
  desc: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 22, paddingHorizontal: spacing.lg },
});
