import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

// Use the new async method
const db = SQLite.openDatabaseSync("studentApp.db");

export default function ModuleScreen({ navigation, route }) {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState("");
  const [completionStatus, setCompletionStatus] = useState({});
  
  // Get moduleId from route params, default to 6 if not provided
  const moduleId = route?.params?.moduleId || 6;

  useEffect(() => {
    const loadSubjects = () => {
      try {
        // Load module title first
        const moduleResult = db.getFirstSync(
          "SELECT title FROM modules WHERE id = ?",
          [moduleId]
        );
        
        if (moduleResult) {
          setModuleTitle(moduleResult.title);
        }

        // Use the new getAllSync method instead of transaction
        const result = db.getAllSync(
          "SELECT * FROM subjects WHERE module_id = ? ORDER BY order_index",
          [moduleId]
        );
        
        setSubjects(result);
        
        // Check completion status for each subject
        const statusMap = {};
        result.forEach(subject => {
          const completedResult = db.getFirstSync(
            "SELECT * FROM results WHERE subject_id = ? AND completed = 1 ORDER BY created_at DESC LIMIT 1",
            [subject.id]
          );
          statusMap[subject.id] = completedResult ? true : false;
        });
        
        setCompletionStatus(statusMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading subjects:", error);
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, [moduleId]);

  const handleSubjectPress = (subject) => {
    const isCompleted = completionStatus[subject.id];
    
    if (isCompleted) {
      // Navigate to results screen
      navigation.navigate('ResultScreen', { 
        subjectId: subject.id,
        subjectName: subject.name 
      });
    } else {
      // Navigate to theory screen to start learning
      navigation.navigate('TheoryScreen', { subjectId: subject.id });
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading subjects...</Text>
      </View>
    );
  }

  if (subjects.length === 0) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center' }}>
          No subjects found for this module.
        </Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {moduleTitle ? (
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          {moduleTitle}
        </Text>
      ) : null}
      
      <Text style={{ fontSize: 20, marginBottom: 20, color: '#333' }}>
        Subjects ({subjects.length})
      </Text>
      
      {subjects.map((sub, index) => {
        const isCompleted = completionStatus[sub.id];
        
        return (
          <TouchableOpacity
            key={sub.id}
            style={{
              backgroundColor: isCompleted ? '#e8f5e8' : '#f8f9fa',
              padding: 20,
              marginBottom: 15,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isCompleted ? '#28a745' : '#e9ecef',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => handleSubjectPress(sub)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  marginBottom: 8 
                }}>
                  {index + 1}. {sub.name}
                </Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: isCompleted ? '#28a745' : '#6c757d'
                }}>
                  {isCompleted ? 'Tap to view results' : 'Tap to start learning'}
                </Text>
              </View>
              <View style={{
                backgroundColor: isCompleted ? '#28a745' : '#007bff',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  {isCompleted ? 'COMPLETED ✓' : 'START'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
