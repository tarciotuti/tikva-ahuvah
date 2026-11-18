import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Capsule } from '../types';
import { COLORS } from '../constants/theme';

interface CapsuleCardProps {
  capsule: Capsule;
  onPress: () => void;
}

export const CapsuleCard: React.FC<CapsuleCardProps> = ({ capsule, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        capsule.isOpened ? styles.cardOpened : styles.cardSealed,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,
            capsule.isOpened ? styles.iconOpened : styles.iconSealed,
          ]}
        >
          <Ionicons
            name={(capsule.icon || 'mail') as any}
            size={22}
            color={capsule.isOpened ? COLORS.secondary : COLORS.primary}
          />
        </View>

        <View
          style={[
            styles.badge,
            capsule.isOpened ? styles.badgeOpened : styles.badgeSealed,
          ]}
        >
          <Ionicons
            name={capsule.isOpened ? 'checkmark-circle-outline' : 'lock-closed'}
            size={12}
            color={capsule.isOpened ? COLORS.secondary : COLORS.primary}
          />
          <Text
            style={[
              styles.badgeText,
              capsule.isOpened ? styles.badgeTextOpened : styles.badgeTextSealed,
            ]}
          >
            {capsule.isOpened ? 'Já aberta' : 'Lacrada'}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{capsule.title}</Text>
      <Text style={styles.subtitle}>{capsule.subtitle}</Text>

      <View style={styles.footer}>
        <Text style={styles.actionText}>
          {capsule.isOpened ? 'Ler novamente →' : 'Tocar para abrir o envelope ✨'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#301810',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardSealed: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primaryTint,
  },
  cardOpened: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderLight,
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSealed: {
    backgroundColor: COLORS.primaryLight,
  },
  iconOpened: {
    backgroundColor: COLORS.secondaryLight,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  badgeSealed: {
    backgroundColor: COLORS.primaryLight,
  },
  badgeOpened: {
    backgroundColor: COLORS.secondaryLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextSealed: {
    color: COLORS.primary,
  },
  badgeTextOpened: {
    color: COLORS.secondary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
    marginTop: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
