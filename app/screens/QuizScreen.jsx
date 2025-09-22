import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, Alert } from "react-native";
import * as SQLite from "expo-sqlite";
import { saveQuizResult } from "../db/database";

// Use the new async method
const db = SQLite.openDatabaseSync("studentApp.db");

export default function QuizScreen({ route, navigation }) {
  const { subjectId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // New state for selected option
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    const loadQuestions = () => {
      try {
        // Get subject info with module_id and name
        const subjectInfo = db.getFirstSync(
          "SELECT module_id, name FROM subjects WHERE id = ?",
          [subjectId]
        );
        setModuleId(subjectInfo?.module_id);
        setSubjectName(subjectInfo?.name || "");

        // Load questions
        const result = db.getAllSync(
          "SELECT * FROM questions WHERE subject_id = ?",
          [subjectId]
        );
        setQuestions(result);
        setUserAnswers(new Array(result.length).fill(null));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading questions:", error);
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [subjectId]);

  // Handle option selection (doesn't submit immediately)
  function handleOptionSelect(optionKey) {
    setSelectedOption(optionKey);
  }

  // Handle submitting the answer and moving to next question
  function handleSubmitAnswer() {
    if (!selectedOption) {
      Alert.alert("Please select an option", "You must choose an answer before proceeding.");
      return;
    }

    // Store user's answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = {
      questionId: questions[currentQ].id,
      selectedOption: selectedOption,
      correctOption: questions[currentQ].correct_answer,
      isCorrect: questions[currentQ].correct_answer === selectedOption
    };
    setUserAnswers(newAnswers);

    let newScore = score;
    if (questions[currentQ].correct_answer === selectedOption) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    if (currentQ < questions.length - 1) {
      // Move to next question
      setCurrentQ(currentQ + 1);
      setSelectedOption(null); // Reset selected option for next question
    } else {
      // Quiz finished - save results to database
      setQuizFinished(true);
      
      // Save to database
      const studentId = 1; // Default student ID, you can make this dynamic later
      const success = saveQuizResult(
        studentId, 
        moduleId, 
        subjectId, 
        newAnswers, 
        newScore, 
        questions.length
      );

      if (success) {
        Alert.alert(
          "Quiz Completed!", 
          `Your final score: ${newScore}/${questions.length}\n\nResult saved successfully!`,
          [
            { 
              text: "View Results", 
              onPress: () => navigation.navigate('ResultScreen', { 
                subjectId,
                subjectName 
              })
            },
            { 
              text: "Back to Module", 
              onPress: () => navigation.navigate('Module', { moduleId })
            }
          ]
        );
      } else {
        Alert.alert(
          "Quiz Completed!", 
          `Your final score: ${newScore}/${questions.length}\n\nWarning: Could not save results.`,
          [
            { 
              text: "Back to Module", 
              onPress: () => navigation.navigate('Module', { moduleId })
            }
          ]
        );
      }
    }
  }

  if (isLoading) return <Text>Loading quiz...</Text>;
  if (questions.length === 0) return <Text>No questions found for this subject.</Text>;
  
  if (quizFinished) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Quiz Completed!
        </Text>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Final Score: {score}/{questions.length}
        </Text>
        <Text style={{ fontSize: 16, color: '#666', marginBottom: 30 }}>
          {score === questions.length ? "Perfect Score! 🎉" : 
           score >= questions.length * 0.7 ? "Great Job! 👏" : "Keep Practicing! 📚"}
        </Text>
        
        <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#007bff',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('ResultScreen', { 
              subjectId,
              subjectName 
            })}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              View Results
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#6c757d',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('Module', { moduleId })}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Back to Module
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const q = questions[currentQ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, color: '#666' }}>
          Question {currentQ + 1} of {questions.length}
        </Text>
        <Text style={{ fontSize: 14, color: '#666' }}>
          Current Score: {score}/{currentQ}
        </Text>
      </View>
      
      {/* Question */}
      <Text style={{ fontSize: 18, marginBottom: 20, fontWeight: '500' }}>
        {q.question_text}
      </Text>
      
      {/* Options */}
      {["a", "b", "c", "d"].map(opt => {
        const isSelected = selectedOption === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={{
              padding: 15,
              backgroundColor: isSelected ? "#007bff" : "#e8e8e8",
              marginVertical: 8,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: isSelected ? "#0056b3" : "#ddd",
            }}
            onPress={() => handleOptionSelect(opt)}
            activeOpacity={0.7}
          >
            <Text style={{ 
              fontSize: 16,
              color: isSelected ? "white" : "black",
              fontWeight: isSelected ? "600" : "normal"
            }}>
              {opt.toUpperCase()}. {q[`option_${opt}`]}
            </Text>
          </TouchableOpacity>
        );
      })}
      
      {/* Bottom Section */}
      <View style={{ marginTop: 20, flex: 1, justifyContent: 'flex-end' }}>
        {selectedOption ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#28a745',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 10,
            }}
            onPress={handleSubmitAnswer}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              backgroundColor: '#e9ecef',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ color: '#6c757d', fontSize: 16 }}>
              Select an option to continue
            </Text>
          </View>
        )}
        
        <Text style={{ fontSize: 14, color: '#888', textAlign: 'center' }}>
          {selectedOption 
            ? `Selected: ${selectedOption.toUpperCase()}` 
            : 'Tap an option to select your answer'
          }
        </Text>
      </View>
    </View>
  );
}
