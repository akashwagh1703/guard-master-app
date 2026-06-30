import React, { useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

export default function DutyButton({ checkedIn, onPress, icon: Icon }) {
  const scale = useRef(new Animated.Value(1)).current;
  const gradient = checkedIn ? colors.gradient.danger : colors.gradient.success;

  return (
    <Animated.View style={[styles.wrap, shadows.md, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      >
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
          <View style={styles.iconCircle}>
            <Icon size={26} color={checkedIn ? colors.danger : colors.success} strokeWidth={2.5} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{checkedIn ? 'End Duty' : 'Start Duty'}</Text>
            <Text style={styles.subtitle}>{checkedIn ? 'Tap to check out' : 'Tap to check in'}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: spacing.radiusLg },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radiusLg,
    gap: spacing.md,
  },
  iconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  textBlock: { flex: 1 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: '#FFF' },
  subtitle: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});
