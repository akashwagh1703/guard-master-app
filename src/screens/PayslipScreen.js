import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Download, FileText } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function PayslipScreen({ navigation, route }) {
  const { guard, downloadPayslip } = useApp();
  const payroll = route.params?.payroll;
  const [loading, setLoading] = useState(false);

  if (!payroll) {
    return (
      <View style={styles.wrap}>
        <Header title="Payslip" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.previewSub}>No payslip data available.</Text>
        </View>
      </View>
    );
  }

  const rows = [
    ['Employee', `${guard?.name || ''} (${guard?.employeeId || ''})`],
    ['Base Salary', `₹${payroll.baseSalary.toLocaleString()}`],
    ['Overtime', `₹${payroll.overtime.toLocaleString()}`],
    ['Bonus', `₹${payroll.bonus.toLocaleString()}`],
    ['Deduction', `₹${payroll.deduction.toLocaleString()}`],
    ['Net Pay', `₹${payroll.netSalary.toLocaleString()}`],
  ];

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadPayslip(payroll.id);
    } catch (err) {
      Alert.alert('Download failed', err.message || 'Could not download payslip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Header title="Payslip" subtitle={payroll.month} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <FadeIn>
          <Card style={styles.preview}>
            <FileText size={48} color={colors.primary} />
            <Text style={styles.previewTitle}>Payslip Preview</Text>
            <Text style={styles.previewSub}>{payroll.month}</Text>
            <View style={styles.details}>
              {rows.map(([k, v]) => (
                <View key={k} style={styles.row}>
                  <Text style={styles.key}>{k}</Text>
                  <Text style={[styles.val, k === 'Net Pay' && styles.netPay]}>{v}</Text>
                </View>
              ))}
            </View>
          </Card>
        </FadeIn>
        <Button title="Download PDF" icon={<Download size={18} color="#FFF" />} loading={loading} large style={{ marginTop: spacing.xl }} onPress={handleDownload} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  preview: { alignItems: 'center', padding: spacing.xxl },
  previewTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.lg },
  previewSub: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  details: { width: '100%', marginTop: spacing.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  key: { fontSize: 14, color: colors.textSecondary },
  val: { fontSize: 14, fontWeight: '600', color: colors.text },
  netPay: { color: colors.primary, fontSize: 16 },
});
