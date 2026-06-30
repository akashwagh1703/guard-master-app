import React from 'react';
import SuccessScreen from '../components/SuccessScreen';
import { useApp } from '../context/AppContext';

export default function CheckInSuccessScreen({ navigation, route }) {
  const { assignment } = useApp();
  const { time } = route.params || {};

  return (
    <SuccessScreen
      title="Check-In Successful!"
      message="You are now on duty. Stay safe!"
      details={[
        ['Time', time],
        ['Site', assignment.site],
        ['Shift', assignment.shift],
        ['Status', 'On Duty'],
      ]}
      buttonLabel="Go to Home"
      onDone={() => navigation.navigate('MainTabs', { screen: 'Home' })}
    />
  );
}
