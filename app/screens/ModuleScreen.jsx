// screens/ModuleScreen.jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const sampleTheory = [
  "Page 1: Introduction to English Grammar",
  "Page 2: Parts of Speech",
  "Page 3: Simple Sentences",
];

export default function ModuleScreen({ navigation }) {
  const [page, setPage] = useState(0);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        {sampleTheory[page]}
      </Text>

      {page < sampleTheory.length - 1 ? (
        <Button title="Next Page" onPress={() => setPage(page + 1)} />
      ) : (
        <Button title="Start Quiz" onPress={() => navigation.navigate('Quiz')} />
      )}
    </View>
  );
}
