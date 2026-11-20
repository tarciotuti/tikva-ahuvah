import React, { useState, useCallback, useMemo } from 'react';
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
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Note } from '../../types';
import { getNotes, toggleFavoriteNote } from '../../services/database';
import { NoteCard } from '../../components/NoteCard';
import { EmptyState } from '../../components/EmptyState';
import { AppHeader } from '../../components/AppHeader';

interface CategoryConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bg: string;
}

const CATEGORY_BLOCKS: CategoryConfig[] = [
  {
    id: 'pregacao',
    title: 'Pregações & Cultos',
    subtitle: 'Mensagens dominicais, sermões e ensinamentos da igreja',
    icon: 'book',
    color: COLORS.primary,
    bg: COLORS.primaryLight,
  },
  {
    id: 'devocional',
    title: 'Devocionais da Manhã',
    subtitle: 'Momentos a sós com Deus, clamor matinal e orações',
    icon: 'heart',
    color: COLORS.ruby,
    bg: COLORS.rubyLight,
  },
  {
    id: 'estudo',
    title: 'Estudos Bíblicos',
    subtitle: 'Aprofundamento na Palavra, raízes hebraicas e teologia',
    icon: 'school',
    color: COLORS.gold,
    bg: COLORS.goldLight,
  },
  {
    id: 'geral',
    title: 'Pensamentos & Anotações',
    subtitle: 'Frases marcantes de livros, reflexões e registros livres',
    icon: 'create',
    color: COLORS.primaryMedium,
    bg: COLORS.surfaceSubtle,
  },
];

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  // activeView: 'categories' (ao entrar) | 'list' (ao escolher)
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = useCallback(() => {
    try {
      const data = getNotes(activeCategory || 'todas', searchQuery);
      setNotes(data);
    } catch (error) {
      console.error('Erro ao carregar anotações:', error);
    }
  }, [activeCategory, searchQuery]);

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

  // Contagem por categoria
  const categoryCounts = useMemo(() => {
    try {
      const all = getNotes('todas');
      return {
        all: all.length,
        pregacao: all.filter((n) => n.type === 'pregacao').length,
        devocional: all.filter((n) => n.type === 'devocional').length,
        estudo: all.filter((n) => n.type === 'estudo').length,
        geral: all.filter((n) => n.type === 'geral').length,
      };
    } catch {
      return { all: 0, pregacao: 0, devocional: 0, estudo: 0, geral: 0 };
    }
  }, []);

  const getActiveCategoryTitle = () => {
    if (!activeCategory || activeCategory === 'todas') return 'Todas as Anotações';
    const found = CATEGORY_BLOCKS.find((c) => c.id === activeCategory);
    return found ? found.title : 'Anotações';
  };

  return (
    <View style={styles.safeArea}>
      <AppHeader
        subtitle="Meu Caderno de Fé 📖"
        rightAction={{
          icon: 'add',
          onPress: () => router.push('/new-note'),
        }}
      />

      {/* TELA INICIAL: BLOCOS GRANDES DE CATEGORIAS */}
      {activeCategory === null ? (
        <ScrollView
          contentContainerStyle={styles.portalScrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          {/* Banner de Boas-Vindas ao Caderno */}
          <View style={styles.portalIntroBanner}>
            <Ionicons name="journal-outline" size={28} color={COLORS.gold} />
            <View style={styles.portalIntroText}>
              <Text style={styles.portalIntroTitle}>Meu Caderno Espiritual 🌿</Text>
              <Text style={styles.portalIntroSub}>
                Escolha a categoria que deseja ler ou registrar hoje:
              </Text>
            </View>
          </View>

          {/* Blocos Grandes de Categorias */}
          <View style={styles.categoryBlocksContainer}>
            {CATEGORY_BLOCKS.map((cat) => {
              const count = categoryCounts[cat.id as keyof typeof categoryCounts] || 0;

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.bigCategoryBlock}
                  activeOpacity={0.85}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <View style={[styles.blockIconWrapper, { backgroundColor: cat.bg }]}>
                    <Ionicons name={cat.icon as any} size={26} color={cat.color} />
                  </View>

                  <View style={styles.blockInfo}>
                    <View style={styles.blockTitleRow}>
                      <Text style={styles.blockTitle}>{cat.title}</Text>
                      <View style={styles.blockCountBadge}>
                        <Text style={styles.blockCountText}>
                          {count} {count === 1 ? 'nota' : 'notas'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.blockSubtitle}>{cat.subtitle}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Opção Final: Ver Todas as Anotações (Tudo) */}
          <TouchableOpacity
            style={styles.viewAllBlockBtn}
            activeOpacity={0.88}
            onPress={() => setActiveCategory('todas')}
          >
            <View style={styles.viewAllLeft}>
              <View style={styles.viewAllIconCircle}>
                <Ionicons name="layers" size={20} color={COLORS.white} />
              </View>
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.viewAllTitle}>Ver Todas as Anotações (Tudo)</Text>
                <Text style={styles.viewAllSub}>
                  Exibir todos os registros em ordem cronológica
                </Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </ScrollView>
      ) : (
        /* VISUALIZAÇÃO DA LISTA DE ANOTAÇÕES DA CATEGORIA ESCOLHIDA */
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {/* Botão Superior para Voltar às Categorias */}
              <TouchableOpacity
                style={styles.backToCategoriesBtn}
                activeOpacity={0.7}
                onPress={() => setActiveCategory(null)}
              >
                <Ionicons name="grid-outline" size={16} color={COLORS.primary} />
                <Text style={styles.backToCategoriesText}>← Todas as Categorias</Text>
              </TouchableOpacity>

              <View style={styles.activeCategoryHeading}>
                <Text style={styles.activeCategoryTitle}>{getActiveCategoryTitle()}</Text>
                <Text style={styles.activeCategoryCount}>
                  {notes.length} {notes.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                </Text>
              </View>

              {/* Barra de Pesquisa */}
              <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
                <TextInput
                  placeholder="Buscar palavras, versículos, pregações..."
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
            </View>
          }
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => router.push({ pathname: '/note/[id]', params: { id: item.id } })}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title={searchQuery ? 'Nenhum resultado encontrado' : 'Nenhuma anotação nesta categoria'}
              description={
                searchQuery
                  ? 'Tente buscar com outras palavras ou referências bíblicas.'
                  : 'Toque no botão de adicionar (+) para registrar sua primeira palavra ou oração.'
              }
              icon="journal-outline"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Portal das Categorias
  portalScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  portalIntroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  portalIntroText: {
    flex: 1,
    marginLeft: 14,
  },
  portalIntroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  portalIntroSub: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },

  categoryBlocksContainer: {
    gap: 12,
    marginBottom: 16,
  },
  bigCategoryBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  blockIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  blockCountBadge: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  blockCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  blockSubtitle: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },

  viewAllBlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.primaryTint,
    borderRadius: 20,
    padding: 16,
    marginTop: 4,
  },
  viewAllLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  viewAllIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  viewAllSub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Lista de Notas
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  listHeader: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  backToCategoriesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  backToCategoriesText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  activeCategoryHeading: {
    marginBottom: 12,
  },
  activeCategoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  activeCategoryCount: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },
});
