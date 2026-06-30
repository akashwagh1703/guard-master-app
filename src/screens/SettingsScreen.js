import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Globe, Bell, Moon, Shield, Info, HelpCircle } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import { FadeIn } from '../components/Loading';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

function SettingItem({ icon: Icon, label, value }) {
  return (
    <View style={styles.item}>
      <View style={styles.iconWrap}><Icon size={18} color={colors.primary} /></View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
      </View>
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.wrap}>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <FadeIn><Card style={{ padding: 0, overflow: 'hidden' }}>
          <SettingItem icon={Globe} label="Language" value="English" />
          <SettingItem icon={Bell} label="Notification Settings" value="All enabled" />
          <SettingItem icon={Moon} label="Theme" value="Light (Dark — coming soon)" />
          <SettingItem icon={Shield} label="Privacy Policy" />
          <SettingItem icon={HelpCircle} label="Help & Support" />
          <SettingItem icon={Info} label="About GuardMaster" value="Smart Security Platform" />
        </Card></FadeIn>
        <FadeIn delay={100}><Text style={styles.version}>GuardMaster v1.0.0 · Build 2026.06</Text></FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  item: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  content: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  value: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  version: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginTop: spacing.xxl },
});
