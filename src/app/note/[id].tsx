import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Note } from '../../types';
import { getNoteById, toggleFavoriteNote, deleteNote } from '../../services/database';
import { useAlert } from '../../context/AlertContext';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(() => (id ? getNoteById(id) : null));
  const { showAlert } = useAlert();

  if (!note) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Anotação não encontrada.</Text>
          <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavoriteNote(note.id);
    setNote((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
  };

  const handleDelete = () => {
    showAlert({
      title: 'Apagar Anotação',
      message: 'Deseja remover esta anotação do seu caderno?',
      icon: 'trash',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => {
            deleteNote(note.id);
            router.back();
          },
        },
      ],
    });
  };

  const getTypeLabel = () => {
    switch (note.type) {
      case 'pregacao':
        return 'Pregação & Mensagem';
      case 'devocional':
        return 'Devocional Pessoal';
      case 'estudo':
        return 'Estudo Bíblico';
      default:
        return 'Anotação Livre';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.circleButton}
            activeOpacity={0.7}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={note.isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={note.isFavorite ? COLORS.ruby : COLORS.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleButton}
            activeOpacity={0.7}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Badge do Tipo */}
        <View style={styles.typeBadge}>
          <Ionicons name="book-outline" size={12} color={COLORS.primary} />
          <Text style={styles.typeBadgeText}>{getTypeLabel()}</Text>
        </View>

        {/* Título Principal */}
        <Text style={styles.title}>{note.title}</Text>

        {/* Passagem Bíblica em Destaque */}
        {note.scripture && (
          <View style={styles.scriptureCard}>
            <View style={styles.scriptureHeader}>
              <Ionicons name="bookmark" size={15} color={COLORS.gold} />
              <Text style={styles.scriptureLabel}>PASSAGEM BÍBLICA</Text>
            </View>
            <Text style={styles.scriptureText}>{note.scripture}</Text>
          </View>
        )}

        {/* Metadados (Pregador e Data) */}
        <View style={styles.metaRow}>
          {note.speaker && (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{note.speaker}</Text>
            </View>
          )}

          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{note.date}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Conteúdo Completo */}
        <Text style={styles.bodyContent}>{note.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 16,
  },
  scriptureCard: {
    backgroundColor: COLORS.goldLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.goldTint,
    marginBottom: 14,
  },
  scriptureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  scriptureLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 0.8,
  },
  scriptureText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 18,
  },
  bodyContent: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 27,
    letterSpacing: 0.2,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  backButtonSimple: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
