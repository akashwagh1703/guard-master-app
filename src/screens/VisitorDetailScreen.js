import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Camera, LogOut } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function VisitorDetailScreen({ navigation, route }) {
  const { markVisitorExit } = useApp();
  const visitor = route.params.visitor;
  const [loading, setLoading] = useState(false);

  const handleExit = async () => {
    setLoading(true);
    try {
      await markVisitorExit(visitor.id);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Exit failed', err.message || 'Could not mark visitor exit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Header title="Visitor Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <FadeIn>
          <Card style={styles.profileCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{visitor.name[0]}</Text></View>
            <Text style={styles.name}>{visitor.name}</Text>
            <Badge status={visitor.status} />
          </Card>
        </FadeIn>

        <FadeIn delay={80}>
          <Card style={{ marginTop: spacing.lg }}>
            {[['Purpose', visitor.purpose], ['Person To Meet', visitor.personToMeet], ['Mobile', visitor.mobile], ['Entry Time', visitor.entryTime], ['Exit Time', visitor.exitTime || 'Still inside'], ['Vehicle', visitor.vehicle || '—'], ['ID', `${visitor.idType}: ${visitor.idNumber}`], ['Remarks', visitor.remarks || '—']].map(([k, v]) => (
              <View key={k} style={styles.row}>
                <Text style={styles.key}>{k}</Text>
                <Text style={styles.val}>{v}</Text>
              </View>
            ))}
            <View style={styles.photoBox}>
              <Camera size={28} color={colors.textMuted} />
              <Text style={styles.photoText}>Visitor photo</Text>
            </View>
          </Card>
        </FadeIn>

        {visitor.status === 'inside' && (
          <FadeIn delay={160}>
            <Button title="Mark Exit" variant="danger" loading={loading} onPress={handleExit} large icon={<LogOut size={20} color="#FFF" />} style={{ marginTop: spacing.xl }} />
          </FadeIn>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  profileCard: { alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatarText: { fontSize: 28, fontWeight: '700', color: colors.primary },
  name: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  key: { fontSize: 13, color: colors.textSecondary, flex: 1 },
  val: { fontSize: 13, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right' },
  photoBox: { height: 100, backgroundColor: colors.borderLight, borderRadius: spacing.radiusLg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  photoText: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
