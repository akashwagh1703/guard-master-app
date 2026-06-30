import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  LogIn, LogOut, Users, AlertTriangle, Calendar, Wallet, CalendarOff, User,
  MapPin, Clock, Bell, Sun,
} from 'lucide-react-native';
import Card from '../components/Card';
import Badge from '../components/Badge';
import DutyButton from '../components/DutyButton';
import ActionTile from '../components/ActionTile';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

const SECTION_GAP = 10;

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { guard, assignment, duty, unreadCount, todayVisitors, todayIncidents } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const workingTime = duty.checkedIn && duty.checkInTime
    ? (() => {
        const [h, m] = duty.checkInTime.split(':').map(Number);
        const start = new Date(); start.setHours(h, m, 0);
        const diff = Math.max(0, Math.floor((time - start) / 1000));
        const hrs = Math.floor(diff / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        const secs = diff % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      })()
    : '00:00:00';

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={colors.gradient.hero} style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.heroTop}>
          <View style={styles.heroLeft}>
            <View style={styles.greetingRow}>
              <Sun size={15} color="rgba(255,255,255,0.9)" />
              <Text style={styles.greeting}>{greeting}</Text>
            </View>
            <Text style={styles.heroName}>{guard?.name?.split(' ')[0] || 'Guard'} 👋</Text>
            <Text style={styles.heroId}>{guard?.employeeId || ''}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
            <Bell size={20} color={colors.primary} />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.clockCard}>
          <Text style={styles.clockDate}>{dateStr}</Text>
          <Text style={styles.clockTime}>{timeStr}</Text>
          <Badge
            status={duty.checkedIn ? 'active' : 'pending'}
            label={duty.checkedIn ? 'ON duty' : 'OFF duty'}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card elevated accent style={styles.compactCard}>
          <View style={styles.siteRow}>
            <View style={styles.siteIcon}><MapPin size={18} color={colors.primary} /></View>
            <View style={styles.siteInfo}>
              <Text style={styles.siteLabel}>Today's Site</Text>
              <Text style={styles.siteName} numberOfLines={1}>{assignment.site}</Text>
              <View style={styles.shiftRow}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={styles.shiftText}>{assignment.shift} · {assignment.shiftStart}–{assignment.shiftEnd}</Text>
              </View>
            </View>
            <View style={styles.gpsDotWrap}>
              <View style={[styles.gpsDot, { backgroundColor: duty.gpsStatus === 'active' ? colors.success : colors.danger }]} />
            </View>
          </View>
        </Card>

        <DutyButton
          checkedIn={duty.checkedIn}
          onPress={() => navigation.navigate(duty.checkedIn ? 'CheckOut' : 'CheckIn')}
          icon={duty.checkedIn ? LogOut : LogIn}
        />

        {duty.checkedIn && (
          <LinearGradient colors={[colors.primarySoft, colors.card]} style={styles.timerCard}>
            <Text style={styles.timerLabel}>Time on Duty</Text>
            <Text style={styles.timerValue}>{workingTime}</Text>
            <Text style={styles.timerHint}>Started {duty.checkInTime}</Text>
          </LinearGradient>
        )}

        <View style={styles.statsRow}>
          <View style={[styles.statBox, shadows.sm]}>
            <Text style={styles.statNum}>{todayVisitors}</Text>
            <Text style={styles.statLabel}>Visitors</Text>
          </View>
          <View style={[styles.statBox, shadows.sm]}>
            <Text style={[styles.statNum, { color: colors.warning }]}>{todayIncidents}</Text>
            <Text style={styles.statLabel}>Incidents</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <ActionTile icon={Users} label="Visitor" color={colors.primary} onPress={() => navigation.navigate('Visitors')} />
          <ActionTile icon={AlertTriangle} label="Report" color={colors.danger} onPress={() => navigation.navigate('ReportIncident')} />
          <ActionTile icon={Calendar} label="History" color={colors.success} onPress={() => navigation.navigate('AttendanceTab')} />
          <ActionTile icon={Wallet} label="Salary" color={colors.accent} onPress={() => navigation.navigate('SalaryTab')} />
          <ActionTile icon={CalendarOff} label="Leave" color={colors.warning} onPress={() => navigation.navigate('LeaveRequest')} />
          <ActionTile icon={User} label="Profile" color={colors.textSecondary} onPress={() => navigation.navigate('ProfileTab')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg + 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  heroLeft: { flex: 1 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  greeting: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  heroName: { fontFamily: fonts.bold, fontSize: 22, color: '#FFF' },
  heroId: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  notifBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  notifBadge: { position: 'absolute', top: -3, right: -3, backgroundColor: colors.danger, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  notifBadgeText: { fontFamily: fonts.bold, fontSize: 10, color: '#FFF' },
  clockCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: spacing.radius,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  clockDate: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  clockTime: { fontFamily: fonts.bold, fontSize: 34, color: '#FFF', marginVertical: 4, fontVariant: ['tabular-nums'] },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl, gap: SECTION_GAP },
  compactCard: { padding: spacing.md },
  siteRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  siteIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  siteInfo: { flex: 1 },
  siteLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  siteName: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, marginTop: 1 },
  shiftRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  shiftText: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  gpsDotWrap: { paddingLeft: 4 },
  gpsDot: { width: 10, height: 10, borderRadius: 5 },
  timerCard: { borderRadius: spacing.radius, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '20' },
  timerLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary },
  timerValue: { fontFamily: fonts.bold, fontSize: 32, color: colors.primary, marginVertical: 2, fontVariant: ['tabular-nums'] },
  timerHint: { fontFamily: fonts.medium, fontSize: 11, color: colors.textMuted },
  statsRow: { flexDirection: 'row', gap: SECTION_GAP },
  statBox: { flex: 1, backgroundColor: colors.card, borderRadius: spacing.radius, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight },
  statNum: { fontFamily: fonts.bold, fontSize: 22, color: colors.primary },
  statLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text, marginTop: 4 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
