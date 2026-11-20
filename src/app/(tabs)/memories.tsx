import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, CATEGORIES } from '../../constants/theme';
import { Memory } from '../../types';
import { getMemories, toggleFavoriteMemory } from '../../services/database';
import { MemoryCard } from '../../components/MemoryCard';
import { CategoryPill } from '../../components/CategoryPill';
import { EmptyState } from '../../components/EmptyState';
import { AppHeader } from '../../components/AppHeader';

export default function MemoriesScreen() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = useCallback(() => {
    try {
      const data = getMemories(selectedCategory, searchQuery);
      setMemories(data);
    } catch (error) {
      console.error('Erro ao carregar memórias:', error);
    }
  }, [selectedCategory, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteMemory(id);
    loadData();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Barra de Pesquisa */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar lembranças, lugares, palavras..."
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

      {/* Filtro de Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.label}
            label={cat.label}
            icon={cat.icon}
            isSelected={selectedCategory === cat.label}
            onPress={() => setSelectedCategory(cat.label)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <AppHeader
        subtitle="Baú de Memórias ✨"
        icon="images"
        rightAction={{
          icon: 'add',
          onPress: () => router.push('/new-memory'),
        }}
      />
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoryCard
            memory={item}
            onPress={() => router.push({ pathname: '/memory/[id]', params: { id: item.id } })}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="images-outline"
            title="Nenhuma memória encontrada"
            description="Use o botão (+) no topo para adicionar novas fotos e momentos."
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
    </View>
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
  categoryScroll: {
    paddingVertical: 2,
  },
});
