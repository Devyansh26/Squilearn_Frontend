import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import { fetchModuleById } from "../api";
import { saveModule } from "../db/database";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("studentApp.db");

export default function DashboardScreen({ navigation }) {
  const [hasModule, setHasModule] = useState(false);
  const [moduleProgress, setModuleProgress] = useState({
    total: 0,
    completed: 0,
    status: 'loading' // 'start', 'continue', 'completed', 'loading'
  });
  const [moduleTitle, setModuleTitle] = useState("");

  async function loadModule() {
    try {
      const moduleData = await fetchModuleById(6); // Example module id
      if (moduleData) {
        saveModule(moduleData);
        setHasModule(true);
        checkModuleProgress(6);
        Alert.alert("Module Loaded", "Today's module has been saved locally!");
      }
    } catch (error) {
      console.error("Error loading module:", error);
      // Still check progress in case module was loaded before
      checkModuleProgress(6);
    }
  }

  function checkModuleProgress(moduleId = 6) {
    try {
      // Get module info
      const moduleInfo = db.getFirstSync(
        "SELECT title FROM modules WHERE id = ?",
        [moduleId]
      );
      
      if (moduleInfo) {
        setModuleTitle(moduleInfo.title);
        setHasModule(true);
      }

      // Get all subjects for this module
      const subjects = db.getAllSync(
        "SELECT id FROM subjects WHERE module_id = ?",
        [moduleId]
      );

      const totalSubjects = subjects.length;
      let completedSubjects = 0;

      // Check completion status for each subject
      subjects.forEach(subject => {
        const result = db.getFirstSync(
          "SELECT id FROM results WHERE subject_id = ? AND completed = 1",
          [subject.id]
        );
        if (result) {
          completedSubjects++;
        }
      });

      // Determine status
      let status = 'start';
      if (completedSubjects === totalSubjects && totalSubjects > 0) {
        status = 'completed';
      } else if (completedSubjects > 0) {
        status = 'continue';
      }

      setModuleProgress({
        total: totalSubjects,
        completed: completedSubjects,
        status: status
      });
    } catch (error) {
      console.error("Error checking module progress:", error);
      setModuleProgress({
        total: 0,
        completed: 0,
        status: 'start'
      });
    }
  }

  useEffect(() => {
    loadModule();
  }, []);

  // Refresh progress when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkModuleProgress(6);
    });

    return unsubscribe;
  }, [navigation]);

  const getButtonText = () => {
    switch (moduleProgress.status) {
      case 'completed':
        return '✅ Module Completed';
      case 'continue':
        return '📚 Continue Module';
      case 'start':
        return '🚀 Start Module';
      default:
        return 'Loading...';
    }
  };

  const getButtonColor = () => {
    switch (moduleProgress.status) {
      case 'completed':
        return '#28a745'; // Green
      case 'continue':
        return '#ffc107'; // Yellow
      case 'start':
        return '#007bff'; // Blue
      default:
        return '#6c757d'; // Gray
    }
  };

  const getProgressText = () => {
    if (moduleProgress.total === 0) return "Loading progress...";
    
    switch (moduleProgress.status) {
      case 'completed':
        return `🎉 All ${moduleProgress.total} subjects completed!`;
      case 'continue':
        return `📈 ${moduleProgress.completed}/${moduleProgress.total} subjects completed`;
      case 'start':
        return `🎯 ${moduleProgress.total} subjects to complete`;
      default:
        return "Checking progress...";
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 20 }}>
        <View style={{ 
          backgroundColor: '#ff6b35',
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Text style={{ fontSize: 14, color: 'white', fontWeight: '600' }}>
            🔥 Streak: 5 days
          </Text>
        </View>
      </View>

      {/* Today's Goal Section */}
      <View style={{ 
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#2c3e50' }}>
          🎯 Today's Goal
        </Text>
        <Text style={{ fontSize: 16, color: '#34495e', marginBottom: 15 }}>
          {hasModule ? (moduleTitle || "Day 6 - Comprehensive Learning Module") : "Loading..."}
        </Text>
        
        {/* Progress Indicator */}
        {hasModule && (
          <>
            <View style={{
              backgroundColor: '#e9ecef',
              height: 8,
              borderRadius: 4,
              marginBottom: 10,
            }}>
              <View style={{
                backgroundColor: getButtonColor(),
                height: 8,
                borderRadius: 4,
                width: `${moduleProgress.total > 0 ? (moduleProgress.completed / moduleProgress.total) * 100 : 0}%`,
              }} />
            </View>
            <Text style={{ fontSize: 14, color: '#6c757d' }}>
              {getProgressText()}
            </Text>
          </>
        )}
      </View>

      {/* Main Action Button */}
      {hasModule && (
        <TouchableOpacity
          style={{
            backgroundColor: getButtonColor(),
            padding: 18,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 20,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
          }}
          onPress={() => navigation.navigate("Module", { moduleId: 6 })}
          disabled={moduleProgress.status === 'loading'}
        >
          <Text style={{ 
            color: 'white', 
            fontSize: 18, 
            fontWeight: '600' 
          }}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      )}

      {/* Additional Stats */}
      {hasModule && moduleProgress.total > 0 && (
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 15, color: '#2c3e50' }}>
            📊 Module Statistics
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#28a745' }}>
                {moduleProgress.completed}
              </Text>
              <Text style={{ fontSize: 12, color: '#6c757d' }}>Completed</Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffc107' }}>
                {moduleProgress.total - moduleProgress.completed}
              </Text>
              <Text style={{ fontSize: 12, color: '#6c757d' }}>Remaining</Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#007bff' }}>
                {moduleProgress.total}
              </Text>
              <Text style={{ fontSize: 12, color: '#6c757d' }}>Total</Text>
            </View>
          </View>
        </View>
      )}

      {/* Battle Section */}
      <TouchableOpacity
        style={{
          backgroundColor: '#6c757d',
          padding: 18,
          borderRadius: 12,
          alignItems: 'center',
          opacity: 0.6,
        }}
        disabled={true}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          ⚔️ Battle (Coming Soon)
        </Text>
      </TouchableOpacity>
    </View>
  );
}
