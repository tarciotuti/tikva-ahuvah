import * as SQLite from 'expo-sqlite';
import { Memory, Capsule } from '../types';
import { INITIAL_MEMORIES, INITIAL_CAPSULES } from '../data/initialData';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync('memorias.db');
  }
  return dbInstance;
}

export function initDatabase() {
  const db = getDatabase();

  // Criação das tabelas
  db.execSync(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      photo_uri TEXT,
      category TEXT NOT NULL,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      location TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS capsules (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      content TEXT NOT NULL,
      quote TEXT,
      author_note TEXT,
      unlock_date TEXT,
      is_opened INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      icon TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  // Verificar se há memórias para popular pela primeira vez
  const countRow = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM memories');
  if (countRow && countRow.count === 0) {
    // Inserir memórias iniciais
    for (const mem of INITIAL_MEMORIES) {
      db.runSync(
        `INSERT INTO memories (id, title, description, date, photo_uri, category, is_favorite, location, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mem.id,
          mem.title,
          mem.description,
          mem.date,
          mem.photoUri || null,
          mem.category,
          mem.isFavorite ? 1 : 0,
          mem.location || null,
          mem.createdAt,
        ]
      );
    }
  }

  // Verificar se há cápsulas para popular pela primeira vez
  const capsuleCountRow = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM capsules');
  if (capsuleCountRow && capsuleCountRow.count === 0) {
    for (const cap of INITIAL_CAPSULES) {
      db.runSync(
        `INSERT INTO capsules (id, title, subtitle, content, quote, author_note, unlock_date, is_opened, category, icon, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cap.id,
          cap.title,
          cap.subtitle,
          cap.content,
          cap.quote || null,
          cap.authorNote || null,
          cap.unlockDate || null,
          cap.isOpened ? 1 : 0,
          cap.category,
          cap.icon,
          cap.createdAt,
        ]
      );
    }
  }
}

// ---------------- MEMÓRIAS ---------------- //

export function getMemories(category?: string, search?: string): Memory[] {
  const db = getDatabase();
  let query = 'SELECT * FROM memories WHERE 1=1';
  const params: (string | number)[] = [];

  if (category && category !== 'Todas') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search && search.trim().length > 0) {
    query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY is_favorite DESC, date DESC, created_at DESC';

  const rows = db.getAllSync<any>(query, params);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    photoUri: row.photo_uri || undefined,
    category: row.category,
    isFavorite: Boolean(row.is_favorite),
    location: row.location || undefined,
    createdAt: row.created_at,
  }));
}

export function getMemoryById(id: string): Memory | null {
  const db = getDatabase();
  const row = db.getFirstSync<any>('SELECT * FROM memories WHERE id = ?', [id]);
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    photoUri: row.photo_uri || undefined,
    category: row.category,
    isFavorite: Boolean(row.is_favorite),
    location: row.location || undefined,
    createdAt: row.created_at,
  };
}

export function saveMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Memory {
  const db = getDatabase();
  const id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const createdAt = Date.now();

  db.runSync(
    `INSERT INTO memories (id, title, description, date, photo_uri, category, is_favorite, location, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      memory.title,
      memory.description,
      memory.date,
      memory.photoUri || null,
      memory.category,
      memory.isFavorite ? 1 : 0,
      memory.location || null,
      createdAt,
    ]
  );

  return {
    ...memory,
    id,
    createdAt,
  };
}

export function updateMemory(memory: Memory): void {
  const db = getDatabase();
  db.runSync(
    `UPDATE memories 
     SET title = ?, description = ?, date = ?, photo_uri = ?, category = ?, is_favorite = ?, location = ?
     WHERE id = ?`,
    [
      memory.title,
      memory.description,
      memory.date,
      memory.photoUri || null,
      memory.category,
      memory.isFavorite ? 1 : 0,
      memory.location || null,
      memory.id,
    ]
  );
}

export function toggleFavoriteMemory(id: string): boolean {
  const db = getDatabase();
  const row = db.getFirstSync<any>('SELECT is_favorite FROM memories WHERE id = ?', [id]);
  if (!row) return false;

  const nextVal = row.is_favorite ? 0 : 1;
  db.runSync('UPDATE memories SET is_favorite = ? WHERE id = ?', [nextVal, id]);
  return Boolean(nextVal);
}

export function deleteMemory(id: string): void {
  const db = getDatabase();
  db.runSync('DELETE FROM memories WHERE id = ?', [id]);
}

// ---------------- CÁPSULAS ---------------- //

export function getCapsules(): Capsule[] {
  const db = getDatabase();
  const rows = db.getAllSync<any>('SELECT * FROM capsules ORDER BY created_at ASC');
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    content: row.content,
    quote: row.quote || undefined,
    authorNote: row.author_note || undefined,
    unlockDate: row.unlock_date || undefined,
    isOpened: Boolean(row.is_opened),
    category: row.category,
    icon: row.icon,
    createdAt: row.created_at,
  }));
}

export function getCapsuleById(id: string): Capsule | null {
  const db = getDatabase();
  const row = db.getFirstSync<any>('SELECT * FROM capsules WHERE id = ?', [id]);
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    content: row.content,
    quote: row.quote || undefined,
    authorNote: row.author_note || undefined,
    unlockDate: row.unlock_date || undefined,
    isOpened: Boolean(row.is_opened),
    category: row.category,
    icon: row.icon,
    createdAt: row.created_at,
  };
}

export function markCapsuleOpened(id: string): void {
  const db = getDatabase();
  db.runSync('UPDATE capsules SET is_opened = 1 WHERE id = ?', [id]);
}

// ---------------- BACKUP & RESTAURAÇÃO ---------------- //

export function getAllDataForBackup(): { memories: Memory[]; capsules: Capsule[] } {
  return {
    memories: getMemories('Todas'),
    capsules: getCapsules(),
  };
}

export function restoreDataFromBackup(memories: Memory[], capsules: Capsule[]): void {
  const db = getDatabase();

  db.execSync('BEGIN TRANSACTION;');
  try {
    db.runSync('DELETE FROM memories;');
    db.runSync('DELETE FROM capsules;');

    for (const mem of memories) {
      db.runSync(
        `INSERT INTO memories (id, title, description, date, photo_uri, category, is_favorite, location, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mem.id,
          mem.title,
          mem.description,
          mem.date,
          mem.photoUri || null,
          mem.category,
          mem.isFavorite ? 1 : 0,
          mem.location || null,
          mem.createdAt || Date.now(),
        ]
      );
    }

    for (const cap of capsules) {
      db.runSync(
        `INSERT INTO capsules (id, title, subtitle, content, quote, author_note, unlock_date, is_opened, category, icon, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cap.id,
          cap.title,
          cap.subtitle,
          cap.content,
          cap.quote || null,
          cap.authorNote || null,
          cap.unlockDate || null,
          cap.isOpened ? 1 : 0,
          cap.category,
          cap.icon,
          cap.createdAt || Date.now(),
        ]
      );
    }

    db.execSync('COMMIT;');
  } catch (error) {
    db.execSync('ROLLBACK;');
    throw error;
  }
}
