import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import  SQLite from "expo-sqlite";

const db = SQLite.openDatabase("studentApp.db");

export default function QuizScreen({ route }) {
  const { subjectId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM questions WHERE subject_id = ?;",
        [subjectId],
        (_, { rows }) => setQuestions(rows._array)
      );
    });
  }, [subjectId]);

  function handleAnswer(optionKey) {
    if (questions[currentQ].correct_answer === optionKey) {
      setScore(score + 1);
    }
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      alert(`Quiz Finished! Your score: ${score + 1}/${questions.length}`);
    }
  }

  if (questions.length === 0) return <Text>Loading...</Text>;

  const q = questions[currentQ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>{q.question_text}</Text>
      {["a", "b", "c", "d"].map(opt => (
        <TouchableOpacity
          key={opt}
          style={{
            padding: 10,
            backgroundColor: "#ddd",
            marginVertical: 5,
            borderRadius: 5,
          }}
          onPress={() => handleAnswer(opt)}
        >
          <Text>{q[`option_${opt}`]}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
