import { getDatabase } from './database';

export interface AudioTrack {
  id: string;
  shortName: string;
  title: string;
  subtitle: string;
  duration: string;
  isLoop: boolean;
  asset: any;
}

export const SOUNDTRACKS: AudioTrack[] = [
  {
    id: 'piano_oracao',
    shortName: 'Piano de Oração',
    title: 'Piano de Oração (Primeira Essência)',
    subtitle: 'Fundo suave de piano para oração e reflexão (Padrão)',
    duration: '7:26',
    isLoop: true,
    asset: require('../../assets/audio/piano_oracao.mp3'),
  },
  {
    id: 'fundo_worship',
    shortName: 'Fundo Worship',
    title: 'Fundo Worship Piano',
    subtitle: 'Instrumental worship suave em loop contínuo',
    duration: '3:00',
    isLoop: true,
    asset: require('../../assets/audio/fundo_worship.mp3'),
  },
  {
    id: 'musica_primeira_essencia',
    shortName: 'Música Cantada',
    title: 'Primeira Essência (Anderson Freire)',
    subtitle: 'Música completa com voz e letra edificante',
    duration: '4:36',
    isLoop: false,
    asset: require('../../assets/audio/musica_primeira_essencia.mp3'),
  },
];

export const DEFAULT_TRACK_ID = 'piano_oracao';

export function getSavedSlideshowTrackId(): string {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<{ value: string }>(
      "SELECT value FROM app_settings WHERE key = 'slideshow_soundtrack'"
    );
    if (row && row.value) {
      const exists = SOUNDTRACKS.some((t) => t.id === row.value);
      if (exists) return row.value;
    }
  } catch (err) {
    console.warn('Erro ao ler trilha sonora configurada:', err);
  }
  return DEFAULT_TRACK_ID;
}

export function saveSlideshowTrackId(trackId: string): void {
  try {
    const db = getDatabase();
    db.runSync(
      "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('slideshow_soundtrack', ?)",
      [trackId]
    );
  } catch (err) {
    console.error('Erro ao salvar trilha sonora:', err);
  }
}

export function isSlideshowMusicEnabled(): boolean {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<{ value: string }>(
      "SELECT value FROM app_settings WHERE key = 'slideshow_music_enabled'"
    );
    if (row) {
      return row.value !== 'false';
    }
  } catch (err) {
    console.warn('Erro ao ler preferência de música:', err);
  }
  return true;
}

export function setSlideshowMusicEnabled(enabled: boolean): void {
  try {
    const db = getDatabase();
    db.runSync(
      "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('slideshow_music_enabled', ?)",
      [enabled ? 'true' : 'false']
    );
  } catch (err) {
    console.error('Erro ao salvar preferência de música:', err);
  }
}

// ---------------- VELOCIDADE DO SLIDESHOW ---------------- //

export interface SlideshowSpeedOption {
  ms: number;
  label: string;
  desc: string;
}

export const SLIDESHOW_SPEED_OPTIONS: SlideshowSpeedOption[] = [
  { ms: 2500, label: 'Rápido (2.5s)', desc: 'Transições dinâmicas' },
  { ms: 4000, label: 'Normal (4.0s)', desc: 'Ritmo equilibrado (Padrão)' },
  { ms: 6000, label: 'Suave (6.0s)', desc: 'Apreciação tranquila' },
  { ms: 8000, label: 'Contemplativo (8.0s)', desc: 'Ideal para oração e reflexão' },
];

export const DEFAULT_SLIDESHOW_SPEED = 4000;

export function getSlideshowSpeed(): number {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<{ value: string }>(
      "SELECT value FROM app_settings WHERE key = 'slideshow_speed_ms'"
    );
    if (row && row.value) {
      const parsed = parseInt(row.value, 10);
      if (!isNaN(parsed) && parsed >= 2000) return parsed;
    }
  } catch (err) {
    console.warn('Erro ao ler velocidade do slideshow:', err);
  }
  return DEFAULT_SLIDESHOW_SPEED;
}

export function saveSlideshowSpeed(speedMs: number): void {
  try {
    const db = getDatabase();
    db.runSync(
      "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('slideshow_speed_ms', ?)",
      [String(speedMs)]
    );
  } catch (err) {
    console.error('Erro ao salvar velocidade do slideshow:', err);
  }
}

export function getTrackById(trackId: string): AudioTrack {
  const track = SOUNDTRACKS.find((t) => t.id === trackId);
  return track || SOUNDTRACKS[0];
}
