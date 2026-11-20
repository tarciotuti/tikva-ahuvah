import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import {
  restoreBackup,
  pickAndRestoreBackup,
  getBackupStatus,
  saveBackupSetting,
  performWhatsAppBackup,
  checkLocalBackupFile,
  restoreFromLocalBackup,
  BackupStatusInfo,
} from '../../services/backup';
import {
  signInWithGoogle,
  signOutGoogle,
  downloadBackupFromDriveApi,
} from '../../services/googleDrive';
import { getMemories, getCapsules, getNotes, getGalleryPhotos } from '../../services/database';
import {
  getSecurityConfig,
  saveSecurityConfig,
  checkBiometricsSupportAsync,
  SecurityConfig,
} from '../../services/security';
import { AppHeader } from '../../components/AppHeader';
import { PinModal } from '../../components/PinModal';
import { useAudioPlayer } from 'expo-audio';
import {
  SOUNDTRACKS,
  getSavedSlideshowTrackId,
  saveSlideshowTrackId,
  isSlideshowMusicEnabled,
  setSlideshowMusicEnabled,
  getTrackById,
  SLIDESHOW_SPEED_OPTIONS,
  getSlideshowSpeed,
  saveSlideshowSpeed,
} from '../../services/audio';
import { useAlert } from '../../context/AlertContext';

type SettingsSection = null | 'backup' | 'security' | 'slideshow' | 'about';

