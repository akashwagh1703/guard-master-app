import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MapPin, Camera, ShieldCheck, AlertCircle } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import { getDistanceMeters } from '../utils/validation';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function CheckInScreen({ navigation }) {
  const { assignment, duty, checkIn } = useApp();
  const [step, setStep] = useState(1);
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const distance = getDistanceMeters(duty.lat, duty.lng, assignment.siteLat, assignment.siteLng);
  const insideRadius = distance <= assignment.radius;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const verifyGPS = () => {
    if (!insideRadius) {
      setError(`You are ${Math.round(distance)}m away. Must be within ${assignment.radius}m of site.`);
      return;
    }
    setError(null);
    setStep(2);
  };

  const takeSelfie = () => {
    setSelfieTaken(true);
    setStep(3);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await checkIn(duty.lat, duty.lng);
      setLoading(false);
      navigation.replace('CheckInSuccess', { time: timeStr });
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Check-in failed');
    }
  };

  return (
    <View style={styles.wrap}>
      <Header title="Start Duty" subtitle="Step by step — easy!" onBack={() => navigation.goBack()} gradient />
      <ScrollView contentContainerStyle={styles.content}>
        <FadeIn>
          <View style={styles.steps}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={[styles.stepDot, step >= s && styles.stepActive]} />
            ))}
          </View>
        </FadeIn>

        {step === 1 && (
          <FadeIn>
            <Card style={styles.card}>
              <View style={styles.iconHeader}>
                <MapPin size={32} color={insideRadius ? colors.success : colors.danger} />
                <Text style={styles.cardTitle}>Verify GPS Location</Text>
              </View>
              <View style={styles.mapPlaceholder}>
                <MapPin size={40} color={colors.primary} />
                <Text style={styles.mapText}>Location Preview</Text>
                <Text style={styles.coords}>{duty.lat.toFixed(4)}, {duty.lng.toFixed(4)}</Text>
              </View>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Site</Text><Text style={styles.infoVal}>{assignment.site}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Distance</Text><Text style={[styles.infoVal, { color: insideRadius ? colors.success : colors.danger }]}>{Math.round(distance)}m / {assignment.radius}m</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Shift</Text><Text style={styles.infoVal}>{assignment.shift}</Text></View>
              {error && (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color={colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              <Button title="Verify My Location" onPress={verifyGPS} variant={insideRadius ? 'success' : 'secondary'} large style={{ marginTop: spacing.lg }} subtitle={insideRadius ? 'You are at the site ✓' : 'Move closer to site'} />
            </Card>
          </FadeIn>
        )}

        {step === 2 && (
          <FadeIn>
            <Card style={styles.card}>
              <View style={styles.iconHeader}>
                <Camera size={32} color={colors.primary} />
                <Text style={styles.cardTitle}>Capture Selfie</Text>
              </View>
              <View style={styles.cameraPlaceholder}>
                {selfieTaken ? (
                  <ShieldCheck size={48} color={colors.success} />
                ) : (
                  <>
                    <Camera size={48} color={colors.textMuted} />
                    <Text style={styles.cameraText}>Tap to capture selfie</Text>
                  </>
                )}
              </View>
              {!selfieTaken && <Button title="Take Photo" onPress={takeSelfie} large subtitle="Face the camera" />}
              {selfieTaken && <Button title="Looks Good — Continue" onPress={() => setStep(3)} large variant="success" />}
            </Card>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Confirm Check-In</Text>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Time</Text><Text style={styles.infoVal}>{timeStr}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Site</Text><Text style={styles.infoVal}>{assignment.site}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoKey}>GPS</Text><Text style={styles.infoVal}>{duty.lat.toFixed(4)}, {duty.lng.toFixed(4)}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Selfie</Text><Text style={[styles.infoVal, { color: colors.success }]}>Captured ✓</Text></View>
              <Button title="Start Duty Now" onPress={submit} loading={loading} variant="success" large subtitle="You're all set!" />
            </Card>
          </FadeIn>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  steps: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: spacing.xl },
  stepDot: { width: 32, height: 4, borderRadius: 2, backgroundColor: colors.border },
  stepActive: { backgroundColor: colors.primary },
  card: { marginBottom: spacing.lg },
  iconHeader: { alignItems: 'center', marginBottom: spacing.lg },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.sm, textAlign: 'center' },
  mapPlaceholder: { height: 160, backgroundColor: colors.primaryLight, borderRadius: spacing.radiusLg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  mapText: { fontSize: 14, color: colors.primary, fontWeight: '600', marginTop: 8 },
  coords: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  cameraPlaceholder: { height: 200, backgroundColor: colors.borderLight, borderRadius: spacing.radiusLg, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border },
  cameraText: { fontSize: 14, color: colors.textMuted, marginTop: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  infoKey: { fontSize: 14, color: colors.textSecondary },
  infoVal: { fontSize: 14, fontWeight: '600', color: colors.text },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.dangerLight, padding: spacing.md, borderRadius: spacing.radius, marginTop: spacing.md },
  errorText: { flex: 1, fontSize: 13, color: colors.danger },
});
