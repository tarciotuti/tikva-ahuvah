import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { authenticateWithBiometricsAsync } from '../services/security';

interface SecurityLockScreenProps {
  storedPin: string;
  useBiometrics: boolean;
  onUnlock: () => void;
}

export const SecurityLockScreen: React.FC<SecurityLockScreenProps> = ({
  storedPin,
  useBiometrics,
  onUnlock,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (useBiometrics) {
      authenticateWithBiometricsAsync().then((success) => {
        if (success) {
          onUnlock();
        }
      });
    }
  }, [useBiometrics, onUnlock]);

  const handleBiometricPress = async () => {
    if (useBiometrics) {
      const success = await authenticateWithBiometricsAsync();
      if (success) {
        onUnlock();
      }
    }
  };

  const handleNumberPress = (num: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);
      setErrorMessage('');

      if (nextPin.length === 4) {
        // Se há PIN configurado, valida
        if (storedPin && nextPin !== storedPin) {
          Vibration.vibrate(200);
          setErrorMessage('PIN incorreto. Tente novamente.');
          setTimeout(() => setEnteredPin(''), 400);
        } else {
          // Desbloqueado com sucesso
          onUnlock();
        }
      }
    }
  };

  const handleDelete = () => {
    if (enteredPin.length > 0) {
      setEnteredPin(enteredPin.slice(0, -1));
      setErrorMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Tikva Ahuvah</Text>
        <Text style={styles.subtitle}>
          Seu cantinho seguro. Digite o PIN ou use a sua digital para entrar.
        </Text>
      </View>

      {/* Indicadores dos 4 dígitos */}
      <View style={styles.dotsRow}>
        {[0, 1, 2, 3].map((index) => {
          const filled = enteredPin.length > index;
          return (
            <View
              key={index}
              style={[styles.dot, filled ? styles.dotFilled : styles.dotEmpty]}
            />
          );
        })}
      </View>

      {errorMessage.length > 0 ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <View style={{ height: 20 }} />
      )}

      {/* Teclado Numérico */}
      <View style={styles.keypad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
        ].map((row, rIdx) => (
          <View key={rIdx} style={styles.keypadRow}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keyButton}
                activeOpacity={0.7}
                onPress={() => handleNumberPress(num)}
              >
                <Text style={styles.keyText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.keypadRow}>
          {useBiometrics ? (
            <TouchableOpacity
              style={styles.keyButtonSpecial}
              activeOpacity={0.7}
              onPress={handleBiometricPress}
            >
              <Ionicons name="finger-print" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.keyButtonSpecial} />
          )}

          <TouchableOpacity
            style={styles.keyButton}
            activeOpacity={0.7}
            onPress={() => handleNumberPress('0')}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keyButtonSpecial}
            activeOpacity={0.7}
            onPress={handleDelete}
          >
            <Ionicons name="backspace-outline" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotEmpty: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  dotFilled: {
    backgroundColor: COLORS.primary,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '600',
    height: 20,
    marginBottom: 8,
  },
  keypad: {
    width: '100%',
    maxWidth: 280,
    marginTop: 10,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  keyButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  keyButtonSpecial: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
