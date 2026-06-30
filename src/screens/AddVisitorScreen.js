import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Header from '../components/Header';
import Input, { NumericInput } from '../components/Input';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { validators, validateForm, sanitizePhone } from '../utils/validation';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

const rules = {
  name: [(v) => validators.required(v), (v) => validators.minLength(2, 'Name too short')(v)],
  mobile: [(v) => validators.required(v), validators.phone],
  purpose: [(v) => validators.required(v)],
  personToMeet: [(v) => validators.required(v)],
};

export default function AddVisitorScreen({ navigation }) {
  const { addVisitor } = useApp();
  const [form, setForm] = useState({ name: '', mobile: '', purpose: '', personToMeet: '', vehicle: '', idType: 'Aadhaar', idNumber: '', remarks: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const { errors: errs, isValid } = validateForm(form, rules);
    setErrors(errs);
    if (!isValid) return;
    setLoading(true);
    try {
      await addVisitor(form);
      navigation.replace('VisitorSuccess', { name: form.name });
    } catch (err) {
      Alert.alert('Registration failed', err.message || 'Could not register visitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Add Visitor" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Visitor Name" required placeholder="Full name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} error={errors.name} />
        <Input label="Mobile Number" required placeholder="+91 XXXXX XXXXX" value={form.mobile} onChangeText={(t) => setForm({ ...form, mobile: sanitizePhone(t) })} error={errors.mobile} keyboardType="phone-pad" />
        <Input label="Purpose" required placeholder="Reason for visit" value={form.purpose} onChangeText={(t) => setForm({ ...form, purpose: t })} error={errors.purpose} />
        <Input label="Person To Meet" required placeholder="Contact person" value={form.personToMeet} onChangeText={(t) => setForm({ ...form, personToMeet: t })} error={errors.personToMeet} />
        <Input label="Vehicle Number" placeholder="Optional" value={form.vehicle} onChangeText={(t) => setForm({ ...form, vehicle: t })} />
        <Input label="ID Type" placeholder="Aadhaar, PAN, etc." value={form.idType} onChangeText={(t) => setForm({ ...form, idType: t })} />
        <NumericInput label="ID Number" placeholder="ID number" value={form.idNumber} onChangeText={(t) => setForm({ ...form, idNumber: t })} />
        <Input label="Remarks" placeholder="Additional notes" value={form.remarks} onChangeText={(t) => setForm({ ...form, remarks: t })} multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />
        <View style={styles.autoInfo}>
          <Input label="Entry Time" value={new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} editable={false} />
        </View>
        <Button title="Register Visitor" onPress={submit} loading={loading} large style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  autoInfo: { opacity: 0.7 },
});
