// screens/ProfileScreen.jsx
import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>👤 Student Profile</Text>
      <Text>Username: student01</Text>
      <Text>Class: 5</Text>
      <Text>Streak: 5 days</Text>
    </View>
  );
}
