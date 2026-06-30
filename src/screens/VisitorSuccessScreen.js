import React from 'react';
import SuccessScreen from '../components/SuccessScreen';

export default function VisitorSuccessScreen({ navigation, route }) {
  return (
    <SuccessScreen
      title="Visitor Registered!"
      message={`${route.params?.name} has been checked in successfully.`}
      buttonLabel="Back to Visitors"
      onDone={() => navigation.navigate('MainTabs', { screen: 'Visitors' })}
    />
  );
}
