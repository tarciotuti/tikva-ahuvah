import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Pressable,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { DAILY_VERSES, DailyVerse } from '../data/initialData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { renderVerseWithHopeHighlight } from '../utils/textHighlight';

interface ScriptureSplashScreenProps {
  onDismiss: () => void;
}

const TOTAL_DURATION = 5000;

export const ScriptureSplashScreen: React.FC<ScriptureSplashScreenProps> = ({ onDismiss }) => {
  const insets = useSafeAreaInsets();
  const [verse] = useState<DailyVerse>(() => {
    const randomIndex = Math.floor(Math.random() * DAILY_VERSES.length);
    return DAILY_VERSES[randomIndex];
  });

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.92));
  const [progressAnim] = useState(() => new Animated.Value(0));

  const [isHolding, setIsHolding] = useState(false);
  const currentProgressRef = useRef(0);
  const timerRef = useRef<any>(null);
  const isHoldingRef = useRef(false);

  const handleExit = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  }, [fadeAnim, onDismiss]);

  const startProgress = useCallback(
    (startFrom: number) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const remainingTime = Math.max(1000, Math.round((1 - startFrom) * TOTAL_DURATION));

      progressAnim.setValue(startFrom);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: remainingTime,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !isHoldingRef.current) {
          handleExit();
        }
      });

      timerRef.current = setTimeout(() => {
        if (!isHoldingRef.current) {
          handleExit();
        }
      }, remainingTime);
    },
    [handleExit, progressAnim]
  );

  useEffect(() => {
    // Animação de entrada suave
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    startProgress(0);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [fadeAnim, scaleAnim, startProgress]);

  // Colar o dedo na tela -> Pausa o timer e o progresso
  const handlePressIn = () => {
    isHoldingRef.current = true;
    setIsHolding(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    progressAnim.stopAnimation((value) => {
      currentProgressRef.current = value;
    });
  };

  // Soltar o dedo da tela -> Retoma de onde parou
  const handlePressOut = () => {
    isHoldingRef.current = false;
    setIsHolding(false);

    startProgress(currentProgressRef.current);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Pressable
        style={styles.touchArea}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          style={[
            styles.innerContent,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
          ]}
        >
          {/* Emblema Superior */}
          <Animated.View style={[styles.brandContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={26} color={COLORS.gold} />
            </View>
            <Text style={styles.appName}>Tikva Ahuvah</Text>
            <Text style={styles.appTag}>UMA PALAVRA PARA O SEU CORAÇÃO</Text>
          </Animated.View>

          {/* Cartão Central do Versículo */}
          <Animated.View
            style={[
              styles.verseCard,
              { transform: [{ scale: scaleAnim }] },
              isHolding && styles.verseCardHolding,
            ]}
          >
            <View style={styles.themeBadge}>
              <Ionicons name="bookmark" size={12} color={COLORS.gold} />
              <Text style={styles.themeText}>{verse.theme}</Text>
            </View>

            <Ionicons name="chatbox-ellipses" size={28} color={COLORS.gold} style={styles.quoteIcon} />
            {renderVerseWithHopeHighlight(verse.text, styles.verseText, {
              color: '#6EE7B7',
              fontWeight: '900',
              textShadowColor: 'rgba(110, 231, 183, 0.4)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 6,
            })}

            <View style={styles.divider} />
            <Text style={styles.referenceText}>{verse.reference}</Text>

            {/* Aviso visual de pausa ao segurar */}
            {isHolding && (
              <View style={styles.holdingNoticeBadge}>
                <Ionicons name="pause" size={13} color={COLORS.gold} />
                <Text style={styles.holdingNoticeText}>Pausado para leitura... solte para continuar</Text>
              </View>
            )}
          </Animated.View>

          {/* Barra de Progresso e Botão de Acesso */}
          <View style={styles.footer}>
            <View style={styles.progressBarTrack}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: isHolding ? COLORS.gold : COLORS.primaryLight,
                  },
                ]}
              />
            </View>

            <TouchableOpacity style={styles.enterBtn} activeOpacity={0.8} onPress={handleExit}>
              <Text style={styles.enterBtnText}>Entrar com Paz 🌿</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primaryDark} />
            </TouchableOpacity>

            <Text style={styles.tapPrompt}>
              {isHolding ? '📖 Lendo com calma...' : 'Segure na tela para pausar e ler • Toque para entrar'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#132E22', // Verde florestal escuro, nobre e relaxante
  },
  touchArea: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(194, 142, 52, 0.16)',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  appTag: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.goldLight,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  verseCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(238, 217, 178, 0.25)',
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  verseCardHolding: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(194, 142, 52, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  themeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.goldLight,
    letterSpacing: 0.5,
  },
  quoteIcon: {
    opacity: 0.35,
    marginBottom: 10,
  },
  verseText: {
    fontSize: 17,
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 27,
    letterSpacing: 0.2,
  },
  divider: {
    width: 48,
    height: 1.5,
    backgroundColor: COLORS.gold,
    opacity: 0.6,
    marginVertical: 16,
  },
  referenceText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.goldLight,
    letterSpacing: 0.5,
  },
  holdingNoticeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(194, 142, 52, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 14,
  },
  holdingNoticeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.goldLight,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  enterBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  tapPrompt: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 12,
  },
});
