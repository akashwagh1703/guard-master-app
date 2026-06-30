import React, { useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

const COLS = 3;
const GRID_GAP = 8;

export default function ActionTile({ icon: Icon, label, color, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();
  const horizontalPad = spacing.lg * 2;
  const tileWidth = (width - horizontalPad - GRID_GAP * (COLS - 1)) / COLS;

  return (
    <Animated.View style={{ width: tileWidth, transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={[styles.tile, shadows.sm]}
      >
        <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
          <Icon size={22} color={color} strokeWidth={2} />
        </View>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    paddingVertical: spacing.md,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 82,
    justifyContent: 'center',
  },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  label: { fontFamily: fonts.semibold, fontSize: 12, color: colors.text, textAlign: 'center' },
});
