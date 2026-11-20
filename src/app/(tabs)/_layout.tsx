import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerProvider, useDrawer } from '../../context/DrawerContext';
import { NavigationDrawer } from '../../components/NavigationDrawer';

function TabsNavigator() {
  const insets = useSafeAreaInsets();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  
  // Garante espaço generoso para os botões virtuais do Android (3 botões ou barra de gestos)
  const bottomPadding = Math.max(insets.bottom, 12);
  const tabHeight = 58 + bottomPadding;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.borderLight,
            borderTopWidth: 1,
            height: tabHeight,
            paddingBottom: bottomPadding,
            paddingTop: 8,
            elevation: 12,
            shadowColor: '#173B2C',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'sparkles' : 'sparkles-outline'}
                size={21}
                color={color as string}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Caderno',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'book' : 'book-outline'}
                size={21}
                color={color as string}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="memories"
          options={{
            title: 'Memórias',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'images' : 'images-outline'}
                size={21}
                color={color as string}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="capsules"
          options={{
            title: 'Cartas',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'mail' : 'mail-outline'}
                size={21}
                color={color as string}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Mais',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={moreMenuVisible || focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal'}
                size={22}
                color={moreMenuVisible ? COLORS.primary : (color as string)}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setMoreMenuVisible((prev) => !prev);
            },
          }}
        />
      </Tabs>

      {/* Menu Flutuante "Mais" (Estilo KOR Central) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={moreMenuVisible}
        onRequestClose={() => setMoreMenuVisible(false)}
      >
        <Pressable
          style={styles.moreMenuTransparentOverlay}
          onPress={() => setMoreMenuVisible(false)}
        >
          <View style={[styles.moreMenuFloatingColumn, { bottom: tabHeight + 10 }]}>
            {/* 1. Poemas & Reflexões Dela */}
            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => {
                setMoreMenuVisible(false);
                router.push('/poems');
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.moreMenuIconWrapper, { backgroundColor: COLORS.goldLight }]}>
                <Ionicons name="book" size={18} color={COLORS.gold} />
              </View>
              <View style={styles.moreMenuTextWrapper}>
                <Text style={styles.moreMenuLabel}>Poemas & Reflexões</Text>
                <Text style={styles.moreMenuSub}>Versos da Alma e da Fé</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.moreMenuDivider} />

            {/* 2. Linha do Tempo & Trechos Marcantes */}
            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => {
                setMoreMenuVisible(false);
                router.push('/timeline');
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.moreMenuIconWrapper, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="hourglass" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.moreMenuTextWrapper}>
                <Text style={styles.moreMenuLabel}>Linha do Tempo</Text>
                <Text style={styles.moreMenuSub}>Marcos & Trechos da Conversa</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.moreMenuDivider} />

            {/* 3. Galeria de Fotos */}
            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => {
                setMoreMenuVisible(false);
                router.push('/gallery');
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.moreMenuIconWrapper, { backgroundColor: COLORS.rubyLight }]}>
                <Ionicons name="images" size={18} color={COLORS.ruby} />
              </View>
              <View style={styles.moreMenuTextWrapper}>
                <Text style={styles.moreMenuLabel}>Galeria de Fotos</Text>
                <Text style={styles.moreMenuSub}>Álbum & Slideshow</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.moreMenuDivider} />

            {/* 4. Configurações & Segurança */}
            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => {
                setMoreMenuVisible(false);
                router.push('/(tabs)/settings');
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.moreMenuIconWrapper, { backgroundColor: '#ECE9E2' }]}>
                <Ionicons name="settings-outline" size={18} color="#4A554A" />
              </View>
              <View style={styles.moreMenuTextWrapper}>
                <Text style={styles.moreMenuLabel}>Configurações</Text>
                <Text style={styles.moreMenuSub}>Privacidade & Backup</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Menu Lateral Deslizante Global para todas as abas */}
      <NavigationDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}

const styles = StyleSheet.create({
  moreMenuTransparentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 33, 25, 0.35)',
  },
  moreMenuFloatingColumn: {
    position: 'absolute',
    right: 14,
    width: 200,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: '#173B2C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 16,
  },
  moreMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 14,
  },
  moreMenuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  moreMenuTextWrapper: {
    flex: 1,
  },
  moreMenuLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  moreMenuSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  moreMenuDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
    marginHorizontal: 4,
  },
});

export default function TabsLayout() {
  return (
    <DrawerProvider>
      <TabsNavigator />
    </DrawerProvider>
  );
}
