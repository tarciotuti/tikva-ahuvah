import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Animated,
  TextInput,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { COLORS } from '../constants/theme';
import { YOU_ARE_ITEMS, YouAreItem } from '../data/youAreData';
import { getSavedSlideshowTrackId, getTrackById } from '../services/audio';

type ViewMode = 'card' | 'list';

function setAudioPlayerLoop(p: any, loop: boolean) {
  try {
    p.loop = loop;
  } catch (err) {
    console.warn('Erro ao configurar loop de áudio:', err);
  }
}

export default function YouAreScreen() {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['tikva_sheli', 'tikva_ahuvah']));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Animação de transição suave do cartão
  const [cardOpacity] = useState(() => new Animated.Value(1));
  const [cardScale] = useState(() => new Animated.Value(1));

  // Áudio de fundo suave
  const trackId = getSavedSlideshowTrackId();
  const track = getTrackById(trackId);
  const player = useAudioPlayer(track.asset);

  useEffect(() => {
    setAudioPlayerLoop(player, true);
    return () => {
      try {
        player.pause();
      } catch {}
    };
  }, [player]);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      player.pause();
      setIsPlayingAudio(false);
    } else {
      player.play();
      setIsPlayingAudio(true);
    }
  };

  const currentItem: YouAreItem = YOU_ARE_ITEMS[currentIndex] || YOU_ARE_ITEMS[0];

  const animateCardTransition = (newIndex: number) => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.94,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(newIndex);
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % YOU_ARE_ITEMS.length;
    animateCardTransition(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + YOU_ARE_ITEMS.length) % YOU_ARE_ITEMS.length;
    animateCardTransition(prevIdx);
  };

  const handleRandom = () => {
    let nextIdx = Math.floor(Math.random() * YOU_ARE_ITEMS.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % YOU_ARE_ITEMS.length;
    }
    animateCardTransition(nextIdx);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleShare = async (item: YouAreItem) => {
    try {
      let message = `🌿 *Você para mim é: ${item.keyword}*\n`;
      if (item.hebrew) {
        message += `(${item.hebrew} • ${item.hebrewTranslit})\n`;
      }
      message += `\n"${item.declaration}"\n\n${item.text}\n`;
      if (item.verse) {
        message += `\n📖 _${item.verse}_\n`;
      }
      message += `\n— Com todo o meu amor, Tárcio Tuti • Tikva Ahuvah`;

      await Share.share({ message });
    } catch (e) {
      console.warn('Erro ao compartilhar:', e);
    }
  };

  // Categorias únicas para filtro na lista
  const categories = useMemo(() => {
    return ['Todas', 'HEBRAICO', 'PROPÓSITO', 'CUIDADO', 'AFETO', 'ADMIRAÇÃO', 'FÉ', 'Favoritas'];
  }, []);

  const filteredItems = useMemo(() => {
    return YOU_ARE_ITEMS.filter((item) => {
      const matchesSearch =
        item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.declaration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.hebrewTranslit && item.hebrewTranslit.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory === 'Favoritas') {
        matchesCat = favorites.has(item.id);
      } else if (selectedCategory !== 'Todas') {
        matchesCat = item.badge === selectedCategory;
      }

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory, favorites]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Barra Superior Personalizada */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitleCenter}>
          <Text style={styles.headerSup}>PALAVRAS DO CORAÇÃO</Text>
          <Text style={styles.headerTitle}>Você Para Mim 🌿</Text>
        </View>

        <TouchableOpacity
          style={[styles.audioButton, isPlayingAudio && styles.audioButtonActive]}
          onPress={toggleAudio}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPlayingAudio ? 'musical-notes' : 'musical-note-outline'}
            size={18}
            color={isPlayingAudio ? COLORS.white : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Alternador de Modo: Cartão Mágico vs. Coleção Completa */}
      <View style={styles.modeTabsWrapper}>
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, viewMode === 'card' && styles.modeTabActive]}
            onPress={() => setViewMode('card')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="sparkles"
              size={15}
              color={viewMode === 'card' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                viewMode === 'card' && styles.modeTabTextActive,
              ]}
            >
              Revelação
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, viewMode === 'list' && styles.modeTabActive]}
            onPress={() => setViewMode('list')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="grid"
              size={15}
              color={viewMode === 'list' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                viewMode === 'list' && styles.modeTabTextActive,
              ]}
            >
              Todas ({YOU_ARE_ITEMS.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO PRINCIPAL: MODO CARTÃO */}
      {viewMode === 'card' && (
        <ScrollView
          contentContainerStyle={styles.cardModeScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Cartão de Destaque com Moldura Nobre */}
          <Animated.View
            style={[
              styles.luxuryCard,
              {
                opacity: cardOpacity,
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            {/* Topo do Cartão: Badges e Favorito */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.badgesContainer}>
                <View style={[styles.categoryBadge, { backgroundColor: currentItem.bg }]}>
                  <Text style={[styles.categoryBadgeText, { color: currentItem.color }]}>
                    {currentItem.badge}
                  </Text>
                </View>
                {currentItem.hebrew && (
                  <View style={styles.hebrewPill}>
                    <Text style={styles.hebrewPillText}>{currentItem.hebrew}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => toggleFavorite(currentItem.id)}
                activeOpacity={0.7}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={favorites.has(currentItem.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={favorites.has(currentItem.id) ? COLORS.ruby : COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Ícone Central Nobre */}
            <View style={[styles.iconCircle, { backgroundColor: currentItem.bg }]}>
              <Ionicons name={currentItem.icon as any} size={36} color={currentItem.color} />
            </View>

            {/* Invocação */}
            <Text style={styles.preambleText}>Você é para mim...</Text>
            <Text style={styles.keywordTitle}>{currentItem.keyword}</Text>

            {currentItem.hebrewTranslit && (
              <Text style={styles.translitSubtitle}>
                {`"${currentItem.hebrewTranslit}"`}
              </Text>
            )}

            <View style={styles.dividerLine} />

            {/* Declaração Principal */}
            <Text style={styles.declarationQuote}>
              {`"${currentItem.declaration}"`}
            </Text>

            {/* Texto de Reflexão Fundamentado nas Conversas */}
            <Text style={styles.reflectionParagraph}>
              {currentItem.text}
            </Text>

            {/* Versículo de Inspiração se houver */}
            {currentItem.verse && (
              <View style={styles.verseBadge}>
                <Ionicons name="book-outline" size={13} color={COLORS.gold} />
                <Text style={styles.verseBadgeText}>{currentItem.verse}</Text>
              </View>
            )}

            {/* Barra Inferior do Cartão com Ações */}
            <View style={styles.cardFooterActions}>
              <TouchableOpacity
                style={styles.shareCardButton}
                onPress={() => handleShare(currentItem)}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={17} color={COLORS.primary} />
                <Text style={styles.shareCardButtonText}>Enviar com Amor</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Navegação Entre as Declarações */}
          <View style={styles.cardControlsRow}>
            <TouchableOpacity
              style={styles.navArrowButton}
              onPress={handlePrev}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.randomActionButton}
              onPress={handleRandom}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={18} color={COLORS.white} />
              <Text style={styles.randomActionButtonText}>Surpreenda-me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navArrowButton}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Contador de Revelações */}
          <Text style={styles.counterText}>
            {currentIndex + 1} de {YOU_ARE_ITEMS.length} declarações de carinho
          </Text>
        </ScrollView>
      )}

      {/* CONTEÚDO PRINCIPAL: MODO LISTA / MOSAICO */}
      {viewMode === 'list' && (
        <View style={styles.listContainer}>
          {/* Campo de Busca */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por palavra ou sentimento..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filtros em Pílula */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFiltersScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterPill,
                  selectedCategory === cat && styles.filterPillActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedCategory === cat && styles.filterPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Lista de Declarações */}
          <ScrollView
            contentContainerStyle={styles.listScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredItems.map((item) => {
              const isFav = favorites.has(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.listItemCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    const idx = YOU_ARE_ITEMS.findIndex((x) => x.id === item.id);
                    if (idx >= 0) {
                      setCurrentIndex(idx);
                      setViewMode('card');
                    }
                  }}
                >
                  <View style={styles.listItemTop}>
                    <View style={[styles.listItemIconWrapper, { backgroundColor: item.bg }]}>
                      <Ionicons name={item.icon as any} size={20} color={item.color} />
                    </View>
                    <View style={styles.listItemInfo}>
                      <View style={styles.listItemRow}>
                        <Text style={styles.listItemKeyword}>{item.keyword}</Text>
                        {item.hebrew && (
                          <Text style={styles.listItemHebrew}>{item.hebrew}</Text>
                        )}
                      </View>
                      <Text style={styles.listItemDeclaration} numberOfLines={2}>
                        {item.declaration}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleFavorite(item.id)}
                      style={{ padding: 6 }}
                    >
                      <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isFav ? COLORS.ruby : '#B0B8B2'}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.listItemSnippet} numberOfLines={3}>
                    {item.text}
                  </Text>

                  <View style={styles.listItemFooter}>
                    <View style={[styles.listCategoryBadge, { backgroundColor: item.bg }]}>
                      <Text style={[styles.listCategoryBadgeText, { color: item.color }]}>
                        {item.badge}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.quickShareBtn}
                      onPress={() => handleShare(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="share-social-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.quickShareBtnText}>Compartilhar</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}

            {filteredItems.length === 0 && (
              <View style={styles.emptyList}>
                <Ionicons name="heart-dislike-outline" size={44} color={COLORS.textMuted} />
                <Text style={styles.emptyListText}>Nenhuma declaração encontrada</Text>
              </View>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCenter: {
    alignItems: 'center',
  },
  headerSup: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '800',
    color: COLORS.gold,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeTabsWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#ECEAE4',
    borderRadius: 14,
    padding: 3,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  modeTabTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  cardModeScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  luxuryCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 24,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#E8DFCE',
    alignItems: 'center',
    shadowColor: '#173B2C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  hebrewPill: {
    backgroundColor: '#F5EFE0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2D4B9',
  },
  hebrewPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A6014',
  },
  favoriteButton: {
    padding: 4,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  preambleText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  keywordTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  translitSubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.gold,
    fontWeight: '600',
    marginTop: 4,
  },
  dividerLine: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.gold,
    opacity: 0.4,
    marginVertical: 18,
    borderRadius: 1,
  },
  declarationQuote: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  reflectionParagraph: {
    fontSize: 14,
    color: '#43544C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  verseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9F5EC',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8DECC',
    marginBottom: 18,
  },
  verseBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
  },
  cardFooterActions: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignItems: 'center',
  },
  shareCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF5F1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  shareCardButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cardControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
    width: '100%',
  },
  navArrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  randomActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 26,
    shadowColor: '#173B2C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  randomActionButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.4,
  },
  counterText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 18,
  },
  listContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  categoryFiltersScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  filterPillTextActive: {
    color: COLORS.white,
  },
  listScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    gap: 12,
  },
  listItemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  listItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  listItemIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemInfo: {
    flex: 1,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemKeyword: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  listItemHebrew: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gold,
  },
  listItemDeclaration: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  listItemSnippet: {
    fontSize: 12.5,
    color: '#55655E',
    lineHeight: 18,
    marginBottom: 10,
  },
  listItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
  },
  listCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  listCategoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  quickShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F7F4',
  },
  quickShareBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyListText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
