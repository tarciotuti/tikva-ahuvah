import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const insets = useSafeAreaInsets();
  const [slideAnim] = useState(() => new Animated.Value(-DRAWER_WIDTH));
  const [opacityAnim] = useState(() => new Animated.Value(0));
  const [rendered, setRendered] = useState(isOpen);

  if (isOpen && !rendered) {
    setRendered(true);
  }

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRendered(false);
      });
    }
  }, [isOpen, slideAnim, opacityAnim]);

  if (!rendered) {
    return null;
  }

  const navigateTo = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 250);
  };

  const menuItems = [
    {
      title: 'Início',
      subtitle: 'Visão geral & versículo do dia',
      icon: 'sparkles',
      color: COLORS.primary,
      bg: COLORS.primaryLight,
      action: () => navigateTo('/(tabs)'),
    },
    {
      title: 'Meu Caderno de Fé',
      subtitle: 'Pregações, devocionais & estudos',
      icon: 'book',
      color: COLORS.primaryMedium,
      bg: COLORS.primaryLight,
      action: () => navigateTo('/(tabs)/notes'),
    },
    {
      title: 'Baú de Memórias',
      subtitle: 'Fotos, datas & momentos inesquecíveis',
      icon: 'heart',
      color: COLORS.ruby,
      bg: COLORS.rubyLight,
      action: () => navigateTo('/(tabs)/memories'),
    },
    {
      title: 'Você Para Mim 🌿',
      subtitle: 'O que você é para mim (Tikvá Sheli...)',
      icon: 'sparkles',
      color: COLORS.gold,
      bg: COLORS.goldLight,
      action: () => navigateTo('/you-are'),
    },
    {
      title: 'Poemas & Reflexões',
      subtitle: 'Versos autorais & salmos do coração',
      icon: 'leaf',
      color: COLORS.gold,
      bg: COLORS.goldLight,
      action: () => navigateTo('/poems'),
    },
    {
      title: 'Nossa Linha do Tempo',
      subtitle: 'Marcos & trechos da conversa (2021-2026)',
      icon: 'hourglass',
      color: COLORS.primaryMedium,
      bg: COLORS.primaryLight,
      action: () => navigateTo('/timeline'),
    },
    {
      title: 'Galeria de Fotos',
      subtitle: 'Álbum visual & exibição em slides',
      icon: 'images',
      color: COLORS.primary,
      bg: COLORS.primaryLight,
      action: () => navigateTo('/gallery'),
    },
    {
      title: 'Cartas "Abra Quando..."',
      subtitle: 'Envelopes de afeto e encorajamento',
      icon: 'mail-unread',
      color: COLORS.gold,
      bg: COLORS.goldLight,
      action: () => navigateTo('/(tabs)/capsules'),
    },
    {
      title: 'Configurações',
      subtitle: 'Privacidade, biometria & backup vitalício',
      icon: 'settings-outline',
      color: COLORS.primaryMedium,
      bg: COLORS.primaryLight,
      action: () => navigateTo('/(tabs)/settings'),
    },
  ];

  return (
    <View style={styles.fullscreenOverlay} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Backdrop Escurecido com toque para fechar */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      </TouchableWithoutFeedback>

      {/* Painel Lateral que Desliza */}
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.drawerContent}>
          {/* Cabeçalho do Menu */}
          <View style={styles.header}>
            <View style={styles.avatarCircle}>
              <View style={styles.avatarInnerGlow}>
                <Ionicons name="rose" size={26} color={COLORS.ruby} />
              </View>
              <View style={styles.avatarBadge}>
                <Ionicons name="sparkles" size={10} color={COLORS.gold} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.appTitle}>Tikva Ahuvah</Text>
              <Text style={styles.appSubtitle}>Fé, Memórias & Amor</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Lista de Navegação */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionLabel}>NAVEGAÇÃO RÁPIDA</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={item.action}
              >
                <View style={[styles.itemIconCircle, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Card Devocional de Bênção no Rodapé */}
          <View style={styles.footerCard}>
            <Ionicons name="sparkles" size={14} color={COLORS.gold} style={{ marginBottom: 4 }} />
            <Text style={styles.footerVerse}>
              &ldquo;Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.&rdquo;
            </Text>
            <Text style={styles.footerRef}>1 Coríntios 13:13</Text>
          </View>

          {/* Assinatura */}
          <View style={styles.signatureContainer}>
            <Text style={styles.madeWithLoveText}>Feito exclusivamente para você ❤️</Text>
            <Text style={styles.tikvaSheliText}>Tikvá Sheli 🌿</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 59, 44, 0.45)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.background,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 24,
    shadowColor: '#173B2C',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    zIndex: 1000,
  },
  drawerContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.rubyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: COLORS.rubyTint,
    position: 'relative',
    shadowColor: COLORS.ruby,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInnerGlow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF5F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.goldTint,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  appSubtitle: {
    fontSize: 12,
    color: COLORS.primaryMedium,
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 20,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginBottom: 4,
  },
  itemIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  footerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.goldTint,
    marginTop: 10,
    marginBottom: 14,
  },
  footerVerse: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  footerRef: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gold,
    textAlign: 'right',
  },
  signatureContainer: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 4,
  },
  madeWithLoveText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryMedium,
    textAlign: 'center',
  },
  tikvaSheliText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 3,
  },
});
