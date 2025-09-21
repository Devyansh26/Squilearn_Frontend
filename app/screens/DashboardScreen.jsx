import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { fetchModuleById } from "../api";
import { saveModule } from "../db/database";

export default function DashboardScreen({ navigation }) {
  const [hasModule, setHasModule] = useState(false);

  async function loadModule() {
    const moduleData = await fetchModuleById(6); // Example module id
    if (moduleData) {
      saveModule(moduleData);
      setHasModule(true);
      Alert.alert("Module Loaded", "Today's module has been saved locally!");
    }
  }

  useEffect(() => {
    loadModule();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Text style={{ fontSize: 16 }}>🔥 Streak: 5 days</Text>
      </View>

      <View style={{ marginTop: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>🎯 Today’s Goal</Text>
        <Text style={{ fontSize: 16 }}>
          {hasModule ? "Day 6 - Comprehensive Learning Module" : "Loading..."}
        </Text>
      </View>

      {hasModule && (
        <Button
          title="Start / Continue Module"
          onPress={() => navigation.navigate("Module")}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="⚔️ Battle (Coming Soon)" disabled />
      </View>
    </View>
  );
}
