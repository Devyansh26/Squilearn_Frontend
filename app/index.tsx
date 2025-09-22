// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import ModuleScreen from './screens/ModuleScreen';
import QuizScreen from './screens/QuizScreen';
import TheoryScreen from './screens/TheoryScreen'; // Add this import
import ProfileScreen from './screens/ProfileScreen';
import { initDB } from './db/database';
import * as SQLite from 'expo-sqlite';
import { useSQLiteDevTools } from 'expo-sqlite-devtools';
import { View,Text } from 'react-native';
import ResultScreen from './screens/ResultScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


// Get database instance for DevTools
const db = SQLite.openDatabaseSync("studentApp.db");

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Module" component={ModuleScreen} />
      <Stack.Screen name="TheoryScreen" component={TheoryScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
}

// Placeholder components for empty screens
function ProgressScreen() {
  return (
    <>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Progress Screen</Text>
      <Text style={{ color: '#666', marginTop: 10 }}>Coming Soon!</Text>
    </View>
    </>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Settings Screen</Text>
      <Text style={{ color: '#666', marginTop: 10 }}>Coming Soon!</Text>
    </View>
  );
}

export default function Index() {
  // Initialize database and DevTools
  useEffect(() => {
    initDB();
  }, []);

  // Enable SQLite DevTools
  useSQLiteDevTools(db);

  return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen 
          name="Home" 
          component={DashboardStack}
          options={{ title: 'Dashboard' }}
        />
        <Drawer.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Drawer.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{ title: 'Progress' }}
        />
        <Drawer.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Drawer.Navigator>
  );
}
