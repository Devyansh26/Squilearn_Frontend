import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("studentApp.db");

export default function ResultScreen({ route, navigation }) {
  const { subjectId, subjectName } = route.params;
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const loadResults = () => {
      try {
        const resultsData = db.getAllSync(
          `SELECT r.*, s.name as subject_name, m.title as module_title 
           FROM results r 
           LEFT JOIN subjects s ON r.subject_id = s.id 
           LEFT JOIN modules m ON r.module_id = m.id 
           WHERE r.subject_id = ? 
           ORDER BY r.created_at DESC`,
          [subjectId]
        );
        
        setResults(resultsData);
        if (resultsData.length > 0) {
          setSelectedResult(resultsData[0]); // Show latest result by default
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading results:", error);
        setIsLoading(false);
      }
    };

    loadResults();
  }, [subjectId]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#28a745'; // Green
    if (percentage >= 60) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  const getPerformanceText = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 60) return "Good Job! 👏";
    return "Keep Practicing! 📚";
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading results...</Text>
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          No results found for this subject.
        </Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#007bff', padding: 20, paddingTop: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>
          Quiz Results
        </Text>
        <Text style={{ fontSize: 16, color: '#e3f2fd' }}>
          {subjectName || selectedResult?.subject_name}
        </Text>
      </View>

      {/* Result Selection */}
      {results.length > 1 && (
        <View style={{ padding: 20, backgroundColor: 'white', marginBottom: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
            Select Attempt ({results.length} total)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {results.map((result, index) => (
              <TouchableOpacity
                key={result.id}
                style={{
                  backgroundColor: selectedResult?.id === result.id ? '#007bff' : '#e9ecef',
                  padding: 10,
                  borderRadius: 8,
                  marginRight: 10,
                  minWidth: 80,
                  alignItems: 'center'
                }}
                onPress={() => setSelectedResult(result)}
              >
                <Text style={{
                  color: selectedResult?.id === result.id ? 'white' : '#333',
                  fontSize: 12,
                  fontWeight: '600'
                }}>
                  Attempt {index + 1}
                </Text>
                <Text style={{
                  color: selectedResult?.id === result.id ? 'white' : '#666',
                  fontSize: 10
                }}>
                  {formatDate(result.created_at).split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedResult && (
        <>
          {/* Score Card */}
          <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 12, padding: 20, elevation: 3 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ 
                fontSize: 48, 
                fontWeight: 'bold', 
                color: getScoreColor(selectedResult.score, selectedResult.total_questions)
              }}>
                {selectedResult.score}/{selectedResult.total_questions}
              </Text>
              <Text style={{ fontSize: 18, color: '#666', marginBottom: 5 }}>
                {Math.round((selectedResult.score / selectedResult.total_questions) * 100)}% Score
              </Text>
              <Text style={{ fontSize: 16, color: getScoreColor(selectedResult.score, selectedResult.total_questions) }}>
                {getPerformanceText(selectedResult.score, selectedResult.total_questions)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#28a745' }}>
                  {selectedResult.score}
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>Correct</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#dc3545' }}>
                  {selectedResult.total_questions - selectedResult.score}
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>Wrong</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007bff' }}>
                  {selectedResult.total_questions}
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>Total</Text>
              </View>
            </View>
          </View>

          {/* Quiz Details */}
          <View style={{ backgroundColor: 'white', marginHorizontal: 20, marginBottom: 20, borderRadius: 12, padding: 20, elevation: 3 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15 }}>
              Quiz Details
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ color: '#666' }}>Date Taken:</Text>
              <Text style={{ fontWeight: '500' }}>{formatDate(selectedResult.created_at)}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ color: '#666' }}>Module:</Text>
              <Text style={{ fontWeight: '500' }}>{selectedResult.module_title}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ color: '#666' }}>Subject:</Text>
              <Text style={{ fontWeight: '500' }}>{selectedResult.subject_name}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#666' }}>Status:</Text>
              <Text style={{ fontWeight: '500', color: '#28a745' }}>
                {selectedResult.completed ? 'Completed ✓' : 'In Progress'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#007bff',
                padding: 15,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 10
              }}
              onPress={() => navigation.navigate('QuizScreen', { subjectId })}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Retake Quiz
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: '#6c757d',
                padding: 15,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Back to Module
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}