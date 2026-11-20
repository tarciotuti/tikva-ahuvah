import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export type AlertIconType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'cloud'
  | 'lock'
  | 'heart'
  | 'trash';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AlertOptions {
  title: string;
  message?: string;
  icon?: AlertIconType;
  buttons?: AlertButton[];
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
  hideAlert: () => {},
});

let globalAlertHandler: ((options: AlertOptions) => void) | null = null;

export function showAppAlert(options: AlertOptions) {
  if (globalAlertHandler) {
    globalAlertHandler(options);
  } else {
    console.warn('AlertProvider ainda não montado para exibir:', options.title);
  }
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertOptions>({ title: '' });

  const [scaleAnim] = useState(() => new Animated.Value(0.9));
  const [opacityAnim] = useState(() => new Animated.Value(0));

  const hideAlert = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [opacityAnim, scaleAnim]);

  const showAlert = useCallback(
    (options: AlertOptions) => {
      setConfig(options);
      setVisible(true);
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [opacityAnim, scaleAnim]
  );

  React.useEffect(() => {
    globalAlertHandler = showAlert;
    return () => {
      globalAlertHandler = null;
    };
  }, [showAlert]);

  const resolvedIcon: AlertIconType = React.useMemo(() => {
    if (config.icon) return config.icon;
    const lower = `${config.title} ${config.message || ''}`.toLowerCase();
    if (lower.includes('erro') || lower.includes('falha') || lower.includes('inválid')) return 'error';
    if (lower.includes('apagar') || lower.includes('excluir') || lower.includes('remover')) return 'trash';
    if (lower.includes('sucesso') || lower.includes('concluíd') || lower.includes('salvo')) return 'success';
    if (lower.includes('atenção') || lower.includes('aviso') || lower.includes('cuidado')) return 'warning';
    if (lower.includes('nuvem') || lower.includes('drive') || lower.includes('backup')) return 'cloud';
    if (lower.includes('pin') || lower.includes('bloqueio') || lower.includes('segurança')) return 'lock';
    if (lower.includes('amor') || lower.includes('carinho') || lower.includes('esperança')) return 'heart';
    return 'info';
  }, [config]);

  const iconInfo = React.useMemo(() => {
    switch (resolvedIcon) {
      case 'success':
        return { name: 'checkmark-circle' as const, color: COLORS.primary, bg: COLORS.primaryLight };
      case 'warning':
        return { name: 'alert-circle' as const, color: COLORS.gold, bg: COLORS.goldLight };
      case 'error':
        return { name: 'close-circle' as const, color: COLORS.ruby, bg: COLORS.rubyLight };
      case 'trash':
        return { name: 'trash' as const, color: COLORS.ruby, bg: COLORS.rubyLight };
      case 'cloud':
        return { name: 'cloud-done' as const, color: COLORS.primary, bg: COLORS.primaryLight };
      case 'lock':
        return { name: 'shield-checkmark' as const, color: COLORS.gold, bg: COLORS.goldLight };
      case 'heart':
        return { name: 'heart' as const, color: COLORS.ruby, bg: COLORS.rubyLight };
      case 'info':
      default:
        return { name: 'information-circle' as const, color: COLORS.primaryMedium, bg: COLORS.primaryLight };
    }
  }, [resolvedIcon]);

  const buttons = config.buttons && config.buttons.length > 0
    ? config.buttons
    : [{ text: 'Entendido', style: 'default' as const }];

  const handleButtonPress = (btn: AlertButton) => {
    hideAlert();
    if (btn.onPress) {
      setTimeout(() => {
        btn.onPress?.();
      }, 180);
    }
  };

  const cancelBtn = buttons.find((b) => b.style === 'cancel');

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => {
          if (cancelBtn) {
            handleButtonPress(cancelBtn);
          } else {
            hideAlert();
          }
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (cancelBtn) {
              handleButtonPress(cancelBtn);
            } else if (buttons.length === 1) {
              handleButtonPress(buttons[0]);
            }
          }}
        >
          <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                {/* Ícone Delicado */}
                <View style={[styles.iconContainer, { backgroundColor: iconInfo.bg }]}>
                  <Ionicons name={iconInfo.name} size={32} color={iconInfo.color} />
                </View>

                {/* Título Elegante */}
                <Text style={styles.title}>{config.title}</Text>

                {/* Mensagem Acolhedora */}
                {!!config.message && (
                  <Text style={styles.message}>{config.message}</Text>
                )}

                {/* Botões de Ação */}
                <View
                  style={[
                    styles.buttonContainer,
                    buttons.length === 2 && styles.buttonContainerRow,
                  ]}
                >
                  {buttons.map((btn, index) => {
                    const isCancel = btn.style === 'cancel';
                    const isDestructive = btn.style === 'destructive';

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.button,
                          isCancel && styles.buttonCancel,
                          isDestructive && styles.buttonDestructive,
                          !isCancel && !isDestructive && styles.buttonPrimary,
                          buttons.length === 2 && styles.buttonFlex,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleButtonPress(btn)}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            isCancel && styles.buttonTextCancel,
                            isDestructive && styles.buttonTextDestructive,
                            !isCancel && !isDestructive && styles.buttonTextPrimary,
                          ]}
                        >
                          {btn.text}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert deve ser usado dentro de um AlertProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 30, 24, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FAF8F4',
    borderRadius: 26,
    paddingTop: 26,
    paddingBottom: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E1D3',
    shadowColor: '#0E2419',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(194, 142, 52, 0.25)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  message: {
    fontSize: 14.5,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  buttonContainerRow: {
    flexDirection: 'row',
  },
  buttonFlex: {
    flex: 1,
  },
  button: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonCancel: {
    backgroundColor: '#EBE5D9',
    borderWidth: 1,
    borderColor: '#DDD4C4',
  },
  buttonDestructive: {
    backgroundColor: COLORS.ruby,
    shadowColor: COLORS.ruby,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextCancel: {
    color: '#5C635E',
  },
  buttonTextDestructive: {
    color: '#FFFFFF',
  },
});
