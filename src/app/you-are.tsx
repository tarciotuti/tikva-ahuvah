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
  Image,
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

function renderDeclarationContent(text: string, style: any) {
  if (text.includes('[me]')) {
    const parts = text.split('[me]');
    return (
      <Text style={style}>
        {`"${parts[0]}`}
        <Text style={{ fontStyle: 'italic', fontWeight: '900', color: COLORS.gold }}>[me]</Text>
        {`${parts[1]}"`}
      </Text>
    );
  }
  return <Text style={style}>{`"${text}"`}</Text>;
}

function renderListDeclarationContent(text: string, style: any) {
  if (text.includes('[me]')) {
    const parts = text.split('[me]');
    return (
      <Text style={style} numberOfLines={2}>
        {parts[0]}
        <Text style={{ fontStyle: 'italic', fontWeight: '900', color: COLORS.gold }}>[me]</Text>
        {parts[1]}
      </Text>
    );
  }
  return <Text style={style} numberOfLines={2}>{text}</Text>;
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
    return ['Todas', 'Nossas Mensagens 💬', 'Do Coração ❤️', 'HEBRAICO', 'PROPÓSITO', 'CUIDADO', 'AFETO', 'ADMIRAÇÃO', 'FÉ', 'Favoritas'];
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
      } else if (selectedCategory === 'Nossas Mensagens 💬') {
        matchesCat = item.source === 'mensagem';
      } else if (selectedCategory === 'Do Coração ❤️') {
        matchesCat = item.source === 'coracao';
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
        <View style={styles.cardModeContainer}>
          <ScrollView
            style={styles.cardScrollView}
            contentContainerStyle={styles.cardScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Apresentação Nobre e Orgânica (Sem borda de card rígida) */}
            <Animated.View
              style={[
                styles.borderlessCanvas,
                {
                  opacity: cardOpacity,
                  transform: [{ scale: cardScale }],
                },
              ]}
            >
              {/* Topo: Badges e Favorito */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.badgesContainer}>
                  <View style={[styles.categoryBadge, { backgroundColor: currentItem.bg }]}>
                    <Text style={[styles.categoryBadgeText, { color: currentItem.color }]}>
                      {currentItem.badge}
                    </Text>
                  </View>

                  {/* Badge de Origem: Nossas Mensagens vs Do Meu Coração */}
                  <View
                    style={[
                      styles.sourceBadge,
                      currentItem.source === 'mensagem' ? styles.sourceBadgeMsg : styles.sourceBadgeHeart,
                    ]}
                  >
                    <Ionicons
                      name={currentItem.source === 'mensagem' ? 'chatbubble-ellipses' : 'heart'}
                      size={11}
                      color={currentItem.source === 'mensagem' ? COLORS.primary : COLORS.ruby}
                    />
                    <Text
                      style={[
                        styles.sourceBadgeText,
                        { color: currentItem.source === 'mensagem' ? COLORS.primary : COLORS.ruby },
                      ]}
                    >
                      {currentItem.source === 'mensagem' ? 'Nossas Mensagens 💬' : 'Do Meu Coração ❤️'}
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
                    size={22}
                    color={favorites.has(currentItem.id) ? COLORS.ruby : COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Ícone Central Nobre */}
              <View style={styles.iconCircleWrapper}>
                <View style={[styles.iconCircle, { backgroundColor: currentItem.bg }]}>
                  <Ionicons name={currentItem.icon as any} size={36} color={currentItem.color} />
                </View>
              </View>

              {/* Invocação Poética */}
              <Text style={styles.preambleText}>Você é para mim...</Text>
              <Text style={styles.keywordTitle}>{currentItem.keyword}</Text>

              {currentItem.hebrewTranslit && (
                <Text style={styles.translitSubtitle}>
                  {`"${currentItem.hebrewTranslit}"`}
                </Text>
              )}

              {/* Ornamento Delicado */}
              <View style={styles.dividerOrnament}>
                <View style={styles.ornamentLine} />
                <Ionicons name="sparkles" size={13} color={COLORS.gold} />
                <View style={styles.ornamentLine} />
              </View>

              {/* Declaração Principal (com suporte a [me] em itálico) */}
              {renderDeclarationContent(currentItem.declaration, styles.declarationQuote)}

              {/* Foto Especial se houver (Ex: Beleza Real - 21/05/2026) */}
              {currentItem.imageAsset && (
                <View style={styles.cardImageContainer}>
                  <Image
                    source={currentItem.imageAsset}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cardImageCaptionPill}>
                    <Ionicons name="sparkles" size={12} color={COLORS.gold} />
                    <Text style={styles.cardImageCaptionText}>21 de Maio de 2026 • Beleza Real</Text>
                  </View>
                </View>
              )}

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

              {/* Botão de Ação: Enviar com Amor */}
              <TouchableOpacity
                style={styles.shareCardButton}
                onPress={() => handleShare(currentItem)}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={17} color={COLORS.primary} />
                <Text style={styles.shareCardButtonText}>Enviar com Amor</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>

          {/* BARRA FIXA INFERIOR: Não depende de scroll */}
          <View style={[styles.fixedBottomBar, { paddingBottom: Math.max(insets.bottom + 6, 14) }]}>
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
          </View>
        </View>
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

          {/* Filtros em Pílula (Design Fixo, Nítido e Confortável) */}
          <View style={styles.categoryFiltersContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryFiltersScroll}
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.filterPill,
                      isSelected && styles.filterPillActive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        isSelected && styles.filterPillTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

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
                      {renderListDeclarationContent(item.declaration, styles.listItemDeclaration)}
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
                    <View style={styles.listFooterLeft}>
                      <View style={[styles.listCategoryBadge, { backgroundColor: item.bg }]}>
                        <Text style={[styles.listCategoryBadgeText, { color: item.color }]}>
                          {item.badge}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.listSourceBadge,
                          item.source === 'mensagem' ? styles.sourceBadgeMsg : styles.sourceBadgeHeart,
                        ]}
                      >
                        <Ionicons
                          name={item.source === 'mensagem' ? 'chatbubble-ellipses' : 'heart'}
                          size={10}
                          color={item.source === 'mensagem' ? COLORS.primary : COLORS.ruby}
                        />
                        <Text
                          style={[
                            styles.listSourceBadgeText,
                            { color: item.source === 'mensagem' ? COLORS.primary : COLORS.ruby },
                          ]}
                        >
                          {item.source === 'mensagem' ? 'Mensagens' : 'Coração'}
                        </Text>
                      </View>
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
  cardModeContainer: {
    flex: 1,
  },
  cardScrollView: {
    flex: 1,
  },
  cardScrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 28,
  },
  borderlessCanvas: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  sourceBadgeMsg: {
    backgroundColor: '#EAF3EE',
    borderColor: '#C8E2D2',
  },
  sourceBadgeHeart: {
    backgroundColor: '#FFF0F2',
    borderColor: '#F8CBD2',
  },
  sourceBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  hebrewPill: {
    backgroundColor: '#F5EFE0',
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE5DB',
  },
  iconCircleWrapper: {
    marginBottom: 16,
    padding: 6,
    borderRadius: 48,
    backgroundColor: '#F3EFE6',
    borderWidth: 1,
    borderColor: '#E8E0D0',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preambleText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2.2,
    marginBottom: 6,
  },
  keywordTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.4,
    lineHeight: 36,
  },
  translitSubtitle: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#8A6014',
    fontWeight: '700',
    marginTop: 4,
  },
  dividerOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 18,
    width: '100%',
  },
  ornamentLine: {
    width: 44,
    height: 1.5,
    backgroundColor: '#DBCFB8',
    borderRadius: 1,
  },
  declarationQuote: {
    fontSize: 18.5,
    fontWeight: '700',
    color: '#1C2E24',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  reflectionParagraph: {
    fontSize: 15,
    color: '#3B4E44',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  cardImageContainer: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    marginVertical: 16,
    borderWidth: 1.5,
    borderColor: '#E8DFC8',
    backgroundColor: '#F5EFE6',
    alignItems: 'center',
    shadowColor: '#173B2C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 340,
  },
  cardImageCaptionPill: {
    position: 'absolute',
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(28, 72, 53, 0.90)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(194, 142, 52, 0.5)',
  },
  cardImageCaptionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FAF8F3',
    letterSpacing: 0.4,
  },
  verseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7F2E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4D9C2',
    marginBottom: 20,
  },
  verseBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.gold,
  },
  shareCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D4E6DA',
  },
  shareCardButtonText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.primary,
  },
  fixedBottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECE7DC',
    paddingTop: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  cardControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  navArrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#E2DBD0',
  },
  randomActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: 26,
    shadowColor: '#173B2C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  randomActionButtonText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.4,
  },
  counterText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 8,
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
  categoryFiltersContainer: {
    height: 52,
    marginBottom: 6,
    justifyContent: 'center',
  },
  categoryFiltersScroll: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  filterPill: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2DBD0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#65736A',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
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
  listFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  listSourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 7,
  },
  listSourceBadgeText: {
    fontSize: 9.5,
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
