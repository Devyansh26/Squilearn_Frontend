// screens/DashboardScreen.jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const [streak, setStreak] = useState(5);
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Top Row: Streak */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 16 }}>🔥 Streak: {streak} days</Text>
      </View>

      {/* Today’s Goal */}
      <View style={{ marginTop: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>🎯 Today’s Goal</Text>
        <Text style={{ fontSize: 16 }}>Module: Day 1 - English, Math, Science</Text>
      </View>

      {/* Continue / Start Module */}
      <View style={{ marginBottom: 20 }}>
        {hasStarted ? (
          <Button
            title="📘 Continue Module"
            onPress={() => navigation.navigate('Module')}
          />
        ) : (
          <Button
            title="✅ Start New Module"
            onPress={() => {
              setHasStarted(true);
              navigation.navigate('Module');
            }}
          />
        )}
      </View>

      {/* Battle Button */}
      <View style={{ marginTop: 20 }}>
        <Button title="⚔️ Battle (Coming Soon)" disabled />
      </View>
    </View>
  );
}
