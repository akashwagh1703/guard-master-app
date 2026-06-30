import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function GradientBox({ colors: gradientColors, style, children, start = { x: 0, y: 0 }, end = { x: 1, y: 1 } }) {
  return (
    <LinearGradient colors={gradientColors || colors.gradient.hero} start={start} end={end} style={[styles.box, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: spacing.radiusXl, overflow: 'hidden' },
});
