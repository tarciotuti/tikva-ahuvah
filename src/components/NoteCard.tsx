import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../types';
import { COLORS } from '../constants/theme';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onToggleFavorite }) => {
  const getTypeBadge = () => {
    switch (note.type) {
      case 'pregacao':
        return { label: 'Pregação', icon: 'book', color: COLORS.primary, bg: COLORS.primaryLight };
      case 'devocional':
        return { label: 'Devocional', icon: 'heart', color: COLORS.ruby, bg: COLORS.rubyLight };
      case 'estudo':
        return { label: 'Estudo', icon: 'school', color: COLORS.gold, bg: COLORS.goldLight };
      default:
        return { label: 'Anotação', icon: 'create', color: COLORS.primaryMedium, bg: COLORS.surfaceSubtle };
    }
  };

  const badge = getTypeBadge();

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Ionicons name={badge.icon as any} size={12} color={badge.color} />
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
        </View>

        <View style={styles.rightActions}>
          <Text style={styles.dateText}>{note.date}</Text>
          <TouchableOpacity
            style={styles.favButton}
            activeOpacity={0.7}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={note.isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={note.isFavorite ? COLORS.ruby : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {note.title}
      </Text>

      {/* Passagem Bíblica & Pregador */}
      {(note.scripture || note.speaker) && (
        <View style={styles.metaRow}>
          {note.scripture && (
            <View style={styles.metaItem}>
              <Ionicons name="bookmark-outline" size={13} color={COLORS.primary} />
              <Text style={styles.scriptureText} numberOfLines={1}>
                {note.scripture}
              </Text>
            </View>
          )}

          {note.speaker && (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.speakerText} numberOfLines={1}>
                {note.speaker}
              </Text>
            </View>
          )}
        </View>
      )}

      <Text style={styles.contentSnippet} numberOfLines={3}>
        {note.content}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.readMoreText}>Ler anotação completa →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  favButton: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scriptureText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  speakerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  contentSnippet: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  readMoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
