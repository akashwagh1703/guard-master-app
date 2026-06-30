import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';
import fonts from '../theme/fonts';

export default function Input({ label, error, helper, required, style, ...props }) {
  return (
    <View style={[styles.wrap, style]}>
      {label && (
        <Text style={styles.label}>
          {label}{required && <Text style={styles.req}> *</Text>}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, error && styles.inputError, props.editable === false && styles.inputDisabled]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

export function NumericInput({ label, error, helper, required, value, onChangeText, style, ...props }) {
  return (
    <Input
      label={label}
      error={error}
      helper={helper}
      required={required}
      value={value}
      onChangeText={(t) => onChangeText?.(t.replace(/\D/g, ''))}
      keyboardType="default"
      inputMode="numeric"
      style={style}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { ...typography.label, marginBottom: 8 },
  req: { color: colors.danger },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.card,
    minHeight: spacing.touchMin,
  },
  inputError: { borderColor: colors.danger, backgroundColor: colors.dangerLight + '40' },
  inputDisabled: { backgroundColor: colors.borderLight, color: colors.textSecondary },
  error: { fontFamily: fonts.medium, fontSize: 13, color: colors.danger, marginTop: 6 },
  helper: { ...typography.caption, marginTop: 6 },
});
