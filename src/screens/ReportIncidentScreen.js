import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { AlertTriangle, Camera, MapPin } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import { incidentCategories } from '../constants/incidentCategories';
import { validators, validateForm } from '../utils/validation';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function ReportIncidentScreen({ navigation }) {
  const { addIncident, assignment } = useApp();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const rules = {
      type: [validators.required],
      description: [(v) => validators.required(v), (v) => validators.minLength(10, 'Describe in at least 10 characters')(v)],
    };
    const { errors: errs, isValid } = validateForm({ type, description }, rules);
    setErrors(errs);
    if (!isValid) return;

    setLoading(true);
    try {
      const ticket = await addIncident({
        type,
        description,
        latitude: assignment?.siteLat,
        longitude: assignment?.siteLng,
      });
      navigation.replace('IncidentSuccess', { ticket });
    } catch (err) {
      Alert.alert('Report failed', err.message || 'Could not submit incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Report Incident" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FadeIn>
          <Text style={styles.label}>Incident Category *</Text>
          <View style={styles.categories}>
            {incidentCategories.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.catChip, type === cat && styles.catActive]} onPress={() => setType(cat)}>
                <Text style={[styles.catText, type === cat && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.type && <Text style={styles.error}>{errors.type}</Text>}
        </FadeIn>

        <FadeIn delay={80}>
          <Input label="Description" required placeholder="Describe the incident in detail..." value={description} onChangeText={setDescription} error={errors.description} multiline numberOfLines={4} style={{ minHeight: 100, textAlignVertical: 'top' }} helper={`${description.length}/500 characters`} maxLength={500} />
        </FadeIn>

        <FadeIn delay={120}>
          <Card style={styles.uploadCard}>
            <Camera size={28} color={colors.primary} />
            <Text style={styles.uploadText}>Tap to upload photos</Text>
            <Text style={styles.uploadSub}>Multiple images supported</Text>
          </Card>
        </FadeIn>

        <FadeIn delay={160}>
          <View style={styles.autoRow}>
            <MapPin size={16} color={colors.success} />
            <Text style={styles.autoText}>GPS: {(assignment?.siteLat || 0).toFixed(4)}, {(assignment?.siteLng || 0).toFixed(4)}</Text>
          </View>
          <Text style={styles.autoText}>Time: {new Date().toLocaleString('en-IN')}</Text>
        </FadeIn>

        <Button title="Submit Report" onPress={submit} loading={loading} variant="danger" large icon={<AlertTriangle size={20} color="#FFF" />} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  catActive: { backgroundColor: colors.dangerLight, borderColor: colors.danger },
  catText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  catTextActive: { color: colors.danger },
  error: { fontSize: 12, color: colors.danger, marginTop: 4 },
  uploadCard: { alignItems: 'center', padding: spacing.xxl, borderStyle: 'dashed', borderWidth: 2, borderColor: colors.border, marginTop: spacing.lg },
  uploadText: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: spacing.sm },
  uploadSub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  autoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.lg },
  autoText: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});
