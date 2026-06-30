import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle } from 'lucide-react-native';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import Button from './Button';
import { FadeIn } from './Loading';
import fonts from '../theme/fonts';

export default function SuccessScreen({ title, message, details = [], buttonLabel = 'Done', onDone, icon: Icon = CheckCircle }) {
  return (
    <LinearGradient colors={[colors.background, colors.primarySoft]} style={styles.wrap}>
      <FadeIn>
        <View style={styles.iconOuter}>
          <LinearGradient colors={colors.gradient.success} style={styles.iconWrap}>
            <Icon size={52} color="#FFF" strokeWidth={1.5} />
          </LinearGradient>
        </View>
        <Text style={styles.title}>{title}</Text>
        {message && <Text style={styles.message}>{message}</Text>}
        {details.length > 0 && (
          <View style={[styles.details, shadows.sm]}>
            {details.map(([k, v]) => (
              <View key={k} style={styles.row}>
                <Text style={styles.key}>{k}</Text>
                <Text style={styles.val}>{v}</Text>
              </View>
            ))}
          </View>
        )}
        <Button title={buttonLabel} onPress={onDone} large variant="primary" style={styles.btn} />
      </FadeIn>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  iconOuter: { marginBottom: spacing.xl },
  iconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', ...shadows.lg },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.text, textAlign: 'center' },
  message: { fontFamily: fonts.regular, fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 24, paddingHorizontal: spacing.lg },
  details: { width: '100%', backgroundColor: colors.card, borderRadius: spacing.radiusLg, padding: spacing.lg, marginTop: spacing.xl, borderWidth: 1, borderColor: colors.borderLight },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  key: { fontFamily: fonts.medium, fontSize: 14, color: colors.textSecondary },
  val: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  btn: { marginTop: spacing.xxxl },
});
