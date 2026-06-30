import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { CalendarOff } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import { validators, validateForm } from '../utils/validation';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

const leaveTypes = ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Annual Leave'];

export default function LeaveScreen({ navigation }) {
  const { leaveRequests, addLeave } = useApp();
  const [tab, setTab] = useState('apply');
  const [form, setForm] = useState({ from: '', to: '', type: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const rules = {
      from: [validators.required],
      to: [validators.required],
      type: [validators.required],
      reason: [(v) => validators.required(v), (v) => validators.minLength(5, 'Reason too short')(v)],
    };
    const { errors: errs, isValid } = validateForm(form, rules);
    setErrors(errs);
    if (!isValid) return;
    setLoading(true);
    try {
      await addLeave(form);
      setForm({ from: '', to: '', type: '', reason: '' });
      setTab('history');
    } catch (err) {
      Alert.alert('Request failed', err.message || 'Could not submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Header title="Leave Request" onBack={() => navigation.goBack()} />
      <View style={styles.tabs}>
        {['apply', 'history'].map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'apply' ? 'Apply' : 'History'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'apply' ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Leave Type *</Text>
            <View style={styles.types}>
              {leaveTypes.map((t) => (
                <TouchableOpacity key={t} style={[styles.typeChip, form.type === t && styles.typeActive]} onPress={() => setForm({ ...form, type: t })}>
                  <Text style={[styles.typeText, form.type === t && styles.typeTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.type && <Text style={styles.error}>{errors.type}</Text>}
            <Input label="From Date" required placeholder="YYYY-MM-DD" value={form.from} onChangeText={(t) => setForm({ ...form, from: t })} error={errors.from} />
            <Input label="To Date" required placeholder="YYYY-MM-DD" value={form.to} onChangeText={(t) => setForm({ ...form, to: t })} error={errors.to} />
            <Input label="Reason" required placeholder="Reason for leave" value={form.reason} onChangeText={(t) => setForm({ ...form, reason: t })} error={errors.reason} multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />
            <Button title="Submit Request" onPress={submit} loading={loading} large style={{ marginTop: spacing.lg }} />
          </ScrollView>
        </KeyboardAvoidingView>
      ) : leaveRequests.length === 0 ? (
        <EmptyState icon={<CalendarOff size={32} color={colors.textMuted} />} title="No Leave History" description="Your leave requests will appear here." />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {leaveRequests.map((l, i) => (
            <FadeIn key={l.id} delay={i * 50}>
              <Card style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyType}>{l.type}</Text>
                  <Badge status={l.status} />
                </View>
                <Text style={styles.historyDates}>{l.from} → {l.to}</Text>
                <Text style={styles.historyReason}>{l.reason}</Text>
              </Card>
            </FadeIn>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  tabs: { flexDirection: 'row', padding: spacing.lg, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: spacing.radius, backgroundColor: colors.card, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: '#FFF' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  typeActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  typeText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  typeTextActive: { color: colors.primary },
  error: { fontSize: 12, color: colors.danger, marginBottom: spacing.md },
  historyCard: { marginBottom: spacing.md },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyType: { fontSize: 15, fontWeight: '700', color: colors.text },
  historyDates: { fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  historyReason: { fontSize: 13, color: colors.text, marginTop: 8 },
});
