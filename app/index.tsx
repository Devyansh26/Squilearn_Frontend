// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import ModuleScreen from './screens/ModuleScreen';
import QuizScreen from './screens/QuizScreen';
import ProfileScreen from './screens/ProfileScreen';
import { initDB } from './db/database';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Module" component={ModuleScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
    </Stack.Navigator>
  );
}

export default function Index() {
  useEffect(() => {
    initDB();
  }, []);

  return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={DashboardStack} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        {/* Placeholder screens */}
        <Drawer.Screen name="Progress" component={() => <></>} />
        <Drawer.Screen name="Settings" component={() => <></>} />
      </Drawer.Navigator>
  );
}
