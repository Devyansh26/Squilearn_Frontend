// db/database.js
import SQLite from "expo-sqlite";

const db = SQLite.openDatabase("studentApp.db"); // Correct async method

export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT,
        date TEXT,
        class_name TEXT
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY NOT NULL,
        module_id INTEGER,
        name TEXT,
        order_index INTEGER
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS theory_pages (
        id INTEGER PRIMARY KEY NOT NULL,
        subject_id INTEGER,
        page_number INTEGER,
        content TEXT
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY NOT NULL,
        subject_id INTEGER,
        question_text TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_answer TEXT
      );`
    );
  }, (err) => {
    console.log("Error initializing DB:", err);
  }, () => {
    console.log("Database initialized successfully");
  });
}

export function saveModule(module) {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT OR REPLACE INTO modules (id, title, date, class_name) VALUES (?, ?, ?, ?);`,
      [module.id, module.title, module.date, module.class_name]
    );

    module.subjects.forEach(subject => {
      tx.executeSql(
        `INSERT OR REPLACE INTO subjects (id, module_id, name, order_index) VALUES (?, ?, ?, ?);`,
        [subject.id, module.id, subject.name, subject.order_index]
      );

      subject.theory_pages.forEach(page => {
        tx.executeSql(
          `INSERT OR REPLACE INTO theory_pages (id, subject_id, page_number, content) VALUES (?, ?, ?, ?);`,
          [page.id, subject.id, page.page_number, page.content]
        );
      });

      subject.questions.forEach(q => {
        tx.executeSql(
          `INSERT OR REPLACE INTO questions (id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [q.id, subject.id, q.question_text, q.options.a, q.options.b, q.options.c, q.options.d, q.correct_answer]
        );
      });
    });
  }, (err) => {
    console.log("Error saving module:", err);
  }, () => {
    console.log("Module saved successfully");
  });
}

export default db; // optional, if you want default export
