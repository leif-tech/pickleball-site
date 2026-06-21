import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "pickleball.db");

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    court_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    hour INTEGER NOT NULL,
    rate INTEGER NOT NULL,
    need_equipment INTEGER NOT NULL DEFAULT 0,
    first_time INTEGER NOT NULL DEFAULT 0,
    bringing_guests INTEGER NOT NULL DEFAULT 0,
    need_parking INTEGER NOT NULL DEFAULT 0,
    playing_competitive INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(court_id, date, hour)
  );
`);

export default db;
