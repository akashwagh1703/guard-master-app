import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff, Fingerprint, Lock } from 'lucide-react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import typography from '../theme/typography';
import fonts from '../theme/fonts';

const logoBrand = require('../../assets/logo-brand.png');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  const [username, setUsername] = useState('ramesh.s');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loginHandler = async () => {
    const errs = {};
    if (!username.trim()) errs.username = 'Please enter your username';
    if (!password.trim()) errs.password = 'Please enter your password';
    if (password.length > 0 && password.length < 4) errs.password = 'Password is too short';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setErrors({ username: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={colors.gradient.hero} style={[styles.header, { paddingTop: insets.top + spacing.xxxl }]}>
        <FadeIn>
          <View style={styles.logoWrap}>
            <Image source={logoBrand} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={styles.tagline}>Guard Duty App</Text>
        </FadeIn>
      </LinearGradient>

      <KeyboardAvoidingView style={styles.formWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <FadeIn delay={100}>
            <View style={[styles.formCard, shadows.md]}>
              <Text style={styles.formTitle}>Sign In</Text>
              <Text style={styles.formHint}>Use your company username and password</Text>

              <Input label="Username" placeholder="e.g. ramesh.s" value={username} onChangeText={setUsername} error={errors.username} autoCapitalize="none" helper="Given by your supervisor" />
              <View>
                <Input label="Password" placeholder="Enter password" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry={!showPass} />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                  {showPass ? <EyeOff size={22} color={colors.textMuted} /> : <Eye size={22} color={colors.textMuted} />}
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <TouchableOpacity style={styles.checkRow} onPress={() => setRemember(!remember)}>
                  <View style={[styles.checkbox, remember && styles.checked]}>
                    {remember && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.checkLabel}>Keep me signed in</Text>
                </TouchableOpacity>
                <TouchableOpacity><Text style={styles.forgot}>Forgot?</Text></TouchableOpacity>
              </View>

              <Button title="Sign In" subtitle="Tap to start your duty" onPress={loginHandler} loading={loading} large icon={<Lock size={20} color="#FFF" />} />

              <View style={styles.bioRow}>
                <Fingerprint size={18} color={colors.textMuted} />
                <Text style={styles.bioText}>Fingerprint login coming soon</Text>
              </View>
            </View>
          </FadeIn>

          <Text style={styles.version}>GuardMaster · Version 1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingBottom: spacing.xxxl + 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  logoWrap: { width: 260, height: 120, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, paddingHorizontal: spacing.md, ...shadows.lg },
  logoImage: { width: '100%', height: '100%' },
  brand: { fontFamily: fonts.bold, fontSize: 28, color: '#FFF', letterSpacing: 0.5 },
  tagline: { fontFamily: fonts.medium, fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  formWrap: { flex: 1, marginTop: -spacing.xxxl },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  formCard: { backgroundColor: colors.card, borderRadius: spacing.radiusXl, padding: spacing.xl, borderWidth: 1, borderColor: colors.borderLight },
  formTitle: { ...typography.h2, marginBottom: 4 },
  formHint: { ...typography.bodySm, marginBottom: spacing.xl },
  eyeBtn: { position: 'absolute', right: 16, top: 42, padding: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.sm },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  checkLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.textSecondary },
  forgot: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  bioRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: spacing.xl, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
  bioText: { ...typography.caption },
  version: { textAlign: 'center', ...typography.caption, marginTop: spacing.xxl },
});
