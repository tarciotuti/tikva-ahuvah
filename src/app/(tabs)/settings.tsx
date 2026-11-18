import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { exportBackup, restoreBackup } from '../../services/backup';
import { getMemories, getCapsules, getNotes } from '../../services/database';
import {
  getSecurityConfig,
  saveSecurityConfig,
  checkBiometricsSupportAsync,
  SecurityConfig,
} from '../../services/security';

export default function SettingsScreen() {
  const [stats, setStats] = useState({
    totalMemories: 0,
    totalNotes: 0,
    favorites: 0,
    openedCapsules: 0,
    totalCapsules: 0,
  });

  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [backupJsonInput, setBackupJsonInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Segurança (PIN e Biometria)
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    isLockEnabled: false,
    pin: '',
    useBiometrics: true,
  });
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  const loadData = useCallback(() => {
    try {
      const memories = getMemories('Todas');
      const capsules = getCapsules();
      const notes = getNotes('todas');
      setStats({
        totalMemories: memories.length,
        totalNotes: notes.length,
        favorites: memories.filter((m) => m.isFavorite).length + notes.filter((n) => n.isFavorite).length,
        openedCapsules: capsules.filter((c) => c.isOpened).length,
        totalCapsules: capsules.length,
      });

      const config = getSecurityConfig();
      setSecurityConfig(config);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    checkBiometricsSupportAsync().then((res) => {
      setHasBiometrics(res.hasHardware && res.isEnrolled);
    });
  }, []);

  const handleToggleLock = (value: boolean) => {
    if (value && !securityConfig.pin) {
      // Se ainda não tem PIN cadastrado, pede para cadastrar primeiro
      setNewPinInput('');
      setPinModalVisible(true);
    } else {
      saveSecurityConfig({ isLockEnabled: value });
      setSecurityConfig((prev) => ({ ...prev, isLockEnabled: value }));
    }
  };

  const handleSavePin = () => {
    if (newPinInput.length !== 4) {
      Alert.alert('PIN inválido', 'O PIN deve conter exatamente 4 dígitos numéricos.');
      return;
    }

    saveSecurityConfig({ pin: newPinInput, isLockEnabled: true });
    setSecurityConfig((prev) => ({ ...prev, pin: newPinInput, isLockEnabled: true }));
    setPinModalVisible(false);
    setNewPinInput('');
    Alert.alert('PIN Ativado! 🔒', 'Seu diário agora está protegido com segurança.');
  };

  const handleToggleBiometrics = (value: boolean) => {
    saveSecurityConfig({ useBiometrics: value });
    setSecurityConfig((prev) => ({ ...prev, useBiometrics: value }));
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    const result = await exportBackup();
    setIsExporting(false);

    if (!result.success) {
      Alert.alert('Aviso', result.message);
    }
  };

  const handleConfirmRestore = () => {
    if (!backupJsonInput.trim()) {
      Alert.alert('Atenção', 'Cole o texto do arquivo de backup no campo indicado.');
      return;
    }

    Alert.alert(
      'Confirmar Restauração',
      'Isso irá restaurar os dados do arquivo de backup. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: () => {
            const res = restoreBackup(backupJsonInput.trim());
            if (res.success) {
              setRestoreModalVisible(false);
              setBackupJsonInput('');
              loadData();
              Alert.alert('Sucesso!', res.message);
            } else {
              Alert.alert('Erro', res.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerSubtitle}>SEU ESPAÇO</Text>
        <Text style={styles.headerTitle}>Cantinho & Segurança ✨</Text>

        {/* Card de Dedicatória */}
        <View style={styles.dedicationCard}>
          <View style={styles.dedicationIconCircle}>
            <Ionicons name="sparkles" size={20} color={COLORS.gold} />
          </View>
          <Text style={styles.dedicationTitle}>Tikva Ahuvah</Text>
          <Text style={styles.dedicationText}>
            {'Este diário foi pensado para ser o seu porto seguro de boas lembranças e crescimento espiritual. Que você nunca se esqueça da pessoa preciosa que é, da sua força e do propósito lindo que Deus tem para a sua vida.'}
          </Text>
          <Text style={styles.dedicationSign}>Com todo o meu amor, orações e carinho ❤️</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="images" size={18} color={COLORS.primary} />
            <Text style={styles.statNumber}>{stats.totalMemories}</Text>
            <Text style={styles.statLabel}>Memórias</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="book" size={18} color={COLORS.primaryMedium} />
            <Text style={styles.statNumber}>{stats.totalNotes}</Text>
            <Text style={styles.statLabel}>Pregações</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="heart" size={18} color={COLORS.ruby} />
            <Text style={styles.statNumber}>{stats.favorites}</Text>
            <Text style={styles.statLabel}>Favoritas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="mail-open" size={18} color={COLORS.gold} />
            <Text style={styles.statNumber}>{stats.openedCapsules}</Text>
            <Text style={styles.statLabel}>Cartas Lidas</Text>
          </View>
        </View>

        {/* Seção de Segurança & Privacidade (PIN / Digital) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Privacidade & Bloqueio</Text>
          </View>

          <Text style={styles.sectionDescription}>
            Proteja suas orações, anotações e memórias com senha de 4 dígitos ou impressão digital ao abrir o app.
          </Text>

          {/* Toggle Principal de Bloqueio */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Ativar Proteção no App</Text>
              <Text style={styles.settingSub}>
                {securityConfig.isLockEnabled ? 'Bloqueio ativo com segurança' : 'Desativado (abre direto)'}
              </Text>
            </View>
            <Switch
              value={securityConfig.isLockEnabled}
              onValueChange={handleToggleLock}
              trackColor={{ false: COLORS.border, true: COLORS.primaryTint }}
              thumbColor={securityConfig.isLockEnabled ? COLORS.primary : '#f4f3f4'}
            />
          </View>

          {/* Opções quando a proteção está ativa */}
          {securityConfig.isLockEnabled && (
            <View style={styles.subSettingsContainer}>
              {hasBiometrics && (
                <View style={styles.settingRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingLabel}>Usar Impressão Digital</Text>
                    <Text style={styles.settingSub}>Desbloqueio biométrico rápido</Text>
                  </View>
                  <Switch
                    value={securityConfig.useBiometrics}
                    onValueChange={handleToggleBiometrics}
                    trackColor={{ false: COLORS.border, true: COLORS.primaryTint }}
                    thumbColor={securityConfig.useBiometrics ? COLORS.primary : '#f4f3f4'}
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.changePinBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setNewPinInput('');
                  setPinModalVisible(true);
                }}
              >
                <Ionicons name="key-outline" size={16} color={COLORS.primary} />
                <Text style={styles.changePinText}>
                  {securityConfig.pin ? 'Alterar PIN de 4 Dígitos' : 'Cadastrar PIN'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Seção de Backup no Google Drive */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cloud-upload" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Backup no Google Drive</Text>
          </View>

          <Text style={styles.sectionDescription}>
            Seus dados ficam 100% no seu celular e nunca saem dele sem sua permissão.
            Toque abaixo para salvar uma cópia no seu <Text style={{ fontWeight: '700' }}>Google Drive</Text> ou
            restaurar um backup anterior.
          </Text>

          <TouchableOpacity
            style={[styles.primaryActionBtn, isExporting && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleExportBackup}
            disabled={isExporting}
          >
            <Ionicons name="logo-google" size={18} color={COLORS.white} />
            <Text style={styles.primaryActionBtnText}>
              {isExporting ? 'Preparando Arquivo...' : 'Fazer Backup no Google Drive'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionBtn}
            activeOpacity={0.8}
            onPress={() => setRestoreModalVisible(true)}
          >
            <Ionicons name="download-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.secondaryActionBtnText}>Restaurar de um Backup</Text>
          </TouchableOpacity>
        </View>

        {/* Informações sobre Privacidade */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.textMuted} />
          <Text style={styles.infoText}>
            100% offline, seguro e privado. Somente você tem acesso aos seus textos, orações e registros.
          </Text>
        </View>
      </ScrollView>

      {/* Modal para Cadastrar/Alterar PIN */}
      <Modal
        visible={pinModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cadastrar PIN de 4 Dígitos</Text>
              <TouchableOpacity onPress={() => setPinModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Escolha uma senha numérica de 4 dígitos fácil de lembrar para proteger o seu diário:
            </Text>

            <TextInput
              style={styles.pinInput}
              placeholder="Ex: 1234"
              placeholderTextColor={COLORS.textMuted}
              value={newPinInput}
              onChangeText={(text) => setNewPinInput(text.replace(/[^0-9]/g, '').slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              textAlign="center"
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setPinModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleSavePin}
              >
                <Text style={styles.modalConfirmText}>Salvar PIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Restauração */}
      <Modal
        visible={restoreModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRestoreModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Restaurar Backup</Text>
              <TouchableOpacity onPress={() => setRestoreModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Abra o arquivo de backup (.json) salvo no seu Google Drive, copie todo o seu conteúdo e cole aqui:
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Cole o código JSON do backup aqui..."
              placeholderTextColor={COLORS.textMuted}
              value={backupJsonInput}
              onChangeText={setBackupJsonInput}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRestoreModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmRestore}
              >
                <Text style={styles.modalConfirmText}>Restaurar Dados</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
  },
  dedicationCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
    marginBottom: 20,
  },
  dedicationIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dedicationTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  dedicationText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  dedicationSign: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  settingSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  subSettingsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: 10,
    paddingTop: 10,
  },
  changePinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  changePinText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 14,
    paddingVertical: 12,
  },
  secondaryActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  pinInput: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 16,
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 20,
  },
  modalInput: {
    height: 140,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    fontSize: 12,
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 16,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
});
