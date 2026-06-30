import React from 'react';
import SuccessScreen from '../components/SuccessScreen';

export default function IncidentSuccessScreen({ navigation, route }) {
  return (
    <SuccessScreen
      title="Incident Reported!"
      message="Admin has been notified."
      details={[['Ticket Number', route.params?.ticket]]}
      buttonLabel="Done"
      onDone={() => navigation.navigate('MainTabs', { screen: 'Home' })}
    />
  );
}
