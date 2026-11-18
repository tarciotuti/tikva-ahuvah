import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NOTE_TYPES } from '../../constants/theme';
import { Note } from '../../types';
import { getNotes, toggleFavoriteNote } from '../../services/database';
import { NoteCard } from '../../components/NoteCard';
import { EmptyState } from '../../components/EmptyState';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedType, setSelectedType] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = useCallback(() => {
    try {
      const data = getNotes(selectedType, searchQuery);
      setNotes(data);
    } catch (error) {
      console.error('Erro ao carregar anotações:', error);
    }
  }, [selectedType, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteNote(id);
    loadData();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.subtitle}>FÉ, PREGAÇÕES & ESTUDOS</Text>
          <Text style={styles.title}>Meu Caderno 📖</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => router.push('/new-note')}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar pregações, versículos, temas..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tipos de Anotações */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeScroll}
      >
        {NOTE_TYPES.map((t) => {
          const isSelected = selectedType === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.7}
              onPress={() => setSelectedType(t.id)}
              style={[
                styles.typePill,
                isSelected ? styles.typePillSelected : styles.typePillDefault,
              ]}
            >
              <Ionicons
                name={t.icon as any}
                size={14}
                color={isSelected ? COLORS.white : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.typePillText,
                  isSelected ? styles.typePillTextSelected : styles.typePillTextDefault,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => router.push({ pathname: '/note/[id]', params: { id: item.id } })}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            title="Nenhuma anotação encontrada"
            description="Use o botão (+) no topo para anotar palavras que tocam o seu coração."
          />
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  typeScroll: {
    paddingVertical: 2,
    gap: 8,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  typePillDefault: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  typePillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typePillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  typePillTextDefault: {
    color: COLORS.textSecondary,
  },
  typePillTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
});
