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
  date: string; // YYYY-MM-DD or formatted
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
  unlockDate?: string; // Optional: can be locked until a date
  isOpened: boolean;
  category: 'dia_dificil' | 'confianca' | 'sorriso' | 'saudades' | 'futuro' | 'geral';
  icon: string;
  createdAt: number;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  appName: string;
  memories: Memory[];
  capsules: Capsule[];
}
