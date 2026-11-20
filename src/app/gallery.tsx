import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { COLORS } from '../constants/theme';
import { GalleryPhoto } from '../types';
import {
  getGalleryPhotos,
  saveGalleryPhoto,
  deleteGalleryPhoto,
  updateGalleryPhotoCaption,
} from '../services/database';
import { saveImageToAppDirectory } from '../services/backup';
import { ensureBundledGalleryLoaded } from '../data/bundledGallery';
import {
  getSavedSlideshowTrackId,
  isSlideshowMusicEnabled,
  getTrackById,
  saveSlideshowTrackId,
  setSlideshowMusicEnabled,
  SOUNDTRACKS,
  getSlideshowSpeed,
  saveSlideshowSpeed,
} from '../services/audio';
import { useAlert } from '../context/AlertContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 44) / 2;

function setAudioPlayerLoop(p: any, loop: boolean) {
  try {
    p.loop = loop;
  } catch (err) {
    console.warn('Erro ao configurar loop de áudio:', err);
  }
}

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Áudio e Trilha Sonora do Slideshow
  const [selectedTrackId, setSelectedTrackId] = useState(() => getSavedSlideshowTrackId());
  const [musicEnabled, setMusicEnabledState] = useState(() => isSlideshowMusicEnabled());
  const [slideSpeed, setSlideSpeed] = useState(() => getSlideshowSpeed());
  const activeTrack = getTrackById(selectedTrackId);

  const player = useAudioPlayer(activeTrack.asset);

  // Modal para Adicionar Foto
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [captionInput, setCaptionInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Visualizador Fullscreen / Slideshow
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const slideListRef = useRef<FlatList>(null);
  const autoPlayTimerRef = useRef<any>(null);
  const autoHideTimerRef = useRef<any>(null);

  // Animação Ken Burns (Zoom e Crossfade Suave)
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [scaleAnim] = useState(() => new Animated.Value(1));

  // Edição de Legenda no Visualizador
  const [editingCaption, setEditingCaption] = useState(false);
  const [editCaptionText, setEditCaptionText] = useState('');

  const resetAutoHide = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    autoHideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  }, []);

  const toggleControls = useCallback(() => {
    setShowControls((prev) => {
      const next = !prev;
      if (next) {
        resetAutoHide();
      } else if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
      return next;
    });
  }, [resetAutoHide]);

  const loadPhotos = useCallback(async () => {
    try {
      let items = getGalleryPhotos();
      if (items.length === 0) {
        await ensureBundledGalleryLoaded();
        items = getGalleryPhotos();
      }
      setPhotos(items);
    } catch (e) {
      console.error('Erro ao carregar fotos da galeria:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
      setSelectedTrackId(getSavedSlideshowTrackId());
      setMusicEnabledState(isSlideshowMusicEnabled());
      setSlideSpeed(getSlideshowSpeed());
    }, [loadPhotos])
  );

  // Controle de reprodução de áudio durante o Slideshow
  useEffect(() => {
    if (viewerVisible && musicEnabled) {
      try {
        setAudioPlayerLoop(player, activeTrack.isLoop);
        player.play();
      } catch (err) {
        console.warn('Erro ao iniciar áudio do slideshow:', err);
      }
    } else {
      try {
        player.pause();
      } catch {
        // silencia se já pausado
      }
    }
  }, [viewerVisible, musicEnabled, activeTrack, player]);

  const toggleMusicPlayback = () => {
    const nextState = !musicEnabled;
    setMusicEnabledState(nextState);
    setSlideshowMusicEnabled(nextState);
    resetAutoHide();
  };

  const cycleSoundtrack = () => {
    const trackIds = SOUNDTRACKS.map((t) => t.id);
    const currIdx = trackIds.indexOf(selectedTrackId);
    const nextTrackId = trackIds[(currIdx + 1) % trackIds.length];
    saveSlideshowTrackId(nextTrackId);
    setSelectedTrackId(nextTrackId);
    resetAutoHide();
  };

  const cycleSlideshowSpeed = () => {
    const speeds = [2500, 4000, 6000, 8000];
    const currIdx = speeds.indexOf(slideSpeed);
    const nextSpeed = speeds[(currIdx + 1) % speeds.length];
    saveSlideshowSpeed(nextSpeed);
    setSlideSpeed(nextSpeed);
    resetAutoHide();
  };

  // Efeito Ken Burns a cada troca de foto
  useEffect(() => {
    if (viewerVisible) {
      fadeAnim.setValue(0.35);
      scaleAnim.setValue(1.0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.055,
          duration: slideSpeed,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentIndex, viewerVisible, slideSpeed, fadeAnim, scaleAnim]);

  // Controle de Slideshow Automático (com velocidade configurável)
  useEffect(() => {
    if (isAutoPlaying && viewerVisible && photos.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % photos.length;
          slideListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
          return nextIndex;
        });
      }, slideSpeed);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isAutoPlaying, viewerVisible, photos.length, slideSpeed]);

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showAlert({
          title: 'Permissão Necessária',
          message: 'Conceda acesso à galeria para adicionar suas fotos.',
          icon: 'warning',
        });
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setSelectedImageUri(res.assets[0].uri);
      }
    } catch (err) {
      console.error(err);
      showAlert({
        title: 'Erro',
        message: 'Não foi possível carregar a imagem selecionada.',
        icon: 'error',
      });
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showAlert({
          title: 'Permissão Necessária',
          message: 'Conceda permissão de câmera para capturar sua foto.',
          icon: 'warning',
        });
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.85,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setSelectedImageUri(res.assets[0].uri);
      }
    } catch (err) {
      console.error(err);
      showAlert({
        title: 'Erro',
        message: 'Não foi possível abrir a câmera.',
        icon: 'error',
      });
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedImageUri) {
      showAlert({
        title: 'Selecione uma foto',
        message: 'Escolha uma foto ou tire uma nova antes de salvar.',
        icon: 'warning',
      });
      return;
    }

    try {
      setIsSaving(true);
      const permanentUri = await saveImageToAppDirectory(selectedImageUri);
      saveGalleryPhoto({
        uri: permanentUri,
        caption: captionInput.trim(),
        date: new Date().toISOString().slice(0, 10),
      });

      setSelectedImageUri(null);
      setCaptionInput('');
      setAddModalVisible(false);
      loadPhotos();
    } catch (err) {
      console.error(err);
      showAlert({
        title: 'Erro',
        message: 'Falha ao salvar a foto na galeria.',
        icon: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openFullscreenViewer = (index: number, startAutoPlay = false) => {
    setCurrentIndex(index);
    setIsAutoPlaying(startAutoPlay);
    setShowControls(true);
    setViewerVisible(true);
    setEditingCaption(false);
    resetAutoHide();
  };

  const closeFullscreenViewer = () => {
    setIsAutoPlaying(false);
    setViewerVisible(false);
    setEditingCaption(false);
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
  };

  const handlePrevSlide = () => {
    if (photos.length <= 1) return;
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(prevIdx);
    slideListRef.current?.scrollToIndex({ index: prevIdx, animated: true });
    resetAutoHide();
  };

  const handleNextSlide = () => {
    if (photos.length <= 1) return;
    const nextIdx = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIdx);
    slideListRef.current?.scrollToIndex({ index: nextIdx, animated: true });
    resetAutoHide();
  };

  const handleDeleteCurrentPhoto = () => {
    if (photos.length === 0) return;
    const currentPhoto = photos[currentIndex];
    showAlert({
      title: 'Remover Foto',
      message: 'Tem certeza de que deseja apagar esta foto da sua galeria?',
      icon: 'trash',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => {
            deleteGalleryPhoto(currentPhoto.id);
            const remaining = photos.filter((_, idx) => idx !== currentIndex);
            setPhotos(remaining);
            if (remaining.length === 0) {
              closeFullscreenViewer();
            } else {
              const nextIdx = Math.min(currentIndex, remaining.length - 1);
              setCurrentIndex(nextIdx);
              slideListRef.current?.scrollToIndex({ index: nextIdx, animated: false });
            }
          },
        },
      ],
    });
  };

  const handleShareCurrentPhoto = async () => {
    if (photos.length === 0) return;
    const currentPhoto = photos[currentIndex];
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showAlert({
          title: 'Aviso',
          message: 'O compartilhamento não está disponível neste dispositivo.',
          icon: 'warning',
        });
        return;
      }
      await Sharing.shareAsync(currentPhoto.uri, {
        dialogTitle: 'Compartilhar Foto de Tikva Ahuvah',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCaptionEdit = () => {
    if (photos.length === 0) return;
    const currentPhoto = photos[currentIndex];
    updateGalleryPhotoCaption(currentPhoto.id, editCaptionText.trim());
    setPhotos((prev) =>
      prev.map((p, idx) => (idx === currentIndex ? { ...p, caption: editCaptionText.trim() } : p))
    );
    setEditingCaption(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Barra de Topo Elegante */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>ÁLBUM VISUAL</Text>
          <Text style={styles.headerTitle}>Galeria de Fotos 📷</Text>
        </View>

        <View style={styles.headerActions}>
          {photos.length > 0 && (
            <TouchableOpacity
              style={styles.slideshowHeaderBtn}
              activeOpacity={0.8}
              onPress={() => openFullscreenViewer(0, true)}
            >
              <Ionicons name="play" size={16} color={COLORS.white} />
              <Text style={styles.slideshowHeaderBtnText}>Slide</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.addHeaderBtn}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedImageUri(null);
              setCaptionInput('');
              setAddModalVisible(true);
            }}
          >
            <Ionicons name="add" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subheader com contador */}
      <View style={styles.subHeader}>
        <View style={styles.photoCountBadge}>
          <Ionicons name="images" size={14} color={COLORS.primary} />
          <Text style={styles.photoCountText}>
            {photos.length} {photos.length === 1 ? 'registro' : 'registros'} guardados
          </Text>
        </View>

        {photos.length > 0 && (
          <TouchableOpacity
            style={styles.slideshowLink}
            activeOpacity={0.7}
            onPress={() => openFullscreenViewer(0, true)}
          >
            <Ionicons name="play-circle-outline" size={18} color={COLORS.ruby} />
            <Text style={styles.slideshowLinkText}>Ver como Slide</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Conteúdo da Galeria */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="camera-outline" size={48} color={COLORS.primaryMedium} />
          </View>
          <Text style={styles.emptyTitle}>Sua galeria está vazia</Text>
          <Text style={styles.emptyDescription}>
            Guarde aqui seus momentos doces, sorrisos, passeios e registros que aquecem o coração. Todas as fotos ficam salvas no seu backup com segurança vitalícia!
          </Text>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            activeOpacity={0.85}
            onPress={() => {
              setSelectedImageUri(null);
              setCaptionInput('');
              setAddModalVisible(true);
            }}
          >
            <Ionicons name="add-circle" size={20} color={COLORS.white} />
            <Text style={styles.emptyAddBtnText}>Adicionar Primeira Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom, 24) + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.photoCard}
              activeOpacity={0.88}
              onPress={() => openFullscreenViewer(index, false)}
            >
              <Image source={{ uri: item.uri }} style={styles.photoThumbnail} resizeMode="cover" />
              <View style={styles.photoCardOverlay}>
                <View style={styles.photoDatePill}>
                  <Text style={styles.photoDateText}>{item.date}</Text>
                </View>
              </View>
              {item.caption ? (
                <View style={styles.photoCaptionBox}>
                  <Text style={styles.photoCaptionText} numberOfLines={2}>
                    {item.caption}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}

      {/* MODAL: Adicionar Nova Foto */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSubtitle}>MEMÓRIA VISUAL</Text>
                <Text style={styles.modalTitle}>Adicionar à Galeria 🌿</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Imagem Selecionada ou Seletor */}
            {selectedImageUri ? (
              <View style={styles.previewImageContainer}>
                <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.changeImagePill}
                  activeOpacity={0.8}
                  onPress={handlePickFromGallery}
                >
                  <Ionicons name="swap-horizontal" size={16} color={COLORS.white} />
                  <Text style={styles.changeImageText}>Trocar Imagem</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pickOptionsRow}>
                <TouchableOpacity
                  style={styles.pickOptionCard}
                  activeOpacity={0.8}
                  onPress={handleTakePhoto}
                >
                  <View style={[styles.pickIconCircle, { backgroundColor: COLORS.rubyLight }]}>
                    <Ionicons name="camera" size={28} color={COLORS.ruby} />
                  </View>
                  <Text style={styles.pickOptionTitle}>Tirar Foto</Text>
                  <Text style={styles.pickOptionSub}>Usar a câmera agora</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pickOptionCard}
                  activeOpacity={0.8}
                  onPress={handlePickFromGallery}
                >
                  <View style={[styles.pickIconCircle, { backgroundColor: COLORS.primaryLight }]}>
                    <Ionicons name="images" size={28} color={COLORS.primary} />
                  </View>
                  <Text style={styles.pickOptionTitle}>Escolher do Celular</Text>
                  <Text style={styles.pickOptionSub}>Buscar na galeria</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Campo de Legenda Opcional */}
            <Text style={styles.inputLabel}>Legenda ou Recordação (Opcional):</Text>
            <TextInput
              style={styles.captionInput}
              placeholder="Ex: Um dia especial de muita paz e sorrisos..."
              placeholderTextColor={COLORS.textMuted}
              value={captionInput}
              onChangeText={setCaptionInput}
              multiline
              maxLength={200}
            />

            {/* Botão de Salvar */}
            <TouchableOpacity
              style={[
                styles.savePhotoBtn,
                (!selectedImageUri || isSaving) && { opacity: 0.6 },
              ]}
              activeOpacity={0.85}
              onPress={handleSavePhoto}
              disabled={!selectedImageUri || isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                  <Text style={styles.savePhotoBtnText}>Guardar Foto</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL FULLSCREEN: Apresentação de Slide / Visualizador Imersivo */}
      <Modal
        visible={viewerVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={closeFullscreenViewer}
      >
        <SafeAreaView style={styles.fullscreenSafe} edges={['top', 'bottom']}>
          <StatusBar style="light" />

          {/* Carrossel Paginado de Fotos em Tela Inteira */}
          <FlatList
            ref={slideListRef}
            data={photos}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={currentIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const newIdx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentIndex(newIdx);
              setEditingCaption(false);
              resetAutoHide();
            }}
            renderItem={({ item, index }) => (
              <Pressable style={styles.slideImagePressable} onPress={toggleControls}>
                <Animated.View
                  style={[
                    styles.slideImageContainer,
                    index === currentIndex && {
                      opacity: fadeAnim,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.slideFullImage}
                    resizeMode="contain"
                  />
                </Animated.View>
              </Pressable>
            )}
          />

          {/* BOTÕES DE NAVEGAÇÃO LATERAIS (FLUTUANTES) */}
          {showControls && photos.length > 1 && (
            <>
              <TouchableOpacity
                style={styles.floatingNavLeft}
                activeOpacity={0.7}
                onPress={handlePrevSlide}
              >
                <Ionicons name="chevron-back" size={28} color={COLORS.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.floatingNavRight}
                activeOpacity={0.7}
                onPress={handleNextSlide}
              >
                <Ionicons name="chevron-forward" size={28} color={COLORS.white} />
              </TouchableOpacity>
            </>
          )}

          {/* OVERLAY SUPERIOR: CONTROLES DO SLIDESHOW */}
          {showControls && (
            <View style={styles.slideHeaderOverlay}>
              <View style={styles.slideHeader}>
                {/* Botão Parar / Fechar */}
                <TouchableOpacity
                  style={styles.slideStopBtn}
                  activeOpacity={0.75}
                  onPress={closeFullscreenViewer}
                >
                  <Ionicons name="close-circle" size={22} color="#ff6b6b" />
                  <Text style={styles.slideStopBtnText}>Parar</Text>
                </TouchableOpacity>

                {/* Contador de Slides */}
                <View style={styles.slideCounterBadge}>
                  <Text style={styles.slideCounterText}>
                    {photos.length > 0 ? `${currentIndex + 1} de ${photos.length}` : ''}
                  </Text>
                </View>

                {/* Controles de Áudio: Silenciar & Trocar Música */}
                <View style={styles.slideAudioControls}>
                  <TouchableOpacity
                    style={[
                      styles.slideMusicPill,
                      !musicEnabled && styles.slideMusicPillMuted,
                    ]}
                    activeOpacity={0.8}
                    onPress={toggleMusicPlayback}
                  >
                    <Ionicons
                      name={musicEnabled ? 'volume-high' : 'volume-mute'}
                      size={16}
                      color={musicEnabled ? COLORS.gold : '#aaa'}
                    />
                    <Text
                      style={[
                        styles.slideMusicPillText,
                        !musicEnabled && { color: '#aaa' },
                      ]}
                      numberOfLines={1}
                    >
                      {musicEnabled ? activeTrack.shortName : 'Silenciado'}
                    </Text>
                  </TouchableOpacity>

                  {/* Alternar Trilha */}
                  <TouchableOpacity
                    style={styles.slideIconBtn}
                    activeOpacity={0.8}
                    onPress={cycleSoundtrack}
                  >
                    <Ionicons name="musical-notes" size={17} color={COLORS.gold} />
                  </TouchableOpacity>
                </View>

                {/* Ações: Compartilhar & Apagar */}
                <View style={styles.slideTopActions}>
                  <TouchableOpacity
                    style={styles.slideIconBtn}
                    activeOpacity={0.8}
                    onPress={handleShareCurrentPhoto}
                  >
                    <Ionicons name="share-social-outline" size={18} color={COLORS.white} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.slideIconBtn}
                    activeOpacity={0.8}
                    onPress={handleDeleteCurrentPhoto}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Indicador de Transição Automática */}
              {isAutoPlaying && (
                <View style={styles.autoPlayIndicatorBar}>
                  <Ionicons name="sparkles" size={13} color={COLORS.gold} />
                  <Text style={styles.autoPlayIndicatorText}>
                    Reprodução contínua ativa ({(slideSpeed / 1000).toFixed(1)}s)
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* OVERLAY INFERIOR: CONTROLES DE REPRODUÇÃO & LEGENDA */}
          {showControls && photos.length > 0 && (
            <View style={styles.slideFooterOverlay}>
              {/* Barra de Ações Rápidas: Play/Pause e Seletor de Velocidade */}
              <View style={styles.slideControlBar}>
                {/* Botão Play / Pausa */}
                <TouchableOpacity
                  style={[
                    styles.slidePlayPauseBtn,
                    isAutoPlaying && styles.slidePlayPauseBtnActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    setIsAutoPlaying(!isAutoPlaying);
                    resetAutoHide();
                  }}
                >
                  <Ionicons
                    name={isAutoPlaying ? 'pause' : 'play'}
                    size={20}
                    color={COLORS.white}
                  />
                  <Text style={styles.slidePlayPauseBtnText}>
                    {isAutoPlaying ? 'Pausar' : 'Iniciar Slide'}
                  </Text>
                </TouchableOpacity>

                {/* Ajuste Rápido de Velocidade */}
                <TouchableOpacity
                  style={styles.slideSpeedPill}
                  activeOpacity={0.8}
                  onPress={cycleSlideshowSpeed}
                >
                  <Ionicons name="speedometer-outline" size={15} color={COLORS.gold} />
                  <Text style={styles.slideSpeedPillText}>
                    {(slideSpeed / 1000).toFixed(1)}s
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Metadados e Legenda */}
              <View style={styles.slideFooterMeta}>
                <View style={styles.slideDateBadge}>
                  <Ionicons name="calendar-outline" size={13} color={COLORS.gold} />
                  <Text style={styles.slideDateText}>{photos[currentIndex]?.date}</Text>
                </View>

                <TouchableOpacity
                  style={styles.editCaptionLink}
                  activeOpacity={0.7}
                  onPress={() => {
                    setEditCaptionText(photos[currentIndex]?.caption || '');
                    setEditingCaption(true);
                  }}
                >
                  <Ionicons name="create-outline" size={14} color={COLORS.goldLight} />
                  <Text style={styles.editCaptionLinkText}>
                    {photos[currentIndex]?.caption ? 'Editar legenda' : 'Adicionar legenda'}
                  </Text>
                </TouchableOpacity>
              </View>

              {editingCaption ? (
                <View style={styles.inlineEditCaptionContainer}>
                  <TextInput
                    style={styles.inlineEditInput}
                    value={editCaptionText}
                    onChangeText={setEditCaptionText}
                    placeholder="Escreva a legenda..."
                    placeholderTextColor="#888"
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.inlineEditSaveBtn}
                    onPress={handleSaveCaptionEdit}
                  >
                    <Ionicons name="checkmark" size={18} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.inlineEditCancelBtn}
                    onPress={() => setEditingCaption(false)}
                  >
                    <Ionicons name="close" size={18} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ) : photos[currentIndex]?.caption ? (
                <Text style={styles.slideCaptionText}>{photos[currentIndex]?.caption}</Text>
              ) : (
                <Text style={styles.slideNoCaptionText}>Sem legenda anotada</Text>
              )}
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slideshowHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.ruby,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  slideshowHeaderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  addHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  photoCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  photoCountText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  slideshowLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  slideshowLinkText: {
    fontSize: 13,
    color: COLORS.ruby,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  photoCard: {
    width: COLUMN_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  photoThumbnail: {
    width: '100%',
    height: COLUMN_WIDTH * 1.15,
    backgroundColor: COLORS.border,
  },
  photoCardOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  photoDatePill: {
    backgroundColor: 'rgba(23, 49, 39, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  photoDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  photoCaptionBox: {
    padding: 8,
    backgroundColor: COLORS.surface,
  },
  photoCaptionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyAddBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalCloseBtn: {
    padding: 6,
  },
  pickOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  pickOptionCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
  },
  pickIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  pickOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  pickOptionSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  previewImageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    height: 200,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  changeImagePill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(23, 49, 39, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  captionInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  savePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingVertical: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  savePhotoBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  // FULLSCREEN SLIDESHOW
  fullscreenSafe: {
    flex: 1,
    backgroundColor: '#030705',
    position: 'relative',
  },
  slideImagePressable: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030705',
  },
  slideImageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideFullImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  floatingNavLeft: {
    position: 'absolute',
    left: 14,
    top: '48%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  floatingNavRight: {
    position: 'absolute',
    right: 14,
    top: '48%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  slideHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: 'rgba(5, 10, 7, 0.85)',
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  slideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  slideStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 107, 107, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  slideStopBtnText: {
    color: '#ff8585',
    fontSize: 12,
    fontWeight: '700',
  },
  slideCounterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  slideCounterText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  slideAudioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  slideMusicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(194, 142, 52, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(194, 142, 52, 0.35)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    maxWidth: 130,
  },
  slideMusicPillMuted: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  slideMusicPillText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '600',
  },
  slideTopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slideIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoPlayIndicatorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(194, 142, 52, 0.16)',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  autoPlayIndicatorText: {
    color: COLORS.gold,
    fontSize: 11.5,
    fontWeight: '600',
  },
  slideFooterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: 'rgba(5, 10, 7, 0.88)',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  slideControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  slidePlayPauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  slidePlayPauseBtnActive: {
    backgroundColor: COLORS.ruby,
  },
  slidePlayPauseBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  slideSpeedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(194, 142, 52, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  slideSpeedPillText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  slideFooterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  slideDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slideDateText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  editCaptionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editCaptionLinkText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  slideCaptionText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  slideNoCaptionText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  inlineEditCaptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineEditInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    color: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  inlineEditSaveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineEditCancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
