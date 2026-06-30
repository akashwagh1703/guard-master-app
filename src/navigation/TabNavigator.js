import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CalendarCheck, Users, Wallet, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import VisitorsScreen from '../screens/VisitorsScreen';
import SalaryScreen from '../screens/SalaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../theme/colors';
import spacing, { shadows } from '../theme/spacing';
import fonts from '../theme/fonts';

const Tab = createBottomTabNavigator();

const tabConfig = [
  { name: 'Home', component: HomeScreen, icon: Home, label: 'Home' },
  { name: 'AttendanceTab', component: AttendanceScreen, label: 'Attendance', icon: CalendarCheck },
  { name: 'Visitors', component: VisitorsScreen, label: 'Visitors', icon: Users },
  { name: 'SalaryTab', component: SalaryScreen, label: 'Salary', icon: Wallet },
  { name: 'ProfileTab', component: ProfileScreen, label: 'Profile', icon: User },
];

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = tabConfig.find((t) => t.name === route.name);
        const Icon = config?.icon || Home;
        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 0,
            height: spacing.tabHeight + insets.bottom,
            paddingBottom: insets.bottom + 6,
            paddingTop: 10,
            paddingHorizontal: 8,
            ...shadows.md,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11, marginTop: 2 },
          tabBarIcon: ({ color, focused, size }) => (
            <View style={{
              backgroundColor: focused ? colors.primarySoft : 'transparent',
              borderRadius: 14,
              paddingHorizontal: focused ? 14 : 10,
              paddingVertical: 6,
            }}>
              <Icon size={focused ? size : size - 1} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          tabBarLabel: config?.label || route.name,
        };
      }}
    >
      {tabConfig.map(({ name, component }) => (
        <Tab.Screen key={name} name={name} component={component} />
      ))}
    </Tab.Navigator>
  );
}
