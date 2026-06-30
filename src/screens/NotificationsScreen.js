import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Bell, Trash2, Clock, Wallet, Calendar, AlertTriangle } from 'lucide-react-native';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

const catIcons = {
  attendance: Clock,
  payroll: Wallet,
  shift: Calendar,
  leave: Calendar,
  incident: AlertTriangle,
};

export default function NotificationsScreen({ navigation }) {
  const { notifications, markNotificationRead, deleteNotification } = useApp();

  const renderItem = ({ item, index }) => {
    const Icon = catIcons[item.category] || Bell;
    return (
      <FadeIn delay={index * 30}>
        <TouchableOpacity
          style={[styles.item, !item.read && styles.unread]}
          activeOpacity={0.7}
          onPress={() => markNotificationRead(item.id)}
        >
          <View style={[styles.iconWrap, !item.read && { backgroundColor: colors.primaryLight }]}>
            <Icon size={20} color={item.read ? colors.textMuted : colors.primary} />
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, !item.read && styles.titleUnread]}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <TouchableOpacity onPress={() => deleteNotification(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Trash2 size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </TouchableOpacity>
      </FadeIn>
    );
  };

  return (
    <View style={styles.wrap}>
      <Header title="Notifications" onBack={() => navigation.goBack()} />
      {notifications.length === 0 ? (
        <EmptyState icon={<Bell size={32} color={colors.textMuted} />} title="No Notifications" description="You're all caught up!" />
      ) : (
        <FlatList data={notifications} keyExtractor={(i) => String(i.id)} renderItem={renderItem} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  item: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.card, borderRadius: spacing.radiusLg, padding: spacing.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.borderLight, gap: spacing.md },
  unread: { borderColor: colors.primary + '40', backgroundColor: colors.primaryLight + '40' },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: colors.text },
  titleUnread: { fontWeight: '700' },
  message: { fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  time: { fontSize: 11, color: colors.textMuted, marginTop: 6 },
});
