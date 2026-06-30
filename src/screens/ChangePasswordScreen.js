import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function ChangePasswordScreen({ navigation }) {
  const { changePassword } = useApp();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const save = async () => {
    const errs = {};
    if (!current) errs.current = 'Required';
    if (!newPass || newPass.length < 8) errs.newPass = 'Minimum 8 characters';
    if (newPass !== confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await changePassword(current, newPass, confirm);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Password change failed', err.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Header title="Change Password" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Current Password" secureTextEntry value={current} onChangeText={setCurrent} error={errors.current} />
        <Input label="New Password" secureTextEntry value={newPass} onChangeText={setNewPass} error={errors.newPass} helper="Minimum 8 characters" />
        <Input label="Confirm Password" secureTextEntry value={confirm} onChangeText={setConfirm} error={errors.confirm} />
        <Button title="Update Password" large loading={loading} onPress={save} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
});
