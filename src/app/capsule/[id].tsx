import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Capsule } from '../../types';
import { getCapsuleById, markCapsuleOpened } from '../../services/database';
import { MANUSCRIPT_ASSETS } from '../../utils/manuscriptAssets';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CapsuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [capsule] = useState<Capsule | null>(() => (id ? getCapsuleById(id) : null));
  const [showManuscriptModal, setShowManuscriptModal] = useState(false);

  useEffect(() => {
    if (capsule && !capsule.isOpened) {
      markCapsuleOpened(capsule.id);
    }
  }, [capsule]);

  if (!capsule) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Cápsula não encontrada.</Text>
          <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Barra de Fechar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.openedBadge}>
          <Ionicons name="sparkles" size={12} color={COLORS.primary} />
          <Text style={styles.openedBadgeText}>Cápsula de Afeto</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ícone e Cabeçalho do Envelope */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name={(capsule.icon || 'mail-open') as any} size={36} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>{capsule.title}</Text>
          <Text style={styles.subtitle}>{capsule.subtitle}</Text>
        </View>

        {/* Citação em Destaque */}
        {capsule.quote && (
          <View style={styles.quoteCard}>
            <Ionicons
              name="chatbubbles-outline"
              size={24}
              color={COLORS.primary}
              style={{ opacity: 0.4, marginBottom: 6 }}
            />
            <Text style={styles.quoteText}>&ldquo;{capsule.quote}&rdquo;</Text>
          </View>
        )}

        {/* Folha de Carta */}
        <View style={styles.letterPaper}>
          <Text style={styles.letterBody}>{capsule.content}</Text>

          {capsule.authorNote && (
            <View style={styles.authorSection}>
              <View style={styles.signatureLine} />
              <Text style={styles.authorNote}>{capsule.authorNote}</Text>
            </View>
          )}
        </View>

        {/* Botão de Ver Manuscrito Original (se disponível) */}
        {MANUSCRIPT_ASSETS[capsule.id] && (
          <TouchableOpacity
            style={styles.manuscriptButton}
            activeOpacity={0.85}
            onPress={() => setShowManuscriptModal(true)}
          >
            <View style={styles.manuscriptIconCircle}>
              <Ionicons name="document-text" size={20} color={COLORS.gold} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.manuscriptButtonTitle}>Ver Manuscrito Original 📜</Text>
              <Text style={styles.manuscriptButtonSub}>Toque para ver a foto do papel e caligrafia original</Text>
            </View>
            <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* Botão de Fechar Aconchegante */}
        <TouchableOpacity
          style={styles.keepInHeartBtn}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Ionicons name="heart" size={18} color={COLORS.white} />
          <Text style={styles.keepInHeartText}>Guardar de volta no coração</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para Visualização do Manuscrito Original */}
      {MANUSCRIPT_ASSETS[capsule.id] && (
        <Modal
          visible={showManuscriptModal}
          animationType="fade"
          transparent={false}
          onRequestClose={() => setShowManuscriptModal(false)}
        >
          <SafeAreaView style={styles.manuscriptModalContainer}>
            <View style={styles.manuscriptModalHeader}>
              <View>
                <Text style={styles.manuscriptModalTitle}>Manuscrito Original 📜</Text>
                <Text style={styles.manuscriptModalSub}>A carta escrita à mão com amor</Text>
              </View>
              <TouchableOpacity
                style={styles.manuscriptModalClose}
                onPress={() => setShowManuscriptModal(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.manuscriptImageScroll}
              maximumZoomScale={3}
              minimumZoomScale={1}
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={MANUSCRIPT_ASSETS[capsule.id]}
                style={styles.manuscriptFullImage}
                resizeMode="contain"
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  openedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  openedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.primaryDark,
    lineHeight: 22,
    fontWeight: '500',
  },
  letterPaper: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#301810',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  letterBody: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 27,
    letterSpacing: 0.2,
  },
  authorSection: {
    marginTop: 24,
    alignItems: 'flex-end',
  },
  signatureLine: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  authorNote: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  keepInHeartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 15,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  keepInHeartText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  manuscriptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF7EE',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8DCBF',
    marginBottom: 20,
    shadowColor: '#C28E34',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  manuscriptIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5ECDA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manuscriptButtonTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#8A6014',
  },
  manuscriptButtonSub: {
    fontSize: 12,
    color: '#6E726A',
    marginTop: 2,
  },
  manuscriptModalContainer: {
    flex: 1,
    backgroundColor: '#1A211E',
  },
  manuscriptModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#242F2A',
  },
  manuscriptModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  manuscriptModalSub: {
    fontSize: 12,
    color: '#C8D2CB',
    marginTop: 2,
  },
  manuscriptModalClose: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0EFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manuscriptImageScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  manuscriptFullImage: {
    width: SCREEN_WIDTH - 24,
    height: SCREEN_HEIGHT * 0.82,
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
