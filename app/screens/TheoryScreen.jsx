import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import SQLite from "expo-sqlite";

const db = SQLite.openDatabase("studentApp.db");

export default function TheoryScreen({ route, navigation }) {
  const { subjectId } = route.params;
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM theory_pages WHERE subject_id = ? ORDER BY page_number;",
        [subjectId],
        (_, { rows }) => setPages(rows._array)
      );
    });
  }, [subjectId]);

  if (pages.length === 0) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        <Text style={{ fontSize: 16 }}>{pages[currentPage].content}</Text>
      </ScrollView>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        {currentPage > 0 && (
          <Button title="Previous" onPress={() => setCurrentPage(currentPage - 1)} />
        )}
        {currentPage < pages.length - 1 ? (
          <Button title="Next" onPress={() => setCurrentPage(currentPage + 1)} />
        ) : (
          <Button
            title="Go to Quiz"
            onPress={() => navigation.navigate("Quiz", { subjectId })}
          />
        )}
      </View>
    </View>
  );
}
