import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
  subtitle?: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  visible,
  onClose,
  onSuccess,
  title = 'Cadastrar Senha PIN',
}) => {
  const insets = useSafeAreaInsets();
  const [prevVisible, setPrevVisible] = useState(visible);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [firstPin, setFirstPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reinicia os estados quando o modal se torna visível
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setStep('create');
      setFirstPin('');
      setCurrentPin('');
      setErrorMessage('');
    }
  }

  const handleNumberPress = (num: string) => {
    if (currentPin.length >= 4) return;

    const nextPin = currentPin + num;
    setCurrentPin(nextPin);
    setErrorMessage('');

    if (nextPin.length === 4) {
      if (step === 'create') {
        // Guarda o primeiro PIN e solicita a confirmação
        setFirstPin(nextPin);
        setTimeout(() => {
          setStep('confirm');
          setCurrentPin('');
        }, 220);
      } else {
        // Validação da confirmação
        if (nextPin === firstPin) {
          onSuccess(nextPin);
          onClose();
        } else {
          Vibration.vibrate(200);
          setErrorMessage('Os PINs digitados não são iguais. Tente novamente.');
          setTimeout(() => {
            setStep('create');
            setFirstPin('');
            setCurrentPin('');
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    if (currentPin.length > 0) {
      setCurrentPin(currentPin.slice(0, -1));
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    setCurrentPin('');
    setErrorMessage('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          {/* Cabeçalho do Modal */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
            </View>
            <TouchableOpacity style={styles.closeButton} activeOpacity={0.7} onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {step === 'create'
              ? 'Escolha 4 números para proteger suas anotações e memórias'
              : 'Digite os 4 números novamente para confirmar seu PIN'}
          </Text>

          {/* Indicador de Passo */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>
              {step === 'create' ? 'PASSO 1 DE 2: NOVO PIN' : 'PASSO 2 DE 2: CONFIRMAÇÃO'}
            </Text>
          </View>

          {/* Dots Indicadores (4 Dígitos) */}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((index) => {
              const isFilled = currentPin.length > index;
              return (
                <View
                  key={index}
                  style={[styles.dot, isFilled ? styles.dotFilled : styles.dotEmpty]}
                />
              );
            })}
          </View>

          {/* Mensagem de Erro / Espaço */}
          {errorMessage.length > 0 ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <View style={styles.errorPlaceholder} />
          )}

          {/* Teclado Numérico Personalizado (Sem Teclado do Sistema) */}
          <View style={styles.numpad}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
            ].map((row, rIdx) => (
              <View key={rIdx} style={styles.numpadRow}>
                {row.map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numButton}
                    activeOpacity={0.65}
                    onPress={() => handleNumberPress(num)}
                  >
                    <Text style={styles.numButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Linha Final: Limpar / 0 / Apagar */}
            <View style={styles.numpadRow}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={handleClear}
              >
                <Text style={styles.actionButtonText}>Limpar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.numButton}
                activeOpacity={0.65}
                onPress={() => handleNumberPress('0')}
              >
                <Text style={styles.numButtonText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={handleDelete}
              >
                <Ionicons name="backspace-outline" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 33, 25, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  stepBadge: {
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 16,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 0.8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  dotFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    transform: [{ scale: 1.15 }],
  },
  dotEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorPlaceholder: {
    height: 16,
    marginBottom: 10,
  },
  numpad: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  numButtonText: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
});
