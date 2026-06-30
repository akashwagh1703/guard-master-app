import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, ChevronRight, Wallet, TrendingUp } from 'lucide-react-native';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

function SalaryRow({ label, value, color, bold }) {
  return (
    <View style={[styles.row, bold && styles.rowBold]}>
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>{label}</Text>
      <Text style={[styles.rowValue, color && { color }, bold && styles.rowValueBold]}>₹{value.toLocaleString()}</Text>
    </View>
  );
}

export default function SalaryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { currentSalary, salaryHistory, downloadPayslip } = useApp();

  if (!currentSalary) {
    return (
      <View style={styles.wrap}>
        <EmptyState icon={<Wallet size={36} color={colors.primary} />} title="No Payroll Yet" description="Your salary records will appear here once payroll is generated." />
      </View>
    );
  }

  const handleDownload = async () => {
    try {
      await downloadPayslip(currentSalary.id);
    } catch {
      navigation.navigate('Payslip', { payroll: currentSalary });
    }
  };

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={colors.gradient.hero} style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
        <FadeIn>
          <View style={styles.heroIcon}><Wallet size={28} color={colors.primary} /></View>
          <Text style={styles.heroLabel}>Your Salary</Text>
          <Text style={styles.heroMonth}>{currentSalary.month}</Text>
          <Text style={styles.heroAmount}>₹{currentSalary.netSalary.toLocaleString()}</Text>
          <Badge status={currentSalary.status} label={currentSalary.status === 'processed' ? 'Paid' : 'Pending'} large />
        </FadeIn>
      </LinearGradient>

      <View style={styles.body}>
        <FadeIn delay={80}>
          <Card elevated style={styles.breakdown}>
            <View style={styles.breakdownHeader}>
              <TrendingUp size={20} color={colors.primary} />
              <Text style={styles.breakdownTitle}>Salary Breakdown</Text>
            </View>
            <SalaryRow label="Basic Salary" value={currentSalary.baseSalary} />
            <SalaryRow label="Overtime Pay" value={currentSalary.overtime} color={colors.success} />
            <SalaryRow label="Bonus" value={currentSalary.bonus} color={colors.success} />
            <SalaryRow label="Deductions" value={currentSalary.deduction} color={colors.danger} />
            <View style={styles.divider} />
            <SalaryRow label="Take Home Pay" value={currentSalary.netSalary} color={colors.primary} bold />
          </Card>
        </FadeIn>

        <FadeIn delay={120}>
          <Button
            title="Download Payslip"
            subtitle="Save PDF to your phone"
            variant="outline"
            icon={<Download size={20} color={colors.primary} />}
            onPress={handleDownload}
            style={{ marginTop: spacing.lg }}
          />
        </FadeIn>

        <Text style={styles.sectionTitle}>Past Months</Text>
        {salaryHistory.length === 0 ? (
          <Text style={styles.emptyHistory}>No previous payroll records.</Text>
        ) : salaryHistory.map((s, i) => (
          <FadeIn key={s.id} delay={160 + i * 40}>
            <TouchableOpacity style={[styles.historyItem, shadows.sm]} activeOpacity={0.75} onPress={() => navigation.navigate('Payslip', { payroll: s })}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIcon}><Wallet size={20} color={colors.primary} /></View>
                <View>
                  <Text style={styles.historyMonth}>{s.month}</Text>
                  <Text style={styles.historyNet}>₹{s.netSalary.toLocaleString()} received</Text>
                </View>
              </View>
              <Badge status={s.status} label={s.status === 'processed' ? 'Paid' : 'Pending'} />
              <ChevronRight size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </FadeIn>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  hero: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, ...shadows.md },
  heroLabel: { fontFamily: fonts.medium, fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  heroMonth: { fontFamily: fonts.semibold, fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  heroAmount: { fontFamily: fonts.bold, fontSize: 40, color: '#FFF', marginVertical: spacing.sm },
  body: { padding: spacing.lg, marginTop: -spacing.xl },
  breakdown: { marginBottom: spacing.sm },
  breakdownHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.lg },
  breakdownTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11 },
  rowBold: { backgroundColor: colors.primarySoft, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, borderRadius: spacing.radius, marginTop: spacing.sm },
  rowLabel: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary },
  rowLabelBold: { fontFamily: fonts.semibold, color: colors.text },
  rowValue: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  rowValueBold: { fontFamily: fonts.bold, fontSize: 18 },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.sm },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginTop: spacing.xxl, marginBottom: spacing.md },
  emptyHistory: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: spacing.radiusLg, padding: spacing.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.borderLight, gap: spacing.md },
  historyLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  historyIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  historyMonth: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  historyNet: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
