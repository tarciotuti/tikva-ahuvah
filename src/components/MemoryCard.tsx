import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Memory } from '../types';
import { COLORS } from '../constants/theme';

interface MemoryCardProps {
  memory: Memory;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {memory.photoUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: memory.photoUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.favButtonFloating}
            activeOpacity={0.7}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={memory.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={memory.isFavorite ? COLORS.heart : COLORS.white}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noImageHeader}>
          <View style={styles.quoteIconBadge}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.primary} />
          </View>
          <TouchableOpacity
            style={styles.favButton}
            activeOpacity={0.7}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={memory.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={memory.isFavorite ? COLORS.heart : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.tagRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{memory.category}</Text>
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.dateText}>{memory.date}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {memory.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {memory.description}
        </Text>

        {memory.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {memory.location}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 2,
    shadowColor: '#301810',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.surfaceSubtle,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favButtonFloating: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  quoteIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favButton: {
    padding: 6,
  },
  content: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
