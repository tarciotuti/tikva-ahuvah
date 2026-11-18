import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface CategoryPillProps {
  label: string;
  icon?: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  icon,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.pill, isSelected ? styles.pillSelected : styles.pillDefault]}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={14}
          color={isSelected ? COLORS.white : COLORS.textSecondary}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, isSelected ? styles.textSelected : styles.textDefault]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pillDefault: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  textDefault: {
    color: COLORS.textSecondary,
  },
  textSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
