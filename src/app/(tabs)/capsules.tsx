import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Capsule } from '../../types';
import { getCapsules } from '../../services/database';
import { CapsuleCard } from '../../components/CapsuleCard';
import { AppHeader } from '../../components/AppHeader';

export default function CapsulesScreen() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    try {
      const data = getCapsules();
      setCapsules(data);
    } catch (error) {
      console.error('Erro ao carregar cápsulas:', error);
    }
  }, []);

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

  const openedCount = capsules.filter((c) => c.isOpened).length;

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.tag}>
        <Ionicons name="heart" size={12} color={COLORS.ruby} />
        <Text style={styles.tagText}>CÁPSULAS DE AFETO</Text>
      </View>
      <Text style={styles.title}>Abra Quando... 💌</Text>
      <Text style={styles.description}>
        Estes recados foram escritos para momentos específicos. Sempre que precisar de um colo,
        de um empurrão de coragem ou de uma boa risada, venha até aqui.
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>Cápsulas descobertas</Text>
          <Text style={styles.progressValue}>
            {openedCount} de {capsules.length}
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${capsules.length > 0 ? (openedCount / capsules.length) * 100 : 0}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <AppHeader
        subtitle="Cartas do Coração 💌"
        icon="mail-unread"
      />
      <FlatList
        data={capsules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CapsuleCard
            capsule={item}
            onPress={() => router.push({ pathname: '/capsule/[id]', params: { id: item.id } })}
          />
        )}
        ListHeaderComponent={renderHeader}
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
    paddingBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.ruby,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});
