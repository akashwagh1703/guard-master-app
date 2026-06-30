import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View, Animated } from 'react-native';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import typography from '../theme/typography';

const variants = {
  primary: { bg: colors.primary, text: colors.textOnPrimary, border: colors.primary, shadow: shadows.lg },
  success: { bg: colors.success, text: colors.textOnPrimary, border: colors.success, shadow: shadows.lg },
  danger: { bg: colors.danger, text: colors.textOnPrimary, border: colors.danger, shadow: shadows.lg },
  secondary: { bg: colors.card, text: colors.text, border: colors.border, shadow: shadows.sm },
  outline: { bg: colors.primarySoft, text: colors.primary, border: colors.primary + '40', shadow: shadows.sm },
  ghost: { bg: 'transparent', text: colors.primary, border: 'transparent', shadow: {} },
};

export default function Button({ title, subtitle, onPress, variant = 'primary', loading, disabled, icon, style, textStyle, large, fullWidth = true }) {
  const v = variants[variant] || variants.primary;
  const scale = React.useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 8 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }], width: fullWidth ? '100%' : undefined }, v.shadow, style]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        style={[styles.btn, { backgroundColor: v.bg, borderColor: v.border, minHeight: large ? spacing.touchLarge : spacing.touchMin, opacity: disabled ? 0.55 : 1 }]}
      >
        {loading ? <ActivityIndicator color={v.text} size="small" /> : (
          <View style={styles.row}>
            {icon}
            <View style={styles.textWrap}>
              <Text style={[styles.text, typography.button, { color: v.text }, textStyle]}>{title}</Text>
              {subtitle && <Text style={[styles.subtitle, { color: v.text + 'CC' }]}>{subtitle}</Text>}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export function IconButton({ icon, onPress, style, size = 48, variant = 'light' }) {
  const bg = variant === 'primary' ? colors.primaryLight : colors.card;
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={[styles.iconBtn, shadows.sm, { width: size, height: size, backgroundColor: bg }, style]}>
      {icon}
    </TouchableOpacity>
  );
}

export function FAB({ icon, onPress, label, style }) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={[styles.fab, shadows.fab, style]}>
      {icon}
      {label && <Text style={styles.fabLabel}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: spacing.radiusLg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, borderWidth: 1.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textWrap: { alignItems: 'flex-start' },
  text: { textAlign: 'center' },
  subtitle: { fontSize: 12, marginTop: 2, opacity: 0.85 },
  iconBtn: { borderRadius: spacing.radius, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  fab: {
    position: 'absolute', bottom: 28, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 16, borderRadius: spacing.radiusFull,
    backgroundColor: colors.primary,
  },
  fabLabel: { ...typography.buttonSm, color: colors.textOnPrimary },
});
