import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, CalendarCheck } from 'lucide-react-native';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

const filters = ['This Month', 'Last Month', 'All Time'];

export default function AttendanceScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { attendance } = useApp();
  const [filter, setFilter] = useState('This Month');

  const renderItem = ({ item, index }) => (
    <FadeIn delay={index * 35}>
      <TouchableOpacity activeOpacity={0.75} style={[styles.item, shadows.sm]} onPress={() => navigation.navigate('AttendanceDetail', { record: item })}>
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{item.date.split('-')[2]}</Text>
          <Text style={styles.dateMon}>{item.date.slice(5, 7)}/{item.date.slice(2, 4)}</Text>
        </View>
        <View style={styles.itemLeft}>
          <Text style={styles.site}>{item.site}</Text>
          <Text style={styles.shift}>{item.shift} Shift</Text>
          <View style={styles.timeRow}>
            <Text style={styles.time}>In {item.checkIn}</Text>
            <Text style={styles.timeDot}>·</Text>
            <Text style={styles.time}>Out {item.checkOut || '—'}</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <Badge status={item.status} label={item.status === 'present' ? 'Present' : 'Absent'} />
          {item.late && <Badge status="pending" label="Late" />}
          <ChevronRight size={20} color={colors.textMuted} />
        </View>
      </TouchableOpacity>
    </FadeIn>
  );

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={colors.gradient.hero} style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerSub}>See your past duty records</Text>
        <View style={styles.filters}>
          {filters.map((f) => (
            <TouchableOpacity key={f} style={[styles.chip, filter === f && styles.chipActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {attendance.length === 0 ? (
        <EmptyState icon={<CalendarCheck size={36} color={colors.primary} />} title="No Records" description="Your attendance will show here after you check in" />
      ) : (
        <FlatList data={attendance} keyExtractor={(i) => String(i.id)} renderItem={renderItem} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontFamily: fonts.bold, fontSize: 26, color: '#FFF' },
  headerSub: { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: spacing.lg },
  filters: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  chipActive: { backgroundColor: '#FFF', borderColor: '#FFF' },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  chipTextActive: { color: colors.primary },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: spacing.radiusLg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight, gap: spacing.md },
  dateBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary },
  dateMon: { fontFamily: fonts.medium, fontSize: 10, color: colors.primary },
  itemLeft: { flex: 1 },
  site: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  shift: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  time: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  timeDot: { color: colors.textMuted },
  itemRight: { alignItems: 'flex-end', gap: 4 },
});
