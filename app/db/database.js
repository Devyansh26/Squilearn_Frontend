// db/database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('studentApp.db');

// Initialize tables
export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS local_modules (
      id TEXT PRIMARY KEY,
      title TEXT,
      date TEXT
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS local_subjects (
      id TEXT PRIMARY KEY,
      module_id TEXT,
      name TEXT,
      order_index INTEGER
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS local_theory_pages (
      id TEXT PRIMARY KEY,
      subject_id TEXT,
      page_number INTEGER,
      content TEXT
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS local_questions (
      id TEXT PRIMARY KEY,
      subject_id TEXT,
      question_text TEXT,
      options TEXT,
      correct_answer TEXT
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS local_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      module_id TEXT,
      subject_id TEXT,
      answers TEXT,
      score INTEGER,
      completed INTEGER,
      synced INTEGER
    );
  `);
}

export default db;
