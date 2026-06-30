import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import CheckInScreen from '../screens/CheckInScreen';
import CheckInSuccessScreen from '../screens/CheckInSuccessScreen';
import CheckOutScreen from '../screens/CheckOutScreen';
import CheckOutSuccessScreen from '../screens/CheckOutSuccessScreen';
import AttendanceDetailScreen from '../screens/AttendanceDetailScreen';
import AddVisitorScreen from '../screens/AddVisitorScreen';
import VisitorDetailScreen from '../screens/VisitorDetailScreen';
import VisitorSuccessScreen from '../screens/VisitorSuccessScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
import IncidentSuccessScreen from '../screens/IncidentSuccessScreen';
import LeaveScreen from '../screens/LeaveScreen';
import PayslipScreen from '../screens/PayslipScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} />
      <Stack.Screen name="CheckInSuccess" component={CheckInSuccessScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="CheckOut" component={CheckOutScreen} />
      <Stack.Screen name="CheckOutSuccess" component={CheckOutSuccessScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="AttendanceDetail" component={AttendanceDetailScreen} />
      <Stack.Screen name="AddVisitor" component={AddVisitorScreen} />
      <Stack.Screen name="VisitorDetail" component={VisitorDetailScreen} />
      <Stack.Screen name="VisitorSuccess" component={VisitorSuccessScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
      <Stack.Screen name="IncidentSuccess" component={IncidentSuccessScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="LeaveRequest" component={LeaveScreen} />
      <Stack.Screen name="Payslip" component={PayslipScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoggedIn } = useApp();
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="App" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
