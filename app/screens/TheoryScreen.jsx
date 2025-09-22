  import React, { useEffect, useState } from "react";
  import { View, Text, Button, ScrollView } from "react-native";
  import * as SQLite from "expo-sqlite";
  import { router, useLocalSearchParams } from "expo-router";

  const db = SQLite.openDatabaseSync("studentApp.db");

  export default function TheoryScreen({navigation,route}) {
    const { subjectId } = route.params;
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const loadPages = () => {
        try {
          const result = db.getAllSync(
            "SELECT * FROM theory_pages WHERE subject_id = ? ORDER BY page_number",
            [subjectId]
          );
          setPages(result);
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading theory pages:", error);
          setIsLoading(false);
        }
      };

      loadPages();
    }, [subjectId]);

    if (isLoading) return <Text>Loading...</Text>;
    if (pages.length === 0) return <Text>No theory pages found.</Text>;

    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ScrollView>
          <Text style={{ fontSize: 16 }}>{pages[currentPage]?.content}</Text>
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
              onPress={() => navigation.navigate('QuizScreen', { subjectId })}
            />
          )}
        </View>
      </View>
    );
  }