export default function SettingsScreen() {
  const { showAlert } = useAlert();
  const [activeSection, setActiveSection] = useState<SettingsSection>(null);

  const [stats, setStats] = useState({
    totalMemories: 0,
    totalNotes: 0,
    totalPhotos: 0,
    favorites: 0,
    openedCapsules: 0,
    totalCapsules: 0,
  });

  // Backup state
  const [backupStatus, setBackupStatus] = useState<BackupStatusInfo>(() => getBackupStatus());
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Segurança (PIN e Biometria)
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    isLockEnabled: false,
    pin: '',
    useBiometrics: true,
  });
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);

  // Trilha sonora do Slideshow
  const [selectedTrackId, setSelectedTrackId] = useState(() => getSavedSlideshowTrackId());
  const [musicEnabled, setMusicEnabledState] = useState(() => isSlideshowMusicEnabled());
  const [slideshowSpeed, setSlideshowSpeed] = useState(() => getSlideshowSpeed());
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);

  const previewTrack = getTrackById(previewingTrackId || selectedTrackId);
  const previewPlayer = useAudioPlayer(previewTrack.asset);

  const loadData = useCallback(() => {
    try {
      const memories = getMemories('Todas');
      const capsules = getCapsules();
      const notes = getNotes('todas');
      const gallery = getGalleryPhotos();
      setStats({
        totalMemories: memories.length,
        totalNotes: notes.length,
        totalPhotos: gallery.length,
        favorites: memories.filter((m) => m.isFavorite).length + notes.filter((n) => n.isFavorite).length,
        openedCapsules: capsules.filter((c) => c.isOpened).length,
        totalCapsules: capsules.length,
      });

      const config = getSecurityConfig();
      setSecurityConfig(config);
      setBackupStatus(getBackupStatus());
    } catch (e) {
      console.error(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
      setActiveSection(null);
    }, [loadData])
  );

  useEffect(() => {
    checkBiometricsSupportAsync().then((res) => {
      setHasBiometrics(res.hasHardware && res.isEnrolled);
    });
  }, []);

  // Handlers Segurança
  const handleToggleLock = (value: boolean) => {
    if (value && !securityConfig.pin) {
      setPinModalVisible(true);
    } else {
      saveSecurityConfig({ isLockEnabled: value });
      setSecurityConfig((prev) => ({ ...prev, isLockEnabled: value }));
    }
  };

  const handleSavePinSuccess = (newPin: string) => {
    saveSecurityConfig({ pin: newPin, isLockEnabled: true });
    setSecurityConfig((prev) => ({ ...prev, pin: newPin, isLockEnabled: true }));
    showAlert({
      title: 'PIN Protegido! 🔒',
      message: 'Seu diário e memórias agora estão devidamente protegidos com seu código pessoal.',
      icon: 'lock',
    });
  };

  const handleToggleBiometrics = (value: boolean) => {
    saveSecurityConfig({ useBiometrics: value });
    setSecurityConfig((prev) => ({ ...prev, useBiometrics: value }));
  };

  // Handlers Backup
  const handleToggleAutoBackup = (enabled: boolean) => {
    saveBackupSetting('backup_auto_enabled', enabled ? 'true' : 'false');
    setBackupStatus((prev) => ({ ...prev, autoEnabled: enabled }));
  };

  const handleSelectMethod = (method: 'local' | 'remote' | 'hybrid') => {
    saveBackupSetting('backup_method', method);
    setBackupStatus((prev) => ({ ...prev, method }));
  };

  const handleSelectFrequency = (freq: 'manual' | 'daily' | 'weekly' | 'monthly') => {
    saveBackupSetting('backup_frequency', freq);
    setBackupStatus((prev) => ({ ...prev, frequency: freq }));
  };

  const handleToggleIncludePhotos = (val: boolean) => {
    saveBackupSetting('backup_include_photos', val ? 'true' : 'false');
    setBackupStatus((prev) => ({ ...prev, includePhotos: val }));
  };

  const handlePerformBackupNow = async () => {
    try {
      setIsBackingUp(true);
      const res = await performWhatsAppBackup({
        includePhotos: backupStatus.includePhotos,
        shareToCloud: true,
        method: backupStatus.method,
      });
      setIsBackingUp(false);
      if (res.success) {
        setBackupStatus(getBackupStatus());
        showAlert({
          title: 'Backup Concluído com Sucesso! 🌿',
          message: res.message,
          icon: 'success',
        });
      } else {
        showAlert({
          title: 'Aviso de Backup',
          message: res.message,
          icon: 'warning',
        });
      }
    } catch (err: any) {
      setIsBackingUp(false);
      showAlert({
        title: 'Falha no Backup',
        message: err?.message || 'Não foi possível gerar a cópia de segurança agora.',
        icon: 'error',
      });
    }
  };

  const handleGoogleAccountConnect = async () => {
    try {
      const res = await signInWithGoogle();
      if (res.success && res.account) {
        setBackupStatus(getBackupStatus());
        showAlert({
          title: 'Conta Conectada! 🌿',
          message: `Backups e sincronizações vinculados à conta:\n${res.account.email}`,
          icon: 'cloud',
        });
      } else if (res.message && res.message !== 'Login cancelado.') {
        const isBlocked =
          res.message.toLowerCase().includes('bloqueado') ||
          res.message.toLowerCase().includes('verificação') ||
          res.message.toLowerCase().includes('não concluiu');

        if (isBlocked) {
          showAlert({
            title: 'Autorizar no Google Cloud ☁️',
            message:
              'Acesso bloqueado: o Google exige que seu e-mail esteja na lista de "Usuários de teste".\n\nComo liberar:\n1. No painel do Google Cloud, clique no menu "Público-alvo"\n2. Na seção "Usuários de teste", clique em "+ Adicionar usuários"\n3. Digite o seu e-mail do Gmail e salve!\n4. O login funcionará na mesma hora.',
            icon: 'warning',
          });
        } else {
          showAlert({
            title: 'Aviso Google Drive',
            message: res.message,
            icon: 'warning',
          });
        }
      }
    } catch (err: any) {
      const msg = err?.message || '';
      const isBlocked =
        msg.toLowerCase().includes('bloqueado') ||
        msg.toLowerCase().includes('verificação') ||
        msg.toLowerCase().includes('não concluiu');

      if (isBlocked) {
        showAlert({
          title: 'Autorizar no Google Cloud ☁️',
          message:
            'Acesso bloqueado: o Google exige que seu e-mail esteja na lista de "Usuários de teste".\n\nComo liberar:\n1. No painel do Google Cloud, clique em "Público-alvo"\n2. Em "Usuários de teste", adicione seu e-mail do Gmail e salve.\n3. O acesso é liberado imediatamente!',
          icon: 'warning',
        });
      } else {
        showAlert({
          title: 'Erro na Autenticação',
          message: msg || 'Falha ao conectar com o Google.',
          icon: 'error',
        });
      }
    }
  };

  const handleGoogleAccountDisconnect = () => {
    showAlert({
      title: 'Desconectar Google Drive',
      message: `Deseja desconectar a conta ${backupStatus.googleAccount}? Os backups automáticos na nuvem ficarão pausados.`,
      icon: 'warning',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desconectar',
          style: 'destructive',
          onPress: async () => {
            await signOutGoogle();
            setBackupStatus(getBackupStatus());
            showAlert({
              title: 'Desconectado',
              message: 'A conta Google foi desconectada com segurança.',
              icon: 'info',
            });
          },
        },
      ],
    });
  };

  const handleRestoreFromDrive = async () => {
    showAlert({
      title: 'Restaurar da Nuvem (Google Drive)',
      message: 'Isso irá buscar o backup mais recente salvo no seu Google Drive e sincronizar com seu aparelho. Deseja prosseguir?',
      icon: 'cloud',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar Agora',
          style: 'default',
          onPress: async () => {
            try {
              setIsRestoring(true);
              const cloudRes = await downloadBackupFromDriveApi();
              if (!cloudRes.success || !cloudRes.jsonString) {
                setIsRestoring(false);
                showAlert({
                  title: 'Nuvem Google Drive',
                  message: cloudRes.message,
                  icon: 'warning',
                });
                return;
              }
              const restoreRes = await restoreBackup(cloudRes.jsonString);
              setIsRestoring(false);
              if (restoreRes.success) {
                loadData();
                setBackupStatus(getBackupStatus());
                showAlert({
                  title: 'Restauração Concluída! ✨',
                  message: restoreRes.message,
                  icon: 'success',
                });
              } else {
                showAlert({
                  title: 'Erro ao Restaurar',
                  message: restoreRes.message,
                  icon: 'error',
                });
              }
            } catch (err: any) {
              setIsRestoring(false);
              showAlert({
                title: 'Falha na Restauração',
                message: err?.message || 'Não foi possível baixar o backup do Google Drive.',
                icon: 'error',
              });
            }
          },
        },
      ],
    });
  };

  const handleRestoreFromLocal = async () => {
    const local = await checkLocalBackupFile();
    if (!local.exists) {
      showAlert({
        title: 'Nenhum Backup Local Encontrado',
        message: 'Ainda não existe um arquivo de backup local salvo na memória do aparelho. Crie um novo tocando em "Fazer Backup Agora".',
        icon: 'info',
      });
      return;
    }

    showAlert({
      title: 'Restaurar Backup Local',
      message: `Encontrada cópia salva em: ${local.dateText} (${local.sizeText}). Deseja restaurar esses dados?`,
      icon: 'info',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'default',
          onPress: async () => {
            setIsRestoring(true);
            const res = await restoreFromLocalBackup();
            setIsRestoring(false);
            if (res.success) {
              loadData();
              setBackupStatus(getBackupStatus());
              showAlert({
                title: 'Restauração Concluída! ✨',
                message: res.message,
                icon: 'success',
              });
            } else {
              showAlert({
                title: 'Erro ao Restaurar',
                message: res.message,
                icon: 'error',
              });
            }
          },
        },
      ],
    });
  };

  const handlePickAndRestoreFile = async () => {
    try {
      setIsRestoring(true);
      const res = await pickAndRestoreBackup();
      setIsRestoring(false);
      if (res.success) {
        loadData();
        showAlert({
          title: 'Restauração Concluída! ✨',
          message: res.message,
          icon: 'success',
        });
      } else if (res.message && res.message !== 'Nenhum arquivo selecionado.') {
        showAlert({
          title: 'Aviso',
          message: res.message,
          icon: 'warning',
        });
      }
    } catch (e: any) {
      setIsRestoring(false);
      showAlert({
        title: 'Erro',
        message: e?.message || 'Falha ao restaurar arquivo de backup.',
        icon: 'error',
      });
    }
  };

  // Handlers Slideshow
  const handleSelectTrack = (trackId: string) => {
    saveSlideshowTrackId(trackId);
    setSelectedTrackId(trackId);
  };

  const handleSelectSpeed = (speedMs: number) => {
    saveSlideshowSpeed(speedMs);
    setSlideshowSpeed(speedMs);
  };

  const handleToggleMusic = (value: boolean) => {
    setMusicEnabledState(value);
    setSlideshowMusicEnabled(value);
  };

  const handleTogglePreview = (trackId: string) => {
    if (previewingTrackId === trackId) {
      try {
        previewPlayer.pause();
      } catch {
        // ignora
      }
      setPreviewingTrackId(null);
    } else {
      setPreviewingTrackId(trackId);
      try {
        previewPlayer.replace(getTrackById(trackId).asset);
        previewPlayer.play();
      } catch (err) {
        console.warn('Erro ao reproduzir prévia:', err);
      }
    }
  };

  // RENDER DO HUB PRINCIPAL (Agrupado por Opções)
  if (activeSection === null) {
    return (
      <View style={styles.safeArea}>
        <AppHeader subtitle="Definições & Refúgio ✨" icon="settings-outline" />

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Card Resumo do App */}
          <View style={styles.hubHeaderCard}>
            <View style={styles.hubHeaderIconWrap}>
              <Ionicons name="sparkles" size={26} color={COLORS.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hubHeaderTitle}>Tikva Ahuvah</Text>
              <Text style={styles.hubHeaderSub}>
                Toque em uma categoria para personalizar a segurança, backups e visual do seu aplicativo.
              </Text>
            </View>
          </View>

          {/* Categorias Principais em Cards */}
          <View style={styles.categoryCardsList}>
            {/* 1. Backup & Sincronização */}
            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.75}
              onPress={() => setActiveSection('backup')}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="cloud-upload" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryTitle}>Backup & Sincronização</Text>
                <Text style={styles.categoryDescription}>
                  {backupStatus.autoEnabled ? 'Automático Ativo' : 'Manual'} •{' '}
                  {backupStatus.method === 'hybrid'
                    ? 'Híbrido (Local + Drive)'
                    : backupStatus.method === 'remote'
                      ? 'Google Drive'
                      : 'Apenas Local'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* 2. Segurança & Privacidade */}
            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.75}
              onPress={() => setActiveSection('security')}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: COLORS.goldLight }]}>
                <Ionicons name="shield-checkmark" size={24} color={COLORS.gold} />
              </View>
              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryTitle}>Segurança & Privacidade</Text>
                <Text style={styles.categoryDescription}>
                  {securityConfig.isLockEnabled ? 'Bloqueio por PIN Ativo' : 'Desprotegido (abre direto)'}
                  {securityConfig.isLockEnabled && securityConfig.useBiometrics && hasBiometrics
                    ? ' • Biometria'
                    : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* 3. Galeria & Slideshow */}
            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.75}
              onPress={() => setActiveSection('slideshow')}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="images" size={24} color={COLORS.primaryMedium} />
              </View>
              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryTitle}>Galeria & Slideshow</Text>
                <Text style={styles.categoryDescription}>
                  {musicEnabled ? 'Trilha Sonora Ativa' : 'Música Silenciada'} • Transição {(slideshowSpeed / 1000).toFixed(1)}s
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* 4. Sobre o Tikva Ahuvah */}
            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.75}
              onPress={() => setActiveSection('about')}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: COLORS.rubyLight }]}>
                <Ionicons name="heart" size={24} color={COLORS.ruby} />
              </View>
              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryTitle}>Sobre o Tikva Ahuvah</Text>
                <Text style={styles.categoryDescription}>
                  Quem fez, pra quem, versão 2.4 e estatísticas
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Rodapé carinhoso */}
          <View style={styles.hubFooter}>
            <Text style={styles.hubFooterText}>
              &quot;O amor é paciente, é benigno; o amor não arde em ciúmes.&quot;
            </Text>
            <Text style={styles.hubFooterRef}>1 Coríntios 13:4</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // RENDER DE CADA CATEGORIA INDIVIDUAL (Sem Modal!)
  return (
    <View style={styles.safeArea}>
      <AppHeader
        subtitle={
          activeSection === 'backup'
            ? 'Backup & Sincronização'
            : activeSection === 'security'
              ? 'Segurança & Proteção'
              : activeSection === 'slideshow'
                ? 'Galeria & Slideshow'
                : 'Sobre o Tikva Ahuvah'
        }
        icon={
          activeSection === 'backup'
            ? 'cloud-upload'
            : activeSection === 'security'
              ? 'shield-checkmark'
              : activeSection === 'slideshow'
                ? 'images'
                : 'heart'
        }
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Barra Superior de Voltar às Opções */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => setActiveSection(null)}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          <Text style={styles.backRowText}>Voltar para Todas as Configurações</Text>
        </TouchableOpacity>

        {/* -------------------- SEÇÃO 1: BACKUP & NUVEM -------------------- */}
        {activeSection === 'backup' && (
          <View style={styles.sectionWrap}>
            {/* Status & Botão de Backup Imediato */}
            <View style={styles.statusBox}>
              <View style={styles.statusBoxHeader}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                <Text style={styles.statusBoxTitle}>Cópia de Segurança</Text>
              </View>
              <Text style={styles.statusBoxMeta}>
                Último backup: {backupStatus.lastBackupDate} • Tamanho: {backupStatus.lastBackupSize}
              </Text>
              <Text style={styles.statusBoxSub}>
                Guarda com carinho todas as fotos, cartas para o futuro, anotações de fé e memórias.
              </Text>

              <TouchableOpacity
                style={[styles.primaryActionBtn, isBackingUp && { opacity: 0.7 }]}
                activeOpacity={0.8}
                onPress={handlePerformBackupNow}
                disabled={isBackingUp}
              >
                {isBackingUp ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryActionBtnText}>Fazer Backup Agora</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Ativar/Desativar Backup Automático */}
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Backup Automático</Text>
                  <Text style={styles.cardSub}>
                    Garante que nenhuma oração, memória ou poesia seja perdida com o tempo.
                  </Text>
                </View>
                <Switch
                  value={backupStatus.autoEnabled}
                  onValueChange={handleToggleAutoBackup}
                  trackColor={{ false: COLORS.border, true: COLORS.primaryTint }}
                  thumbColor={backupStatus.autoEnabled ? COLORS.primary : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Escolher Método (Local vs Remoto vs Híbrido) */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Método de Armazenamento</Text>
              <Text style={styles.cardSub}>
                Escolha onde suas cópias de segurança serão guardadas com proteção:
              </Text>

              <View style={styles.optionsGrid}>
                {/* Apenas Local */}
                <TouchableOpacity
                  style={[
                    styles.methodOptionCard,
                    backupStatus.method === 'local' && styles.methodOptionCardActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSelectMethod('local')}
                >
                  <View style={styles.methodOptionHeader}>
                    <Ionicons
                      name="phone-portrait-outline"
                      size={22}
                      color={backupStatus.method === 'local' ? COLORS.primary : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.methodOptionTitle,
                        backupStatus.method === 'local' && styles.methodOptionTitleActive,
                      ]}
                    >
                      Apenas Local
                    </Text>
                  </View>
                  <Text style={styles.methodOptionDesc}>
                    Salvo no armazenamento interno seguro do celular. Totalmente offline.
                  </Text>
                </TouchableOpacity>

                {/* Remoto Google Drive */}
                <TouchableOpacity
                  style={[
                    styles.methodOptionCard,
                    backupStatus.method === 'remote' && styles.methodOptionCardActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSelectMethod('remote')}
                >
                  <View style={styles.methodOptionHeader}>
                    <Ionicons
                      name="cloud-outline"
                      size={22}
                      color={backupStatus.method === 'remote' ? COLORS.primary : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.methodOptionTitle,
                        backupStatus.method === 'remote' && styles.methodOptionTitleActive,
                      ]}
                    >
                      Google Drive
                    </Text>
                  </View>
                  <Text style={styles.methodOptionDesc}>
                    Salvo diretamente na sua conta do Google Drive na nuvem.
                  </Text>
                </TouchableOpacity>

                {/* Híbrido */}
                <TouchableOpacity
                  style={[
                    styles.methodOptionCard,
                    backupStatus.method === 'hybrid' && styles.methodOptionCardActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSelectMethod('hybrid')}
                >
                  <View style={styles.methodOptionHeader}>
                    <Ionicons
                      name="layers-outline"
                      size={22}
                      color={backupStatus.method === 'hybrid' ? COLORS.primary : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.methodOptionTitle,
                        backupStatus.method === 'hybrid' && styles.methodOptionTitleActive,
                      ]}
                    >
                      Híbrido (Recomendado)
                    </Text>
                  </View>
                  <Text style={styles.methodOptionDesc}>
                    Salva uma cópia no aparelho e envia outra para o Google Drive.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Conta Google (quando Remoto ou Híbrido) */}
            {(backupStatus.method === 'remote' || backupStatus.method === 'hybrid') && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Conta do Google Drive</Text>
                {backupStatus.googleAccount ? (
                  <View style={styles.accountConnectedWrap}>
                    <View style={styles.accountEmailRow}>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                      <Text style={styles.accountEmailText}>{backupStatus.googleAccount}</Text>
                    </View>
                    <View style={styles.accountButtonsRow}>
                      <TouchableOpacity
                        style={styles.outlineSmallBtn}
                        onPress={handleGoogleAccountConnect}
                      >
                        <Text style={styles.outlineSmallBtnText}>Trocar Conta</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.outlineSmallBtn, { borderColor: COLORS.rubyLight }]}
                        onPress={handleGoogleAccountDisconnect}
                      >
                        <Text style={[styles.outlineSmallBtnText, { color: COLORS.ruby }]}>
                          Desconectar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.accountDisconnectedWrap}>
                    <Text style={styles.accountDisconnectedText}>
                      Nenhuma conta Google conectada no momento.
                    </Text>
                    <TouchableOpacity
                      style={styles.connectGoogleBtn}
                      activeOpacity={0.8}
                      onPress={handleGoogleAccountConnect}
                    >
                      <Ionicons name="logo-google" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.connectGoogleBtnText}>Vincular Conta Google</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Frequência de Agendamento */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Frequência de Agendamento</Text>
              <Text style={styles.cardSub}>
                Com que frequência deseja sincronizar suas recordações:
              </Text>

              <View style={styles.frequencyRow}>
                {(['daily', 'weekly', 'monthly', 'manual'] as const).map((freq) => {
                  const isSelected = backupStatus.frequency === freq;
                  const label =
                    freq === 'daily'
                      ? 'Diário'
                      : freq === 'weekly'
                        ? 'Semanal'
                        : freq === 'monthly'
                          ? 'Mensal'
                          : 'Manual';

                  return (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyChip,
                        isSelected && styles.frequencyChipActive,
                      ]}
                      onPress={() => handleSelectFrequency(freq)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.frequencyChipText,
                          isSelected && styles.frequencyChipTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Opções de Restauração */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Restaurar Recordações</Text>
              <Text style={styles.cardSub}>
                Recupere seu diário caso troque de aparelho ou precise restaurar dados:
              </Text>

              <View style={{ gap: 10, marginTop: 8 }}>
                {(backupStatus.method === 'remote' || backupStatus.method === 'hybrid') && (
                  <TouchableOpacity
                    style={styles.restoreOptionBtn}
                    onPress={handleRestoreFromDrive}
                    disabled={isRestoring}
                  >
                    <Ionicons name="cloud-download-outline" size={20} color={COLORS.primary} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.restoreOptionTitle}>Restaurar da Nuvem (Google Drive)</Text>
                      <Text style={styles.restoreOptionSub}>Baixa o backup salvo na nuvem</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.restoreOptionBtn}
                  onPress={handleRestoreFromLocal}
                  disabled={isRestoring}
                >
                  <Ionicons name="phone-portrait-outline" size={20} color={COLORS.primaryMedium} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.restoreOptionTitle}>Restaurar Cópia Local do Aparelho</Text>
                    <Text style={styles.restoreOptionSub}>Utiliza o arquivo salvo na memória interna</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.restoreOptionBtn}
                  onPress={handlePickAndRestoreFile}
                  disabled={isRestoring}
                >
                  <Ionicons name="document-attach-outline" size={20} color={COLORS.gold} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.restoreOptionTitle}>Importar Arquivo (.json)</Text>
                    <Text style={styles.restoreOptionSub}>Selecione um arquivo de backup externo</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Incluir Fotos */}
              <View style={[styles.settingRow, { marginTop: 16, borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 14 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Incluir Fotos no Backup</Text>
                  <Text style={styles.settingSub}>Anexa todas as imagens salvas no arquivo</Text>
                </View>
                <Switch
                  value={backupStatus.includePhotos}
                  onValueChange={handleToggleIncludePhotos}
                  trackColor={{ false: COLORS.border, true: COLORS.primaryTint }}
                  thumbColor={backupStatus.includePhotos ? COLORS.primary : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        )}

        {/* -------------------- SEÇÃO 2: SEGURANÇA & PROTEÇÃO -------------------- */}
        {activeSection === 'security' && (
          <View style={styles.sectionWrap}>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Bloqueio com Código PIN</Text>
                  <Text style={styles.cardSub}>
                    Exige uma senha de 4 dígitos sempre que o aplicativo for aberto.
                  </Text>
                </View>
                <Switch
                  value={securityConfig.isLockEnabled}
                  onValueChange={handleToggleLock}
                  trackColor={{ false: COLORS.border, true: COLORS.goldTint }}
                  thumbColor={securityConfig.isLockEnabled ? COLORS.gold : '#f4f3f4'}
                />
              </View>

              {securityConfig.isLockEnabled && (
                <View style={{ marginTop: 16, gap: 12 }}>
                  <TouchableOpacity
                    style={styles.outlineFullBtn}
                    onPress={() => setPinModalVisible(true)}
                  >
                    <Ionicons name="key-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.outlineFullBtnText}>Alterar Código PIN de 4 Dígitos</Text>
                  </TouchableOpacity>

                  {hasBiometrics && (
                    <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 14 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.settingLabel}>Desbloqueio com Biometria</Text>
                        <Text style={styles.settingSub}>Use sua digital para acesso instantâneo</Text>
                      </View>
                      <Switch
                        value={securityConfig.useBiometrics}
                        onValueChange={handleToggleBiometrics}
                        trackColor={{ false: COLORS.border, true: COLORS.primaryTint }}
                        thumbColor={securityConfig.useBiometrics ? COLORS.primary : '#f4f3f4'}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* -------------------- SEÇÃO 3: GALERIA & SLIDESHOW -------------------- */}
        {activeSection === 'slideshow' && (
          <View style={styles.sectionWrap}>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Música de Fundo</Text>
                  <Text style={styles.cardSub}>
                    Toca canções instrumentais suaves durante o carrossel de fotos.
                  </Text>
                </View>
                <Switch
                  value={musicEnabled}
                  onValueChange={handleToggleMusic}
                  trackColor={{ false: COLORS.border, true: COLORS.primaryTint }}
                  thumbColor={musicEnabled ? COLORS.primary : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Velocidade dos Slides */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Velocidade de Transição</Text>
              <Text style={styles.cardSub}>Tempo em que cada foto permanece em exibição suave:</Text>

              <View style={styles.speedGrid}>
                {SLIDESHOW_SPEED_OPTIONS.map((opt) => {
                  const isSelected = slideshowSpeed === opt.ms;
                  const speedLabels: Record<number, { sec: string; title: string }> = {
                    2500: { sec: '2.5s', title: 'Rápido' },
                    4000: { sec: '4.0s', title: 'Normal' },
                    6000: { sec: '6.0s', title: 'Suave' },
                    8000: { sec: '8.0s', title: 'Lento' },
                  };
                  const labelInfo = speedLabels[opt.ms] || { sec: `${(opt.ms / 1000).toFixed(1)}s`, title: 'Ritmo' };

                  return (
                    <TouchableOpacity
                      key={opt.ms}
                      style={[styles.speedOptionBtn, isSelected && styles.speedOptionBtnActive]}
                      onPress={() => handleSelectSpeed(opt.ms)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.speedSecText, isSelected && styles.speedSecTextActive]}>
                        {labelInfo.sec}
                      </Text>
                      <Text style={[styles.speedTitleText, isSelected && styles.speedTitleTextActive]}>
                        {labelInfo.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Descrição contextual da velocidade escolhida */}
              <View style={styles.speedActiveDescBox}>
                <Ionicons name="timer-outline" size={16} color={COLORS.primary} />
                <Text style={styles.speedActiveDescText}>
                  {SLIDESHOW_SPEED_OPTIONS.find((s) => s.ms === slideshowSpeed)?.desc || 'Ritmo de transição selecionado'}
                </Text>
              </View>
            </View>

            {/* Trilha Sonora Selecionada */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Trilhas Sonoras Sagradas</Text>
              <Text style={styles.cardSub}>Escolha a harmonia musical para o seu álbum:</Text>

              <View style={{ gap: 10, marginTop: 12 }}>
                {SOUNDTRACKS.map((track) => {
                  const isSelected = selectedTrackId === track.id;
                  const isPreviewing = previewingTrackId === track.id;

                  return (
                    <View
                      key={track.id}
                      style={[
                        styles.trackRow,
                        isSelected && styles.trackRowSelected,
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.trackPlayBtn}
                        onPress={() => handleTogglePreview(track.id)}
                      >
                        <Ionicons
                          name={isPreviewing ? 'pause-circle' : 'play-circle'}
                          size={28}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ flex: 1, paddingVertical: 4 }}
                        onPress={() => handleSelectTrack(track.id)}
                      >
                        <Text style={[styles.trackTitle, isSelected && styles.trackTitleSelected]}>
                          {track.title}
                        </Text>
                        <Text style={styles.trackDesc}>{track.subtitle}</Text>
                      </TouchableOpacity>

                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* -------------------- SEÇÃO 4: SOBRE O TIKVA AHUVAH -------------------- */}
        {activeSection === 'about' && (
          <View style={styles.sectionWrap}>
            {/* Quem Fez e Pra Quem */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Identidade & Propósito</Text>
              <Text style={styles.cardSub}>A história por trás da criação deste refúgio:</Text>

              <View style={styles.authorshipContainer}>
                {/* Quem Fez */}
                <View style={styles.authorshipCard}>
                  <View style={[styles.authorshipIconCircle, { backgroundColor: COLORS.goldLight }]}>
                    <Ionicons name="shield-checkmark" size={22} color={COLORS.gold} />
                  </View>
                  <Text style={styles.authorshipRole}>QUEM FEZ</Text>
                  <Text style={styles.authorshipName}>André Tuti</Text>
                  <View style={styles.authorshipBadge}>
                    <Text style={styles.authorshipBadgeText}>Seu Líder & Companheiro</Text>
                  </View>
                  <Text style={styles.authorshipBio}>
                    Desenvolvido com todo o amor, respeito, orações constantes e zelo para ser um santuário de bênçãos na sua vida.
                  </Text>
                </View>

                {/* Pra Quem */}
                <View style={styles.authorshipCard}>
                  <View style={[styles.authorshipIconCircle, { backgroundColor: COLORS.rubyLight }]}>
                    <Ionicons name="rose" size={22} color={COLORS.ruby} />
                  </View>
                  <Text style={[styles.authorshipRole, { color: COLORS.ruby }]}>PRA QUEM</Text>
                  <Text style={styles.authorshipName}>Tikva Ahuvah</Text>
                  <View style={[styles.authorshipBadge, { backgroundColor: COLORS.rubyLight }]}>
                    <Text style={[styles.authorshipBadgeText, { color: COLORS.ruby }]}>
                      Minha Esperança Amada
                    </Text>
                  </View>
                  <Text style={styles.authorshipBio}>
                    Criado exclusivamente para você guardar os nossos momentos mais preciosos, as promessas de Deus e o nosso amor eterno.
                  </Text>
                </View>
              </View>
            </View>

            {/* Card de Dedicatória */}
            <View style={styles.dedicationCard}>
              <View style={styles.dedicationIconCircle}>
                <Ionicons name="sparkles" size={22} color={COLORS.gold} />
              </View>
              <Text style={styles.dedicationTitle}>Tikva Ahuvah</Text>
              <Text style={styles.dedicationText}>
                {'Este aplicativo foi desenhado como um santuário de afeto, fé e crescimento. Que você nunca se esqueça da pessoa preciosa que você é, da sua força inabalável e do propósito bendito que Deus tem para a sua jornada.'}
              </Text>
              <Text style={styles.dedicationSign}>Com todo o meu amor, orações e carinho ❤️</Text>
            </View>

            {/* Estatísticas */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="images" size={20} color={COLORS.ruby} />
                <Text style={styles.statNumber}>{stats.totalPhotos}</Text>
                <Text style={styles.statLabel}>Galeria</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="sparkles" size={20} color={COLORS.primary} />
                <Text style={styles.statNumber}>{stats.totalMemories}</Text>
                <Text style={styles.statLabel}>Memórias</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="book" size={20} color={COLORS.primaryMedium} />
                <Text style={styles.statNumber}>{stats.totalNotes}</Text>
                <Text style={styles.statLabel}>Pregações</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="mail-open" size={20} color={COLORS.gold} />
                <Text style={styles.statNumber}>{stats.openedCapsules}</Text>
                <Text style={styles.statLabel}>Cartas Lidas</Text>
              </View>
            </View>

            {/* Versão e Notas Técnicas */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informações da Versão</Text>
              <View style={{ gap: 8, marginTop: 8 }}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Versão do Aplicativo</Text>
                  <Text style={styles.infoValue}>2.4.0 (Edição Ouro)</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Arquitetura de Dados</Text>
                  <Text style={styles.infoValue}>SQLite Local + Google Drive API</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Proteção Criptográfica</Text>
                  <Text style={styles.infoValue}>Ativa</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal de Definição de PIN */}
      <PinModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handleSavePinSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  // Barra de Voltar
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backRowText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  // HUB PRINCIPAL
  hubHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F4',
    borderRadius: 22,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#ECE6DA',
    marginBottom: 20,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  hubHeaderIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(194, 142, 52, 0.3)',
  },
  hubHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  hubHeaderSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  categoryCardsList: {
    gap: 14,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE5DB',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  categoryTextWrap: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  categoryDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  hubFooter: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  hubFooterText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  hubFooterRef: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.gold,
    marginTop: 4,
  },
  // SEÇÕES INDIVIDUAIS
  sectionWrap: {
    gap: 16,
  },
  statusBox: {
    backgroundColor: '#F3EFE6',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DDD6C6',
  },
  statusBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statusBoxMeta: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  statusBoxSub: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 14,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAE5DB',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingSub: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // MÉTODOS DE BACKUP (Chips/Cards)
  optionsGrid: {
    gap: 10,
    marginTop: 12,
  },
  methodOptionCard: {
    backgroundColor: '#F9F7F3',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E5DFD4',
  },
  methodOptionCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  methodOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  methodOptionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  methodOptionTitleActive: {
    color: COLORS.primaryDark,
  },
  methodOptionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  // CONTA GOOGLE
  accountConnectedWrap: {
    marginTop: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
  },
  accountEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  accountEmailText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  accountButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineSmallBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  outlineSmallBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  accountDisconnectedWrap: {
    marginTop: 10,
    backgroundColor: '#F9F7F3',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  accountDisconnectedText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  connectGoogleBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectGoogleBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  // FREQUÊNCIA
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  frequencyChip: {
    flex: 1,
    backgroundColor: '#F6F3ED',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2DBD0',
  },
  frequencyChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  frequencyChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  frequencyChipTextActive: {
    color: '#FFFFFF',
  },
  // RESTAURAÇÃO
  restoreOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECE6DC',
  },
  restoreOptionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  restoreOptionSub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  // BOTÕES FULL OUTLINE
  outlineFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 11,
    backgroundColor: COLORS.primaryLight,
  },
  outlineFullBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  // TRILHA SONORA
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECE6DC',
    gap: 10,
  },
  trackRowSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  trackPlayBtn: {
    padding: 2,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  trackTitleSelected: {
    color: COLORS.primaryDark,
  },
  trackDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // DEDICATÓRIA & ESTATÍSTICAS
  dedicationCard: {
    backgroundColor: '#FAF7F1',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DFD0',
  },
  dedicationIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dedicationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.4,
  },
  dedicationText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  dedicationSign: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.ruby,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE7DE',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  // VELOCIDADE DOS SLIDES
  speedGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  speedOptionBtn: {
    flex: 1,
    backgroundColor: '#F6F3ED',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2DBD0',
  },
  speedOptionBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  speedSecText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  speedSecTextActive: {
    color: COLORS.primaryDark,
  },
  speedTitleText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  speedTitleTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  speedActiveDescBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7F5EE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EAE4D6',
  },
  speedActiveDescText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  // QUEM FEZ E PRA QUEM
  authorshipContainer: {
    gap: 12,
    marginTop: 12,
  },
  authorshipCard: {
    backgroundColor: '#FAF7F1',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE2D2',
  },
  authorshipIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  authorshipRole: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.gold,
    marginBottom: 2,
  },
  authorshipName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  authorshipBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  authorshipBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.gold,
  },
  authorshipBio: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
});
