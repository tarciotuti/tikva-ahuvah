export type Category = 
  | 'Todas'
  | 'Momentos Inesquecíveis'
  | 'Pequenas Alegrias'
  | 'Família & Afeto'
  | 'Conquistas'
  | 'Viagens & Aventuras';

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  photoUri?: string;
  category: Category | string;
  isFavorite: boolean;
  location?: string;
  createdAt: number;
}

export interface Capsule {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  quote?: string;
  authorNote?: string;
  unlockDate?: string;
  isOpened: boolean;
  category: 'dia_dificil' | 'confianca' | 'sorriso' | 'saudades' | 'futuro' | 'geral';
  icon: string;
  createdAt: number;
}

export type NoteType = 'pregacao' | 'devocional' | 'estudo' | 'geral';

export interface Note {
  id: string;
  title: string;
  type: NoteType;
  scripture?: string;  // Ex: "Isaías 40:29-31", "Salmos 23"
  speaker?: string;    // Pregador, Pastor, Professor ou Autor
  content: string;     // Anotações completas, pontos-chave
  isFavorite: boolean;
  date: string;        // YYYY-MM-DD
  createdAt: number;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  appName: string;
  memories: Memory[];
  capsules: Capsule[];
  notes: Note[];
}
