import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';

export default function Card({ children, style, noPadding, elevated, accent }) {
  return (
    <View style={[
      styles.card,
      shadows[elevated ? 'md' : 'sm'],
      accent && styles.accent,
      !noPadding && styles.padding,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  accent: { borderColor: colors.primary + '25' },
  padding: { padding: spacing.lg },
});
