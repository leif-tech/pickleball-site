import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

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
    role TEXT NOT NULL DEFAULT 'user',
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

// Idempotent migrations
try { db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`); } catch { /* exists */ }
try { db.exec(`ALTER TABLE bookings ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'confirmed'`); } catch { /* exists */ }
try { db.exec(`ALTER TABLE bookings ADD COLUMN receipt_path TEXT`); } catch { /* exists */ }
try { db.exec(`ALTER TABLE bookings ADD COLUMN reference_number TEXT`); } catch { /* exists */ }

// Seed default admin account
try {
  const adminEmail = "admin@pickleball.com";
  const existingAdmin = db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail) as { id: number } | undefined;
  if (!existingAdmin) {
    const hash = bcrypt.hashSync("admin-change-me", 10);
    db.prepare(
      "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)"
    ).run("Admin", adminEmail, "0000000000", hash, "admin");
  } else {
    // Ensure existing admin has admin role
    db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(adminEmail);
  }
} catch { /* admin already seeded */ }

export default db;
