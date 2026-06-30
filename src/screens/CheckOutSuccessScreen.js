import React from 'react';
import SuccessScreen from '../components/SuccessScreen';

export default function CheckOutSuccessScreen({ navigation, route }) {
  const { hours, overtime, time } = route.params || {};

  return (
    <SuccessScreen
      title="Duty Completed!"
      message="Great work today. Rest well!"
      details={[
        ['Check-Out', time],
        ['Working Hours', `${hours} hrs`],
        ['Overtime', `${overtime} hrs`],
        ['Status', 'Off Duty'],
      ]}
      buttonLabel="Go to Home"
      onDone={() => navigation.navigate('MainTabs', { screen: 'Home' })}
    />
  );
}
