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

export interface GalleryPhoto {
  id: string;
  uri: string;
  caption?: string;
  date: string;        // YYYY-MM-DD
  createdAt: number;
}

export interface Poem {
  id: string;
  title: string;
  date: string;        // YYYY-MM-DD
  content: string;
  authorNote?: string;
  tags?: string[];
  isOriginal: boolean;
  createdAt: number;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  category: 'espiritual' | 'afeto' | 'superacao' | 'conquista';
}

export interface ChatMessageItem {
  sender: 'Ele' | 'Ela' | string;
  time: string;
  text: string;
}

export interface ConversationSnippet {
  id: string;
  number: number;
  title: string;
  date: string;
  context: string;
  messages: ChatMessageItem[];
  leaderNote?: string;
  tags?: string[];
}

export interface BackupPhotoFile {
  filename: string;
  base64Data: string;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  appName: string;
  memories: Memory[];
  capsules: Capsule[];
  notes: Note[];
  gallery?: GalleryPhoto[];
  poems?: Poem[];
  photosFiles?: BackupPhotoFile[];
}
