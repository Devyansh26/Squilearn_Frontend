// db/database.js
import * as SQLite from "expo-sqlite";

// Use the new async method
const db = SQLite.openDatabaseSync("studentApp.db");

export function initDB() {
  // Use withTransactionSync for synchronous operations
  db.withTransactionSync(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT,
        date TEXT,
        class_name TEXT
      );
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY NOT NULL,
        module_id INTEGER,
        name TEXT,
        order_index INTEGER
      );
      CREATE TABLE IF NOT EXISTS theory_pages (
        id INTEGER PRIMARY KEY NOT NULL,
        subject_id INTEGER,
        page_number INTEGER,
        content TEXT
      );
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY NOT NULL,
        subject_id INTEGER,
        question_text TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_answer TEXT
      );
      CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER DEFAULT 1,
        module_id INTEGER,
        subject_id INTEGER,
        answers TEXT,
        score INTEGER,
        total_questions INTEGER,
        completed INTEGER DEFAULT 1,
        synced INTEGER DEFAULT 0,
        created_at TEXT,
        FOREIGN KEY(module_id) REFERENCES modules(id),
        FOREIGN KEY(subject_id) REFERENCES subjects(id)
      );
    `);
    console.log("Database initialized successfully");
  });
}

export function saveModule(module) {
  db.withTransactionSync(() => {
    db.runSync(
      `INSERT OR REPLACE INTO modules (id, title, date, class_name) VALUES (?, ?, ?, ?);`,
      [module.id, module.title, module.date, module.class_name]
    );

    module.subjects.forEach(subject => {
      db.runSync(
        `INSERT OR REPLACE INTO subjects (id, module_id, name, order_index) VALUES (?, ?, ?, ?);`,
        [subject.id, module.id, subject.name, subject.order_index]
      );

      subject.theory_pages.forEach(page => {
        db.runSync(
          `INSERT OR REPLACE INTO theory_pages (id, subject_id, page_number, content) VALUES (?, ?, ?, ?);`,
          [page.id, subject.id, page.page_number, page.content]
        );
      });

      subject.questions.forEach(q => {
        db.runSync(
          `INSERT OR REPLACE INTO questions (id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [q.id, subject.id, q.question_text, q.options.a, q.options.b, q.options.c, q.options.d, q.correct_answer]
        );
      });
    });
    console.log("Module saved successfully");
  });
}

// New function to save quiz results
export function saveQuizResult(studentId, moduleId, subjectId, answers, score, totalQuestions) {
  try {
    const currentTime = new Date().toISOString();
    const answersJson = JSON.stringify(answers);
    
    db.runSync(
      `INSERT INTO results (student_id, module_id, subject_id, answers, score, total_questions, completed, synced, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?)`,
      [studentId, moduleId, subjectId, answersJson, score, totalQuestions, currentTime]
    );
    
    console.log("Quiz result saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return false;
  }
}

// Function to get quiz results for a subject
export function getQuizResults(subjectId) {
  try {
    const results = db.getAllSync(
      `SELECT r.*, s.name as subject_name, m.title as module_title 
       FROM results r 
       LEFT JOIN subjects s ON r.subject_id = s.id 
       LEFT JOIN modules m ON r.module_id = m.id 
       WHERE r.subject_id = ? 
       ORDER BY r.created_at DESC`,
      [subjectId]
    );
    return results;
  } catch (error) {
    console.error("Error getting quiz results:", error);
    return [];
  }
}

export default db;
