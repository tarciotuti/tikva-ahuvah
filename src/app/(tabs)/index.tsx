import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  BackHandler,
  ToastAndroid,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Memory, Capsule, Note } from '../../types';
import { getMemories, getCapsules, getNotes } from '../../services/database';
import { DAILY_VERSES } from '../../data/initialData';
import { NoteCard } from '../../components/NoteCard';
import { MemoryCard } from '../../components/MemoryCard';
import { AppHeader } from '../../components/AppHeader';
import { renderVerseWithHopeHighlight } from '../../utils/textHighlight';

export default function DashboardScreen() {
  const [verseIndex, setVerseIndex] = useState(0);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [unopenedCapsule, setUnopenedCapsule] = useState<Capsule | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const lastBackPressRef = useRef<number>(0);

  const loadDashboardData = useCallback(() => {
    try {
      const allMemories = getMemories('Todas');
      setRecentMemories(allMemories.slice(0, 2));

      const allNotes = getNotes('todas');
      setRecentNotes(allNotes.slice(0, 2));

      const allCapsules = getCapsules();
      const sealed = allCapsules.find((c) => !c.isOpened) || allCapsules[0];
      setUnopenedCapsule(sealed || null);
    } catch (e) {
      console.error('Erro ao carregar dados do dashboard:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();

      // Duplo clique para sair do aplicativo na tela principal
      const onBackPress = () => {
        const now = Date.now();
        if (now - lastBackPressRef.current < 2000) {
          BackHandler.exitApp();
          return true;
        }

        lastBackPressRef.current = now;
        if (Platform.OS === 'android') {
          ToastAndroid.show('Toque novamente para sair 🌿', ToastAndroid.SHORT);
        }
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [loadDashboardData])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
    setRefreshing(false);
  };

  const currentVerse = DAILY_VERSES[verseIndex % DAILY_VERSES.length];

  const handleNextVerse = () => {
    setVerseIndex((prev) => (prev + 1) % DAILY_VERSES.length);
  };

  return (
    <View style={styles.safeArea}>
      {/* Barra Fixa Elegante no Topo */}
      <AppHeader
        subtitle="Graça, Paz & Amor 🌿"
        rightAction={{
          icon: 'add',
          onPress: () => router.push('/new-note'),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.container}
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
        {/* Banner de Saudação Acolhedor */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeTop}>
            <View style={styles.greetingPill}>
              <Ionicons name="sparkles" size={12} color={COLORS.gold} />
              <Text style={styles.greetingPillText}>GRAÇA, PAZ & AMOR</Text>
            </View>
            <Text style={styles.dateDisplay}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
            </Text>
          </View>
          <Text style={styles.welcomeTitle}>Olá, Tikva Ahuvah 🌿</Text>
          <Text style={styles.welcomeSub}>
            Que o seu coração encontre paz e renovação a cada instante deste dia.
          </Text>
        </View>

        {/* Card do Versículo do Dia (Estilo Devocional Iluminado) */}
        <View style={styles.verseCard}>
          <View style={styles.verseCardHeader}>
            <View style={styles.verseThemeBadge}>
              <Ionicons name="bookmark" size={12} color={COLORS.gold} />
              <Text style={styles.verseThemeBadgeText}>{currentVerse.theme}</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshVersePill}
              activeOpacity={0.7}
              onPress={handleNextVerse}
            >
              <Ionicons name="refresh" size={13} color={COLORS.primary} />
              <Text style={styles.refreshVersePillText}>Novo Versículo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.verseBody}>
            <Ionicons name="chatbox-ellipses" size={26} color={COLORS.gold} style={styles.quoteIcon} />
            {renderVerseWithHopeHighlight(currentVerse.text, styles.verseText, {
              color: '#1B6B46',
              fontWeight: '900',
            })}
          </View>

          <View style={styles.verseCardFooter}>
            <View style={styles.verseDivider} />
            <Text style={styles.verseReference}>{currentVerse.reference}</Text>
          </View>
        </View>

        {/* Ações Rápidas (Iconografia Reestilizada e Harmoniosa) */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsGrid}>
          {/* 1. Anotar Pregação */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => router.push('/new-note')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="book" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.actionCardLabel}>Pregação & Culto</Text>
            <Text style={styles.actionCardDescription}>Anotar a palavra</Text>
          </TouchableOpacity>

          {/* 2. Guardar Memória */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => router.push('/new-memory')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: COLORS.rubyLight }]}>
              <Ionicons name="camera" size={22} color={COLORS.ruby} />
            </View>
            <Text style={styles.actionCardLabel}>Nova Memória</Text>
            <Text style={styles.actionCardDescription}>Fotos & histórias</Text>
          </TouchableOpacity>

          {/* 3. Cartas de Afeto */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/capsules')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: COLORS.goldLight }]}>
              <Ionicons name="mail" size={22} color={COLORS.gold} />
            </View>
            <Text style={styles.actionCardLabel}>Abra Quando...</Text>
            <Text style={styles.actionCardDescription}>Cartas de carinho</Text>
          </TouchableOpacity>

          {/* 4. Caderno de Fé */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/notes')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="leaf" size={22} color={COLORS.primaryMedium} />
            </View>
            <Text style={styles.actionCardLabel}>Meu Caderno</Text>
            <Text style={styles.actionCardDescription}>Devocional & notas</Text>
          </TouchableOpacity>
        </View>

        {/* Envelope de Afeto em Destaque */}
        {unopenedCapsule && (
          <View style={styles.sealedCard}>
            <View style={styles.sealedTop}>
              <View style={styles.sealedIconCircle}>
                <Ionicons name="heart" size={24} color={COLORS.ruby} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.sealedTag}>CARTA DO CORAÇÃO</Text>
                <Text style={styles.sealedTitle}>{unopenedCapsule.title}</Text>
              </View>
            </View>
            <Text style={styles.sealedSubtitle}>{unopenedCapsule.subtitle}</Text>
            <TouchableOpacity
              style={styles.openEnvelopeBtn}
              activeOpacity={0.85}
              onPress={() =>
                router.push({ pathname: '/capsule/[id]', params: { id: unopenedCapsule.id } })
              }
            >
              <Ionicons name="mail-open" size={16} color={COLORS.white} />
              <Text style={styles.openEnvelopeBtnText}>Abrir Envelope Especial</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Banner Especial de Galeria & Slideshow */}
        <TouchableOpacity
          style={styles.galleryBanner}
          activeOpacity={0.88}
          onPress={() => router.push('/gallery')}
        >
          <View style={styles.galleryBannerContent}>
            <View style={styles.galleryBannerBadge}>
              <Ionicons name="images" size={12} color={COLORS.ruby} />
              <Text style={styles.galleryBannerBadgeText}>ÁLBUM & SLIDESHOW</Text>
            </View>
            <Text style={styles.galleryBannerTitle}>Galeria de Fotos 📸</Text>
            <Text style={styles.galleryBannerDesc}>
              Guarde suas fotos preferidas e assista em tela cheia como um lindo slide.
            </Text>
          </View>
          <View style={styles.galleryBannerIconCircle}>
            <Ionicons name="play" size={18} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        {/* Linha Dupla de Destaques: Poemas e Linha do Tempo */}
        <View style={styles.featuresRow}>
          {/* Card Poemas */}
          <TouchableOpacity
            style={styles.featureMiniCard}
            activeOpacity={0.85}
            onPress={() => router.push('/poems')}
          >
            <View style={styles.featureTopRow}>
              <View style={[styles.featureIconBadge, { backgroundColor: COLORS.goldLight }]}>
                <Ionicons name="book" size={18} color={COLORS.gold} />
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A928A" />
            </View>
            <Text style={styles.featureCardTitle}>Poemas Dela 📜</Text>
            <Text style={styles.featureCardDesc}>Versos, salmos e orações autorais</Text>
          </TouchableOpacity>

          {/* Card Linha do Tempo */}
          <TouchableOpacity
            style={styles.featureMiniCard}
            activeOpacity={0.85}
            onPress={() => router.push('/timeline')}
          >
            <View style={styles.featureTopRow}>
              <View style={[styles.featureIconBadge, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="hourglass" size={18} color={COLORS.primary} />
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A928A" />
            </View>
            <Text style={styles.featureCardTitle}>Linha do Tempo ⏳</Text>
            <Text style={styles.featureCardDesc}>Marcos & trechos de 2021 a 2026</Text>
          </TouchableOpacity>
        </View>

        {/* Últimas Anotações de Fé */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Anotações Recentes</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/notes')}>
            <Text style={styles.viewAllText}>Ver todas →</Text>
          </TouchableOpacity>
        </View>

        {recentNotes.length > 0 ? (
          recentNotes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onPress={() => router.push({ pathname: '/note/[id]', params: { id: n.id } })}
              onToggleFavorite={() => {}}
            />
          ))
        ) : (
          <Text style={styles.emptyPrompt}>Nenhuma anotação feita ainda.</Text>
        )}

        {/* Recordações do Baú */}
        <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Recordações do Baú</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/memories')}>
            <Text style={styles.viewAllText}>Ver todas →</Text>
          </TouchableOpacity>
        </View>

        {recentMemories.map((m) => (
          <MemoryCard
            key={m.id}
            memory={m}
            onPress={() => router.push({ pathname: '/memory/[id]', params: { id: m.id } })}
            onToggleFavorite={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navBrandText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  welcomeBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 18,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  welcomeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.goldLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  greetingPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  dateDisplay: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'capitalize',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  verseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primaryTint,
    marginBottom: 22,
    elevation: 3,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  verseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  verseThemeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.goldLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  verseThemeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gold,
  },
  refreshVersePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  refreshVersePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  verseBody: {
    position: 'relative',
    paddingVertical: 4,
    paddingLeft: 14,
  },
  quoteIcon: {
    position: 'absolute',
    left: -8,
    top: -6,
    opacity: 0.35,
  },
  verseText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.text,
    lineHeight: 25,
  },
  verseCardFooter: {
    marginTop: 14,
  },
  verseDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 22,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  actionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionCardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  actionCardDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sealedCard: {
    backgroundColor: COLORS.rubyLight,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.rubyTint,
    marginBottom: 22,
  },
  sealedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sealedIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealedTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.ruby,
    letterSpacing: 1,
  },
  sealedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  sealedSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  openEnvelopeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.ruby,
    borderRadius: 14,
    paddingVertical: 13,
    elevation: 2,
  },
  openEnvelopeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  galleryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 22,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  galleryBannerContent: {
    flex: 1,
    paddingRight: 12,
  },
  galleryBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.rubyLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  galleryBannerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.ruby,
    letterSpacing: 0.8,
  },
  galleryBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  galleryBannerDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  galleryBannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.ruby,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPrompt: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    gap: 12,
  },
  featureMiniCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  featureTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  featureCardDesc: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});
