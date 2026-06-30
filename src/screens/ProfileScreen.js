import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Phone, Mail, MapPin, Clock, Calendar, Shield, ChevronRight,
  Edit, Lock, LogOut, Settings, AlertTriangle,
} from 'lucide-react-native';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}><Icon size={18} color={colors.primary} /></View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuItem({ icon: Icon, label, hint, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.menuIcon, danger && { backgroundColor: colors.dangerLight }]}>
        <Icon size={20} color={danger ? colors.danger : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuLabel, danger && { color: colors.danger }]}>{label}</Text>
        {hint && <Text style={styles.menuHint}>{hint}</Text>}
      </View>
      <ChevronRight size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { guard, assignment, logout } = useApp();
  const initials = (guard?.name || 'G').split(' ').map((n) => n[0]).join('');

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={colors.gradient.hero} style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
        <FadeIn>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
          </View>
          <Text style={styles.name}>{guard?.name || ''}</Text>
          <Text style={styles.id}>ID: {guard?.employeeId || ''}</Text>
          <View style={styles.badgeWrap}><Badge status="active" label="Active Guard" large /></View>
        </FadeIn>
      </LinearGradient>

      <View style={styles.body}>
        <FadeIn delay={80}>
          <Card elevated style={styles.infoCard}>
            <Text style={styles.sectionTitle}>My Details</Text>
            <InfoRow icon={Phone} label="Mobile" value={guard?.mobile || '—'} />
            <InfoRow icon={Mail} label="Email" value={guard?.email || '—'} />
            <InfoRow icon={MapPin} label="Work Site" value={assignment?.site || '—'} />
            <InfoRow icon={Clock} label="Shift" value={`${assignment?.shift || '—'} (${assignment?.shiftStart || ''}–${assignment?.shiftEnd || ''})`} />
            <InfoRow icon={Calendar} label="Joined" value={guard?.joiningDate || '—'} />
            <InfoRow icon={AlertTriangle} label="Emergency" value={guard?.emergencyContact || '—'} />
          </Card>
        </FadeIn>

        <FadeIn delay={120}>
          <Card elevated style={[styles.menuCard, { padding: 0, overflow: 'hidden' }]}>
            <MenuItem icon={Edit} label="Edit Profile" hint="Update phone & email" onPress={() => navigation.navigate('EditProfile')} />
            <MenuItem icon={Lock} label="Change Password" hint="Keep account safe" onPress={() => navigation.navigate('ChangePassword')} />
            <MenuItem icon={Settings} label="Settings" hint="Language & alerts" onPress={() => navigation.navigate('Settings')} />
            <MenuItem icon={LogOut} label="Sign Out" hint="Leave the app" danger onPress={logout} />
          </Card>
        </FadeIn>

        <FadeIn delay={160}>
          <View style={styles.future}>
            <Shield size={16} color={colors.textMuted} />
            <Text style={styles.futureText}>Face ID · QR Patrol · SOS — Coming Soon</Text>
          </View>
        </FadeIn>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  hero: { alignItems: 'center', paddingBottom: spacing.xxxl, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  avatarRing: { padding: 4, borderRadius: 32, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', marginBottom: spacing.md },
  avatar: { width: 88, height: 88, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', ...shadows.lg },
  avatarText: { fontFamily: fonts.bold, fontSize: 32, color: colors.primary },
  name: { fontFamily: fonts.bold, fontSize: 24, color: '#FFF' },
  id: { fontFamily: fonts.medium, fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  badgeWrap: { marginTop: spacing.md },
  body: { padding: spacing.lg, marginTop: -spacing.xl },
  infoCard: { marginBottom: spacing.lg },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.text, marginBottom: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  infoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  infoContent: { flex: 1 },
  infoLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  infoValue: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text, marginTop: 3 },
  menuCard: { marginBottom: spacing.lg },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: spacing.md },
  menuIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  menuHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  future: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.65, paddingVertical: spacing.lg },
  futureText: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
});
