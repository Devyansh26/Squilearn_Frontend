import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import SQLite from "expo-sqlite";


const db = SQLite.openDatabase("studentApp.db");

export default function ModuleScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM subjects WHERE module_id = ? ORDER BY order_index;",
        [6],
        (_, { rows }) => setSubjects(rows._array)
      );
    });
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Subjects</Text>
      {subjects.map(sub => (
        <View key={sub.id} style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>{sub.name}</Text>
          <Button
            title="Open Subject"
            onPress={() => navigation.navigate("Theory", { subjectId: sub.id })}
          />
        </View>
      ))}
    </ScrollView>
  );
}
