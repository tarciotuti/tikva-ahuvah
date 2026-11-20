import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, CATEGORIES } from '../constants/theme';
import { saveMemory } from '../services/database';
import { saveImageToAppDirectory } from '../services/backup';
import { useAlert } from '../context/AlertContext';

export default function NewMemoryScreen() {
  const { showAlert } = useAlert();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(CATEGORIES[1].label);
  const [location, setLocation] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const availableCategories = CATEGORIES.filter((c) => c.label !== 'Todas');

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        showAlert({
          title: 'Permissão Necessária',
          message: 'Precisamos de acesso às suas fotos para você escolher uma imagem para a sua memória.',
          icon: 'warning',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao escolher imagem:', error);
      showAlert({
        title: 'Erro',
        message: 'Não foi possível carregar a foto selecionada.',
        icon: 'error',
      });
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        showAlert({
          title: 'Permissão Necessária',
          message: 'Precisamos de acesso à câmera para registrar este momento.',
          icon: 'warning',
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.85,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      showAlert({
        title: 'Erro',
        message: 'Não foi possível acionar a câmera.',
        icon: 'error',
      });
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showAlert({
        title: 'Título obrigatório',
        message: 'Dê um nome especial para essa memória.',
        icon: 'warning',
      });
      return;
    }

    if (!description.trim()) {
      showAlert({
        title: 'História obrigatória',
        message: 'Conte um pouquinho sobre como foi esse momento.',
        icon: 'warning',
      });
      return;
    }

    try {
      setIsSaving(true);

      let savedPhotoUri: string | undefined = undefined;
      if (photoUri) {
        savedPhotoUri = await saveImageToAppDirectory(photoUri);
      }

      saveMemory({
        title: title.trim(),
        description: description.trim(),
        date,
        category,
        location: location.trim() || undefined,
        photoUri: savedPhotoUri,
        isFavorite,
      });

      showAlert({
        title: 'Memória Guardada! ✨',
        message: 'Este momento foi adicionado ao seu baú com sucesso.',
        icon: 'success',
        buttons: [
          {
            text: 'Concluir',
            style: 'default',
            onPress: () => router.back(),
          },
        ],
      });
    } catch (error) {
      console.error('Erro ao salvar memória:', error);
      showAlert({
        title: 'Erro',
        message: 'Ocorreu um erro ao salvar a memória. Tente novamente.',
        icon: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Barra Superior */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.circleButton}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Guardar Nova Memória</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Área da Foto */}
          <View style={styles.section}>
            <Text style={styles.label}>Foto do Momento (Opcional)</Text>
            {photoUri ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => setPhotoUri(null)}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoActionsRow}>
                <TouchableOpacity
                  style={styles.photoActionButton}
                  activeOpacity={0.8}
                  onPress={handlePickImage}
                >
                  <Ionicons name="images-outline" size={24} color={COLORS.primary} />
                  <Text style={styles.photoActionText}>Escolher da Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoActionButton}
                  activeOpacity={0.8}
                  onPress={handleTakePhoto}
                >
                  <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
                  <Text style={styles.photoActionText}>Tirar Foto Agora</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.label}>Título da Memória *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Aquela tarde no parque, Culto especial..."
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Categoria */}
          <View style={styles.section}>
            <Text style={styles.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {availableCategories.map((c) => {
                const isSelected = category === c.label;
                return (
                  <TouchableOpacity
                    key={c.label}
                    activeOpacity={0.7}
                    onPress={() => setCategory(c.label)}
                    style={[
                      styles.chip,
                      isSelected ? styles.chipSelected : styles.chipDefault,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected ? styles.chipTextSelected : styles.chipTextDefault,
                      ]}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Data e Local */}
          <View style={styles.row}>
            <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2024-05-18"
                placeholderTextColor={COLORS.textMuted}
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Lugar / Cidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Praia, Igreja, Em casa"
                placeholderTextColor={COLORS.textMuted}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* História */}
          <View style={styles.section}>
            <Text style={styles.label}>História / Sentimento *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="O que aconteceu? Por que este momento foi especial? O que você sentiu?"
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* Favoritar */}
          <TouchableOpacity
            style={styles.favToggleRow}
            activeOpacity={0.8}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? COLORS.ruby : COLORS.textMuted}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.favToggleTitle}>Destacar como Favorita</Text>
              <Text style={styles.favToggleDesc}>
                Ficará no topo do seu baú para sempre ser lembrada
              </Text>
            </View>
          </TouchableOpacity>

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Ionicons name="sparkles" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Guardando no Baú...' : 'Guardar esta Memória'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 120,
    lineHeight: 22,
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoActionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    backgroundColor: COLORS.surfaceSubtle,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipDefault: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextDefault: {
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.white,
  },
  favToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 24,
  },
  favToggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  favToggleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
