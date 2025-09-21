// screens/QuizScreen.jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const sampleQuestions = [
  {
    id: "q1",
    question: "What is the noun in this sentence: 'The cat sleeps'?",
    options: ["cat", "sleeps", "the"],
    answer: "cat",
  },
  {
    id: "q2",
    question: "Which is a verb?",
    options: ["run", "dog", "house"],
    answer: "run",
  },
];

export default function QuizScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const currentQ = sampleQuestions[index];

  function handleAnswer(option) {
    if (option === currentQ.answer) setScore(score + 1);
    if (index < sampleQuestions.length - 1) {
      setIndex(index + 1);
    } else {
      navigation.navigate('Dashboard', { result: score + 1 });
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        {currentQ.question}
      </Text>
      {currentQ.options.map((opt) => (
        <Button key={opt} title={opt} onPress={() => handleAnswer(opt)} />
      ))}
    </View>
  );
}
