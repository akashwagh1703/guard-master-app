import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MapPin, Camera, Clock } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { FadeIn } from '../components/Loading';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function AttendanceDetailScreen({ navigation, route }) {
  const { record } = route.params;

  const timeline = [
    { time: record.checkIn, label: 'Checked In', done: record.checkIn !== '-' },
    { time: record.checkOut || '—', label: 'Checked Out', done: record.checkOut && record.checkOut !== '-' },
  ];

  return (
    <View style={styles.wrap}>
      <Header title="Attendance Detail" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <FadeIn>
          <Card>
            <Text style={styles.date}>{record.date}</Text>
            <Text style={styles.site}>{record.site}</Text>
            <View style={styles.badges}>
              <Badge status={record.status} />
              {record.late && <Badge status="pending" label="Late" />}
            </View>
          </Card>
        </FadeIn>

        <FadeIn delay={80}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={styles.section}>Timeline</Text>
            {timeline.map((t, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={[styles.dot, t.done && styles.dotDone]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>{t.label}</Text>
                  <Text style={styles.timelineTime}>{t.time}</Text>
                </View>
              </View>
            ))}
          </Card>
        </FadeIn>

        <FadeIn delay={160}>
          <Card style={{ marginTop: spacing.lg }}>
            <View style={styles.row}><Clock size={18} color={colors.primary} /><Text style={styles.rowText}>Working Hours: {record.hours} hrs</Text></View>
            <View style={[styles.row, { marginTop: spacing.md }]}><MapPin size={18} color={colors.success} /><Text style={styles.rowText}>Location verified</Text></View>
            <View style={[styles.photoBox, { marginTop: spacing.lg }]}>
              <Camera size={32} color={colors.textMuted} />
              <Text style={styles.photoText}>Check-in photo</Text>
            </View>
          </Card>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  date: { fontSize: 20, fontWeight: '700', color: colors.text },
  site: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  badges: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  section: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.border, marginTop: 4, marginRight: spacing.md },
  dotDone: { backgroundColor: colors.success },
  timelineContent: { flex: 1 },
  timelineLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  timelineTime: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowText: { fontSize: 14, color: colors.text },
  photoBox: { height: 120, backgroundColor: colors.borderLight, borderRadius: spacing.radiusLg, alignItems: 'center', justifyContent: 'center' },
  photoText: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
});
