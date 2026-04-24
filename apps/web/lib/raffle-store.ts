import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export interface RegistrationInput {
  name: string;
  phone: string;
  email: string;
  course: string;
  reason: string;
  locale?: string;
}

export interface RegistrationRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  course: string;
  reason: string;
  created_at: string;
}

export interface RaffleStore {
  close: () => void;
  isValidAdminLogin: (email: string, password: string) => boolean;
  listRegistrations: () => RegistrationRecord[];
  saveRegistration: (input: RegistrationInput) => RegistrationRecord;
}

interface CreateRaffleStoreOptions {
  dbPath?: string;
}

function getDefaultDbPath() {
  if (process.env.PEDAGEMY_DB_PATH) {
    return process.env.PEDAGEMY_DB_PATH;
  }

  const cwd = process.cwd();
  const dataDir = path.basename(cwd) === "web" ? path.join(cwd, "data") : path.join(cwd, "apps", "web", "data");

  return path.join(dataDir, "db.sqlite");
}

function ensureSchema(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      course TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  const adminCount = db.prepare("SELECT COUNT(*) AS count FROM admin_credentials").get() as { count: number };
  if (adminCount.count === 0) {
    db.prepare("INSERT INTO admin_credentials (email, password) VALUES (?, ?)").run(
      "admin@pedagemy.com",
      "pedagemy2024",
    );
  }
}

function normalizeRegistration(input: RegistrationInput): RegistrationInput {
  return {
    course: input.course.trim(),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    reason: input.reason.trim(),
  };
}

export function createRaffleStore(options: CreateRaffleStoreOptions = {}): RaffleStore {
  const dbPath = options.dbPath ?? getDefaultDbPath();
  const dbDir = path.dirname(dbPath);

  fs.mkdirSync(dbDir, { recursive: true });

  const db = new Database(dbPath);
  ensureSchema(db);

  const insertRegistration = db.prepare(
    "INSERT INTO registrations (name, phone, email, course, reason) VALUES (?, ?, ?, ?, ?)"
  );
  const selectRegistrationById = db.prepare("SELECT * FROM registrations WHERE id = ?");
  const selectAdmin = db.prepare(
    "SELECT id FROM admin_credentials WHERE email = ? AND password = ?"
  );
  const listRegistrations = db.prepare("SELECT * FROM registrations ORDER BY id DESC");

  return {
    close: () => db.close(),
    isValidAdminLogin: (email, password) => {
      const admin = selectAdmin.get(email.trim().toLowerCase(), password.trim()) as { id: number } | undefined;
      return Boolean(admin);
    },
    listRegistrations: () => listRegistrations.all() as RegistrationRecord[],
    saveRegistration: (input) => {
      const normalized = normalizeRegistration(input);
      const result = insertRegistration.run(
        normalized.name,
        normalized.phone,
        normalized.email,
        normalized.course,
        normalized.reason,
      );
      return selectRegistrationById.get(Number(result.lastInsertRowid)) as RegistrationRecord;
    },
  };
}

declare global {
  var __pedagemyRaffleStore: RaffleStore | undefined;
}

export function getRaffleStore() {
  if (!globalThis.__pedagemyRaffleStore) {
    globalThis.__pedagemyRaffleStore = createRaffleStore();
  }

  return globalThis.__pedagemyRaffleStore;
}
