import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Memory } from '../../types';
import { getMemoryById, toggleFavoriteMemory, deleteMemory } from '../../services/database';
import { useAlert } from '../../context/AlertContext';

export default function MemoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [memory, setMemory] = useState<Memory | null>(() => (id ? getMemoryById(id) : null));
  const { showAlert } = useAlert();

  if (!memory) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Memória não encontrada.</Text>
          <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavoriteMemory(memory.id);
    setMemory((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
  };

  const handleDelete = () => {
    showAlert({
      title: 'Remover Memória',
      message: 'Tem certeza de que deseja apagar esta memória do seu baú?',
      icon: 'trash',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => {
            deleteMemory(memory.id);
            router.back();
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Barra Superior */}
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
              name={memory.isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={memory.isFavorite ? COLORS.heart : COLORS.text}
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
        {/* Foto em Destaque */}
        {memory.photoUri && (
          <View style={styles.imageCard}>
            <Image source={{ uri: memory.photoUri }} style={styles.image} resizeMode="cover" />
          </View>
        )}

        {/* Metadados */}
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{memory.category}</Text>
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.dateText}>{memory.date}</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>{memory.title}</Text>

        {/* Localização */}
        {memory.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.locationText}>{memory.location}</Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Texto Completo */}
        <Text style={styles.description}>{memory.description}</Text>
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
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  imageCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 260,
    backgroundColor: COLORS.surfaceSubtle,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 26,
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
