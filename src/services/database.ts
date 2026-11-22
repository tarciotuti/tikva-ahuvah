import * as SQLite from 'expo-sqlite';
import { Memory, Capsule, Note, GalleryPhoto, Poem } from '../types';
import { INITIAL_MEMORIES, INITIAL_CAPSULES, INITIAL_NOTES } from '../data/initialData';
import { INITIAL_POEMS } from '../data/initialPoems';

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

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      scripture TEXT,
      speaker TEXT,
      content TEXT NOT NULL,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gallery_photos (
      id TEXT PRIMARY KEY NOT NULL,
      uri TEXT NOT NULL,
      caption TEXT,
      date TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS poems (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      author_note TEXT,
      tags TEXT,
      is_original INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  // Popular memórias se vazias
  const countRow = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM memories');
  if (countRow && countRow.count === 0) {
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

  // Sincronizar ou popular cápsulas se faltar alguma
  for (const cap of INITIAL_CAPSULES) {
    const exists = db.getFirstSync<{ id: string }>('SELECT id FROM capsules WHERE id = ?', [cap.id]);
    if (!exists) {
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

  // Popular notas/pregações se vazias
  const notesCountRow = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM notes');
  if (notesCountRow && notesCountRow.count === 0) {
    for (const note of INITIAL_NOTES) {
      db.runSync(
        `INSERT INTO notes (id, title, type, scripture, speaker, content, is_favorite, date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          note.id,
          note.title,
          note.type,
          note.scripture || null,
          note.speaker || null,
          note.content,
          note.isFavorite ? 1 : 0,
          note.date,
          note.createdAt,
        ]
      );
    }
  }

  // Sincronizar ou popular poemas se faltar algum
  for (const poem of INITIAL_POEMS) {
    const exists = db.getFirstSync<{ id: string }>('SELECT id FROM poems WHERE id = ?', [poem.id]);
    if (!exists) {
      db.runSync(
        `INSERT INTO poems (id, title, date, content, author_note, tags, is_original, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          poem.id,
          poem.title,
          poem.date,
          poem.content,
          poem.authorNote || null,
          poem.tags ? JSON.stringify(poem.tags) : null,
          poem.isOriginal ? 1 : 0,
          poem.createdAt,
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

// ---------------- NOTAS & PREGAÇÕES ---------------- //

export function getNotes(type?: string, search?: string): Note[] {
  const db = getDatabase();
  let query = 'SELECT * FROM notes WHERE 1=1';
  const params: (string | number)[] = [];

  if (type && type !== 'todas') {
    query += ' AND type = ?';
    params.push(type);
  }

  if (search && search.trim().length > 0) {
    query += ' AND (title LIKE ? OR content LIKE ? OR scripture LIKE ? OR speaker LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term);
  }

  query += ' ORDER BY is_favorite DESC, date DESC, created_at DESC';

  const rows = db.getAllSync<any>(query, params);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    scripture: row.scripture || undefined,
    speaker: row.speaker || undefined,
    content: row.content,
    isFavorite: Boolean(row.is_favorite),
    date: row.date,
    createdAt: row.created_at,
  }));
}

export function getNoteById(id: string): Note | null {
  const db = getDatabase();
  const row = db.getFirstSync<any>('SELECT * FROM notes WHERE id = ?', [id]);
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    type: row.type,
    scripture: row.scripture || undefined,
    speaker: row.speaker || undefined,
    content: row.content,
    isFavorite: Boolean(row.is_favorite),
    date: row.date,
    createdAt: row.created_at,
  };
}

export function saveNote(note: Omit<Note, 'id' | 'createdAt'>): Note {
  const db = getDatabase();
  const id = 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const createdAt = Date.now();

  db.runSync(
    `INSERT INTO notes (id, title, type, scripture, speaker, content, is_favorite, date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      note.title,
      note.type,
      note.scripture || null,
      note.speaker || null,
      note.content,
      note.isFavorite ? 1 : 0,
      note.date,
      createdAt,
    ]
  );

  return {
    ...note,
    id,
    createdAt,
  };
}

export function updateNote(note: Note): void {
  const db = getDatabase();
  db.runSync(
    `UPDATE notes 
     SET title = ?, type = ?, scripture = ?, speaker = ?, content = ?, is_favorite = ?, date = ?
     WHERE id = ?`,
    [
      note.title,
      note.type,
      note.scripture || null,
      note.speaker || null,
      note.content,
      note.isFavorite ? 1 : 0,
      note.date,
      note.id,
    ]
  );
}

export function toggleFavoriteNote(id: string): boolean {
  const db = getDatabase();
  const row = db.getFirstSync<any>('SELECT is_favorite FROM notes WHERE id = ?', [id]);
  if (!row) return false;

  const nextVal = row.is_favorite ? 0 : 1;
  db.runSync('UPDATE notes SET is_favorite = ? WHERE id = ?', [nextVal, id]);
  return Boolean(nextVal);
}

export function deleteNote(id: string): void {
  const db = getDatabase();
  db.runSync('DELETE FROM notes WHERE id = ?', [id]);
}

// ---------------- GALERIA DE FOTOS ---------------- //

export function getGalleryPhotos(): GalleryPhoto[] {
  const db = getDatabase();
  const rows = db.getAllSync<any>(
    'SELECT * FROM gallery_photos ORDER BY date DESC, created_at DESC'
  );
  return rows.map((row) => ({
    id: row.id,
    uri: row.uri,
    caption: row.caption || '',
    date: row.date,
    createdAt: row.created_at,
  }));
}

export function saveGalleryPhoto(photo: {
  id?: string;
  uri: string;
  caption?: string;
  date?: string;
  createdAt?: number;
}): GalleryPhoto {
  const db = getDatabase();
  const id = photo.id || `gal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const date = photo.date || new Date().toISOString().slice(0, 10);
  const createdAt = photo.createdAt || Date.now();
  const caption = photo.caption || '';

  db.runSync(
    `INSERT INTO gallery_photos (id, uri, caption, date, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, photo.uri, caption, date, createdAt]
  );

  return {
    id,
    uri: photo.uri,
    caption,
    date,
    createdAt,
  };
}

export function updateGalleryPhotoCaption(id: string, caption: string): void {
  const db = getDatabase();
  db.runSync('UPDATE gallery_photos SET caption = ? WHERE id = ?', [caption, id]);
}

export function deleteGalleryPhoto(id: string): void {
  const db = getDatabase();
  db.runSync('DELETE FROM gallery_photos WHERE id = ?', [id]);
}

// ---------------- POEMAS & REFLEXÕES ---------------- //

interface PoemRow {
  id: string;
  title: string;
  date: string;
  content: string;
  author_note: string | null;
  tags: string | null;
  is_original: number;
  created_at: number;
}

function mapPoemRow(row: PoemRow): Poem {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    content: row.content,
    authorNote: row.author_note || undefined,
    tags: row.tags ? JSON.parse(row.tags) : undefined,
    isOriginal: row.is_original === 1,
    createdAt: row.created_at,
  };
}

export function getPoems(search?: string): Poem[] {
  const db = getDatabase();
  let query = 'SELECT * FROM poems WHERE 1=1';
  const params: string[] = [];

  if (search) {
    query += ' AND (title LIKE ? OR content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const rows = db.getAllSync<PoemRow>(query, params);
  return rows.map(mapPoemRow);
}

export function getPoemById(id: string): Poem | null {
  const db = getDatabase();
  const row = db.getFirstSync<PoemRow>('SELECT * FROM poems WHERE id = ?', [id]);
  return row ? mapPoemRow(row) : null;
}

export function insertPoem(poem: Poem): void {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO poems (id, title, date, content, author_note, tags, is_original, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      poem.id,
      poem.title,
      poem.date,
      poem.content,
      poem.authorNote || null,
      poem.tags ? JSON.stringify(poem.tags) : null,
      poem.isOriginal ? 1 : 0,
      poem.createdAt || Date.now(),
    ]
  );
}

export function updatePoem(poem: Poem): void {
  const db = getDatabase();
  db.runSync(
    `UPDATE poems SET title = ?, date = ?, content = ?, author_note = ?, tags = ?, is_original = ?
     WHERE id = ?`,
    [
      poem.title,
      poem.date,
      poem.content,
      poem.authorNote || null,
      poem.tags ? JSON.stringify(poem.tags) : null,
      poem.isOriginal ? 1 : 0,
      poem.id,
    ]
  );
}

export function deletePoem(id: string): void {
  const db = getDatabase();
  db.runSync('DELETE FROM poems WHERE id = ?', [id]);
}

// ---------------- BACKUP & RESTAURAÇÃO ---------------- //

export function getAllDataForBackup(): {
  memories: Memory[];
  capsules: Capsule[];
  notes: Note[];
  gallery: GalleryPhoto[];
  poems: Poem[];
} {
  return {
    memories: getMemories('Todas'),
    capsules: getCapsules(),
    notes: getNotes('todas'),
    gallery: getGalleryPhotos(),
    poems: getPoems(),
  };
}

export function restoreDataFromBackup(
  memories: Memory[],
  capsules: Capsule[],
  notes: Note[] = [],
  gallery: GalleryPhoto[] = [],
  poems: Poem[] = []
): void {
  const db = getDatabase();

  db.execSync('BEGIN TRANSACTION;');
  try {
    db.runSync('DELETE FROM memories;');
    db.runSync('DELETE FROM capsules;');
    db.runSync('DELETE FROM notes;');
    db.runSync('DELETE FROM gallery_photos;');
    db.runSync('DELETE FROM poems;');

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

    for (const note of notes) {
      db.runSync(
        `INSERT INTO notes (id, title, type, scripture, speaker, content, is_favorite, date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          note.id,
          note.title,
          note.type,
          note.scripture || null,
          note.speaker || null,
          note.content,
          note.isFavorite ? 1 : 0,
          note.date,
          note.createdAt || Date.now(),
        ]
      );
    }

    for (const item of gallery) {
      db.runSync(
        `INSERT INTO gallery_photos (id, uri, caption, date, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          item.id,
          item.uri,
          item.caption || null,
          item.date,
          item.createdAt || Date.now(),
        ]
      );
    }

    for (const p of poems) {
      db.runSync(
        `INSERT INTO poems (id, title, date, content, author_note, tags, is_original, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.title,
          p.date,
          p.content,
          p.authorNote || null,
          p.tags ? JSON.stringify(p.tags) : null,
          p.isOriginal ? 1 : 0,
          p.createdAt || Date.now(),
        ]
      );
    }

    db.execSync('COMMIT;');
  } catch (error) {
    db.execSync('ROLLBACK;');
    throw error;
  }
}
