import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, CheckCircle } from 'lucide-react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import fonts from '../theme/fonts';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(ring, { toValue: 1, duration: 2000, useNativeDriver: true })
    ).start();

    const t = setTimeout(onFinish, 2800);
    return () => clearTimeout(t);
  }, [onFinish, scale, opacity, slide, pulse, ring]);

  const dotOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });
  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] });

  return (
    <LinearGradient colors={colors.gradient.hero} style={styles.wrap}>
      <Animated.View style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
      <Animated.View style={[styles.logoOuter, { transform: [{ scale }], opacity }]}>
        <View style={styles.logoInner}>
          <Shield size={52} color={colors.primary} strokeWidth={1.5} />
        </View>
      </Animated.View>
      <Animated.View style={{ opacity, transform: [{ translateY: slide }] }}>
        <Text style={styles.name}>SecureGuard</Text>
        <Text style={styles.tagline}>Your Daily Duty Companion</Text>
        <View style={styles.trustRow}>
          <CheckCircle size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.trustText}>Trusted by security professionals</Text>
        </View>
      </Animated.View>
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <Animated.View key={i} style={[styles.dot, { opacity: dotOpacity, marginLeft: i > 0 ? 10 : 0 }]} />
        ))}
      </View>
      <Text style={styles.version}>Version 1.0.0</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  logoOuter: { marginBottom: spacing.xxl },
  logoInner: { width: 110, height: 110, borderRadius: 32, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 12 },
  name: { fontFamily: fonts.bold, fontSize: 32, color: '#FFF', textAlign: 'center', letterSpacing: 0.5 },
  tagline: { fontFamily: fonts.medium, fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 8 },
  trustRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.lg },
  trustText: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  dots: { flexDirection: 'row', marginTop: spacing.xxxl + 20 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF' },
  version: { position: 'absolute', bottom: 48, fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.5)' },
});
