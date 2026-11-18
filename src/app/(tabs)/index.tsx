import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Memory, Capsule, Note } from '../../types';
import { getMemories, getCapsules, getNotes } from '../../services/database';
import { DAILY_VERSES } from '../../data/initialData';
import { NoteCard } from '../../components/NoteCard';
import { MemoryCard } from '../../components/MemoryCard';

export default function DashboardScreen() {
  const [verseIndex, setVerseIndex] = useState(0);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [unopenedCapsule, setUnopenedCapsule] = useState<Capsule | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
        {/* Cabeçalho Acolhedor */}
        <View style={styles.header}>
          <View>
            <View style={styles.badgeGreeting}>
              <Ionicons name="sparkles" size={12} color={COLORS.gold} />
              <Text style={styles.badgeGreetingText}>GRAÇA, PAZ & AFETO</Text>
            </View>
            <Text style={styles.headerTitle}>Olá, Tikva ✨</Text>
            <Text style={styles.headerSubtitle}>
              Seu refúgio para guardar a palavra de Deus e as memórias da vida.
            </Text>
          </View>
        </View>

        {/* Card do Versículo do Dia */}
        <View style={styles.verseCard}>
          <View style={styles.verseCardTop}>
            <View style={styles.verseThemePill}>
              <Ionicons name="book" size={12} color={COLORS.gold} />
              <Text style={styles.verseThemeText}>{currentVerse.theme}</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshVerseBtn}
              activeOpacity={0.7}
              onPress={handleNextVerse}
            >
              <Ionicons name="shuffle-outline" size={14} color={COLORS.primary} />
              <Text style={styles.refreshVerseText}>Outro versículo</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.verseText}>&ldquo;{currentVerse.text}&rdquo;</Text>
          <Text style={styles.verseRef}>{currentVerse.reference}</Text>
        </View>

        {/* Ações Rápidas */}
        <Text style={styles.sectionHeading}>Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          {/* Nova Pregação */}
          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.85}
            onPress={() => router.push('/new-note')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="book-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.actionCardTitle}>Anotar Pregação</Text>
            <Text style={styles.actionCardDesc}>Cultos e estudos</Text>
          </TouchableOpacity>

          {/* Nova Memória */}
          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.85}
            onPress={() => router.push('/new-memory')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: COLORS.rubyLight }]}>
              <Ionicons name="camera-outline" size={20} color={COLORS.ruby} />
            </View>
            <Text style={styles.actionCardTitle}>Nova Memória</Text>
            <Text style={styles.actionCardDesc}>Fotos e histórias</Text>
          </TouchableOpacity>

          {/* Abrir Carta */}
          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/capsules')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: COLORS.goldLight }]}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gold} />
            </View>
            <Text style={styles.actionCardTitle}>Abra Quando...</Text>
            <Text style={styles.actionCardDesc}>Cartas de apoio</Text>
          </TouchableOpacity>

          {/* Caderno */}
          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/notes')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="reader-outline" size={20} color={COLORS.primaryMedium} />
            </View>
            <Text style={styles.actionCardTitle}>Meu Caderno</Text>
            <Text style={styles.actionCardDesc}>Todas as notas</Text>
          </TouchableOpacity>
        </View>

        {/* Cápsula em Destaque */}
        {unopenedCapsule && (
          <View style={styles.capsulePromptCard}>
            <View style={styles.capsulePromptTop}>
              <View style={styles.capsuleIconCircle}>
                <Ionicons name="mail-unread" size={22} color={COLORS.ruby} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.capsulePromptLabel}>UMA CARTA PARA O CORAÇÃO</Text>
                <Text style={styles.capsulePromptTitle}>{unopenedCapsule.title}</Text>
              </View>
            </View>
            <Text style={styles.capsulePromptSubtitle}>{unopenedCapsule.subtitle}</Text>
            <TouchableOpacity
              style={styles.capsuleOpenBtn}
              activeOpacity={0.85}
              onPress={() =>
                router.push({ pathname: '/capsule/[id]', params: { id: unopenedCapsule.id } })
              }
            >
              <Text style={styles.capsuleOpenBtnText}>Abrir Envelope Especial ✨</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Últimas Anotações de Fé */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Anotações Recentes</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/notes')}>
            <Text style={styles.seeAllText}>Ver todas →</Text>
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
          <Text style={styles.emptyNotePrompt}>Nenhuma anotação feita ainda.</Text>
        )}

        {/* Últimas Memórias */}
        <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
          <Text style={styles.sectionHeading}>Recordações do Baú</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/memories')}>
            <Text style={styles.seeAllText}>Ver todas →</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  badgeGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  badgeGreetingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  verseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
    marginBottom: 22,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  verseCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseThemePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.goldLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  verseThemeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gold,
  },
  refreshVerseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  refreshVerseText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  verseText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.text,
    lineHeight: 23,
    marginBottom: 10,
  },
  verseRef: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'right',
  },
  sectionHeading: {
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
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 22,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 1,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  actionCardDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  capsulePromptCard: {
    backgroundColor: COLORS.rubyLight,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.rubyTint,
    marginBottom: 22,
  },
  capsulePromptTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  capsuleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsulePromptLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.ruby,
    letterSpacing: 1,
  },
  capsulePromptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  capsulePromptSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  capsuleOpenBtn: {
    backgroundColor: COLORS.ruby,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleOpenBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  emptyNotePrompt: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: 16,
  },
});
