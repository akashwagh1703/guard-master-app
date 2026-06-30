import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MapPin, Camera, Clock } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function CheckOutScreen({ navigation }) {
  const { assignment, duty, checkOut } = useApp();
  const [selfie, setSelfie] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const calcHours = () => {
    if (!duty.checkInTime) return '8.2';
    const [h, m] = duty.checkInTime.split(':').map(Number);
    const now = new Date();
    const diff = (now.getHours() * 60 + now.getMinutes()) - (h * 60 + m);
    return (diff / 60).toFixed(1);
  };

  const hours = calcHours();
  const overtime = Math.max(0, parseFloat(hours) - 8).toFixed(1);

  const confirm = async () => {
    setLoading(true);
    try {
      await checkOut(duty.lat, duty.lng);
      setLoading(false);
      navigation.replace('CheckOutSuccess', { hours, overtime, time: timeStr });
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Header title="Check Out" subtitle="End your duty" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <FadeIn>
          <Card>
            <View style={styles.iconRow}>
              <Clock size={28} color={colors.primary} />
              <Text style={styles.title}>Confirm Check-Out</Text>
            </View>
            <View style={styles.infoRow}><Text style={styles.key}>Check-In Time</Text><Text style={styles.val}>{duty.checkInTime || '05:55'}</Text></View>
            <View style={styles.infoRow}><Text style={styles.key}>Check-Out Time</Text><Text style={styles.val}>{timeStr}</Text></View>
            <View style={styles.infoRow}><Text style={styles.key}>Working Hours</Text><Text style={[styles.val, { color: colors.primary }]}>{hours} hrs</Text></View>
            <View style={styles.infoRow}><Text style={styles.key}>Overtime</Text><Text style={[styles.val, { color: colors.warning }]}>{overtime} hrs</Text></View>
          </Card>
        </FadeIn>

        <FadeIn delay={100}>
          <Card style={{ marginTop: spacing.lg }}>
            <View style={styles.gpsRow}>
              <MapPin size={20} color={colors.success} />
              <Text style={styles.gpsText}>GPS captured · {duty.lat.toFixed(4)}, {duty.lng.toFixed(4)}</Text>
            </View>
            <View style={styles.cameraBox}>
              {selfie ? (
                <Text style={styles.selfieDone}>Selfie captured ✓</Text>
              ) : (
                <>
                  <Camera size={32} color={colors.textMuted} />
                  <Text style={styles.optional}>Optional selfie verification</Text>
                  <Button title="Take Selfie" variant="secondary" onPress={() => setSelfie(true)} style={{ marginTop: spacing.md }} />
                </>
              )}
            </View>
            <Button title="Confirm Check-Out" variant="danger" onPress={confirm} loading={loading} large style={{ marginTop: spacing.lg }} />
          </Card>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.lg },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  key: { fontSize: 14, color: colors.textSecondary },
  val: { fontSize: 14, fontWeight: '600', color: colors.text },
  gpsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.lg },
  gpsText: { fontSize: 13, color: colors.textSecondary },
  cameraBox: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.borderLight, borderRadius: spacing.radiusLg },
  optional: { fontSize: 13, color: colors.textMuted, marginTop: 8 },
  selfieDone: { fontSize: 15, color: colors.success, fontWeight: '600' },
});
