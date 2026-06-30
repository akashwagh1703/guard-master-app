import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

export default function Header({ title, subtitle, onBack, right, gradient }) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.row, { paddingTop: insets.top + 10 }]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <ChevronLeft size={24} color={gradient ? '#FFF' : colors.text} />
        </TouchableOpacity>
      ) : <View style={styles.backPlaceholder} />}
      <View style={styles.center}>
        <Text style={[styles.title, gradient && styles.titleLight]} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, gradient && styles.subtitleLight]}>{subtitle}</Text>}
      </View>
      <View style={styles.right}>{right || <View style={styles.backPlaceholder} />}</View>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient colors={colors.gradient.hero} style={styles.gradientWrap}>
        {content}
        <View style={styles.gradientPad} />
      </LinearGradient>
    );
  }

  return <View style={[styles.wrap, shadows.sm]}>{content}</View>;
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingBottom: spacing.md, paddingHorizontal: spacing.lg },
  gradientWrap: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden' },
  gradientPad: { height: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.borderLight },
  backPlaceholder: { width: 44 },
  center: { flex: 1, alignItems: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  titleLight: { color: '#FFF' },
  subtitle: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  subtitleLight: { color: 'rgba(255,255,255,0.75)' },
  right: { width: 44, alignItems: 'flex-end' },
});
