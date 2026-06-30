import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Search, Users, ChevronRight } from 'lucide-react-native';
import Badge from '../components/Badge';
import { FAB } from '../components/Button';
import EmptyState from '../components/EmptyState';
import { FadeIn } from '../components/Loading';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

export default function VisitorsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { visitors } = useApp();
  const [search, setSearch] = useState('');

  const filtered = visitors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.purpose.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item, index }) => (
    <FadeIn delay={index * 35}>
      <TouchableOpacity style={[styles.item, shadows.sm]} activeOpacity={0.75} onPress={() => navigation.navigate('VisitorDetail', { visitor: item })}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{item.name[0]}</Text></View>
        <View style={styles.itemContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.purpose}>{item.purpose}</Text>
          <Text style={styles.time}>Came at {item.entryTime}</Text>
        </View>
        <Badge status={item.status} label={item.status === 'inside' ? 'Inside' : 'Left'} />
        <ChevronRight size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </FadeIn>
  );

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={colors.gradient.hero} style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.headerTitle}>Visitors</Text>
        <Text style={styles.headerSub}>Register & track all guests</Text>
        <View style={styles.searchWrap}>
          <Search size={20} color={colors.textMuted} />
          <TextInput
            placeholder="Search by name..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </LinearGradient>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={36} color={colors.primary} />}
          title="No Visitors Yet"
          description="Tap the green button below to add a new visitor"
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon={<Plus size={26} color="#FFF" strokeWidth={2.5} />}
        label="Add Visitor"
        onPress={() => navigation.navigate('AddVisitor')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontFamily: fonts.bold, fontSize: 26, color: '#FFF' },
  headerSub: { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: spacing.lg },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: spacing.radius, paddingHorizontal: spacing.lg, gap: 10, ...shadows.sm },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.text, paddingVertical: 14 },
  list: { padding: spacing.lg, paddingBottom: 120 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: spacing.radiusLg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight, gap: spacing.md },
  avatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary },
  itemContent: { flex: 1 },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  purpose: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  time: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
