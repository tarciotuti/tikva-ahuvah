import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NOTE_TYPES } from '../constants/theme';
import { saveNote } from '../services/database';
import { NoteType } from '../types';

export default function NewNoteScreen() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NoteType>('pregacao');
  const [scripture, setScripture] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const availableTypes = NOTE_TYPES.filter((t) => t.id !== 'todas');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Título obrigatório', 'Dê um título para essa mensagem ou anotação.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Conteúdo obrigatório', 'Escreva as anotações ou pontos principais.');
      return;
    }

    try {
      setIsSaving(true);
      saveNote({
        title: title.trim(),
        type,
        scripture: scripture.trim() || undefined,
        speaker: speaker.trim() || undefined,
        content: content.trim(),
        date,
        isFavorite,
      });

      Alert.alert('Anotação Salva! 📖', 'Guardada no seu caderno com sucesso.', [
        {
          text: 'Ver no Caderno',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a anotação.');
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
          <Text style={styles.topBarTitle}>Nova Anotação de Fé</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Tipo de Nota */}
          <Text style={styles.sectionLabel}>Tipo de Anotação</Text>
          <View style={styles.typesRow}>
            {availableTypes.map((t) => {
              const isSelected = type === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  activeOpacity={0.7}
                  onPress={() => setType(t.id as NoteType)}
                  style={[
                    styles.typeChip,
                    isSelected && { backgroundColor: t.color, borderColor: t.color },
                  ]}
                >
                  <Ionicons
                    name={t.icon as any}
                    size={14}
                    color={isSelected ? COLORS.white : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeChipText,
                      isSelected ? styles.typeChipTextSelected : styles.typeChipTextDefault,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Título */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título da Mensagem ou Nota *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: A Esperança que Renova, Culto de Jovens..."
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Passagem Bíblica (especialmente útil para Pregação e Devocional) */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="bookmark-outline" size={14} color={COLORS.primary} />
              <Text style={styles.labelInline}>Passagem Bíblica / Versículo (Opcional)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ex: Romanos 8:28, Isaías 40:29-31, Salmos 23"
              placeholderTextColor={COLORS.textMuted}
              value={scripture}
              onChangeText={setScripture}
            />
          </View>

          {/* Pregador / Autor */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Pregador / Autor</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Pr. Daniel, Conferência"
                placeholderTextColor={COLORS.textMuted}
                value={speaker}
                onChangeText={setSpeaker}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={COLORS.textMuted}
                value={date}
                onChangeText={setDate}
              />
            </View>
          </View>

          {/* Conteúdo / Anotações */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Anotações & Pontos Marcantes *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escreva os pontos principais da palavra, o que falou ao seu coração, insights e orações..."
              placeholderTextColor={COLORS.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>

          {/* Destacar como Favorita */}
          <TouchableOpacity
            style={styles.favToggleRow}
            activeOpacity={0.8}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? COLORS.ruby : COLORS.textMuted}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.favToggleTitle}>Salvar nos Favoritos do Coração</Text>
              <Text style={styles.favToggleDesc}>Ficará destacada no topo do seu caderno</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Guardando no Caderno...' : 'Salvar no Meu Caderno'}
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeChipTextDefault: {
    color: COLORS.textSecondary,
  },
  typeChipTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  inputGroup: {
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  labelInline: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
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
    minHeight: 160,
    lineHeight: 22,
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
