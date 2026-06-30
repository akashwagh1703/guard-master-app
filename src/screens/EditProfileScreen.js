import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function EditProfileScreen({ navigation }) {
  const { guard, updateProfile } = useApp();
  const [mobile, setMobile] = useState(guard?.mobile || '');
  const [email, setEmail] = useState(guard?.email || '');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await updateProfile({ mobile, email });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Update failed', err.message || 'Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Header title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Mobile" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Button title="Save Changes" large loading={loading} onPress={save} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
});
