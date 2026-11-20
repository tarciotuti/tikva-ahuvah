import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useDrawer } from '../context/DrawerContext';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    color?: string;
    bgColor?: string;
  };
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'Tikva Ahuvah',
  subtitle,
  icon = 'sparkles',
  showBack = false,
  onBack,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const { openDrawer } = useDrawer();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 6 }]}>
      <View style={styles.contentRow}>
        {/* Lado Esquerdo: Menu Hambúrguer ou Voltar */}
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={onBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={openDrawer}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="menu" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* Centro: Título e Marca Nobre */}
        <View style={styles.centerBrand}>
          <View style={styles.brandTitleRow}>
            {icon && (
              <Ionicons
                name={icon}
                size={14}
                color={COLORS.gold}
                style={styles.brandIcon}
              />
            )}
            <Text style={styles.brandTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
          {subtitle ? (
            <Text style={styles.brandSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : (
            <Text style={styles.brandSubtitle} numberOfLines={1}>
              Graça, Paz & Amor 🌿
            </Text>
          )}
        </View>

        {/* Lado Direito: Ação Rápida */}
        {rightAction ? (
          <TouchableOpacity
            style={[
              styles.rightActionButton,
              rightAction.bgColor ? { backgroundColor: rightAction.bgColor } : null,
            ]}
            activeOpacity={0.8}
            onPress={rightAction.onPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={rightAction.icon}
              size={20}
              color={rightAction.color || COLORS.primary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Linha Divisória Delicada com Brilho Suave */}
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.surface,
    zIndex: 100,
    elevation: 4,
    shadowColor: '#173B2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  contentRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  centerBrand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brandIcon: {
    marginTop: 1,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryMedium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  rightActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  placeholder: {
    width: 40,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
});
