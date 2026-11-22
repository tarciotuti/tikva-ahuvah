import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Share,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Poem } from '../types';
import { getPoems, insertPoem, updatePoem, deletePoem } from '../services/database';
import { useAlert } from '../context/AlertContext';
import { MANUSCRIPT_ASSETS } from '../utils/manuscriptAssets';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PoemsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const [poems, setPoems] = useState<Poem[]>(() => {
    try {
      return getPoems();
    } catch (err) {
      console.error('Erro ao carregar poemas:', err);
      return [];
    }
  });
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const [showManuscriptModal, setShowManuscriptModal] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthorNote, setFormAuthorNote] = useState('');
  const [formTags, setFormTags] = useState('');

  const loadPoems = useCallback(() => {
    try {
      const data = getPoems();
      setPoems(data);
    } catch (err) {
      console.error('Erro ao carregar poemas:', err);
    }
  }, []);

  const handleOpenEditor = (poemToEdit?: Poem) => {
    if (poemToEdit) {
      setEditingPoem(poemToEdit);
      setFormTitle(poemToEdit.title);
      setFormDate(poemToEdit.date);
      setFormContent(poemToEdit.content);
      setFormAuthorNote(poemToEdit.authorNote || '');
      setFormTags(poemToEdit.tags ? poemToEdit.tags.join(', ') : '');
    } else {
      setEditingPoem(null);
      setFormTitle('');
      setFormDate(new Date().toISOString().slice(0, 10));
      setFormContent('');
      setFormAuthorNote('');
      setFormTags('Poesia, Fé, Esperança');
    }
    setIsEditorOpen(true);
  };

  const handleSavePoem = () => {
    if (!formTitle.trim()) {
      showAlert({
        title: 'Título obrigatório',
        message: 'Por favor, dê um título para o poema ou reflexão.',
        icon: 'warning',
      });
      return;
    }
    if (!formContent.trim()) {
      showAlert({
        title: 'Conteúdo obrigatório',
        message: 'Escreva os versos ou a reflexão.',
        icon: 'warning',
      });
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingPoem) {
      const updated: Poem = {
        ...editingPoem,
        title: formTitle.trim(),
        date: formDate.trim() || editingPoem.date,
        content: formContent.trim(),
        authorNote: formAuthorNote.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };
      updatePoem(updated);
      setSelectedPoem(updated);
    } else {
      const newPoem: Poem = {
        id: `poem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: formTitle.trim(),
        date: formDate.trim() || new Date().toISOString().slice(0, 10),
        content: formContent.trim(),
        authorNote: formAuthorNote.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        isOriginal: true,
        createdAt: Date.now(),
      };
      insertPoem(newPoem);
    }

    setIsEditorOpen(false);
    loadPoems();
  };

  const handleDeletePoem = (poem: Poem) => {
    showAlert({
      title: 'Remover Poema',
      message: `Tem certeza de que deseja remover "${poem.title}"?`,
      icon: 'trash',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            deletePoem(poem.id);
            setSelectedPoem(null);
            loadPoems();
          },
        },
      ],
    });
  };

  const handleSharePoem = async (poem: Poem) => {
    try {
      const message = `📜 *${poem.title}*\n\n${poem.content}\n\n${
        poem.authorNote ? `_Nota: ${poem.authorNote}_\n\n` : ''
      }✨ Tikva Ahuvah • Poemas & Reflexões`;
      await Share.share({ message });
    } catch (err) {
      console.warn('Erro ao compartilhar:', err);
    }
  };

  const renderPoemCard = ({ item }: { item: Poem }) => {
    const previewLines = item.content.split('\n').filter((l) => l.trim().length > 0).slice(0, 3).join('\n');

    return (
      <TouchableOpacity
        style={styles.poemCard}
        activeOpacity={0.88}
        onPress={() => setSelectedPoem(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="flower-outline" size={18} color="#C28E34" />
            <Text style={styles.cardDate}>{item.date}</Text>
          </View>
          {item.isOriginal && (
            <View style={styles.originalBadge}>
              <Text style={styles.originalBadgeText}>Autoral</Text>
            </View>
          )}
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardPreview}>{previewLines}...</Text>

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {item.tags.map((t, idx) => (
              <View key={idx} style={styles.tagPill}>
                <Text style={styles.tagPillText}>#{t}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.readMoreText}>Tocar para ler completo</Text>
          <Ionicons name="chevron-forward" size={16} color="#24523F" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#24523F" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Poemas & Reflexões</Text>
          <Text style={styles.headerSubtitle}>Versos que brotam da alma e da fé</Text>
        </View>

        <TouchableOpacity
          style={styles.newPoemButton}
          onPress={() => handleOpenEditor()}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Decorative intro banner */}
      <View style={styles.introBanner}>
        <Ionicons name="book-outline" size={28} color="#C28E34" />
        <View style={styles.introTextContainer}>
          <Text style={styles.introTitle}>O Cantinho dos Seus Versos 🌿</Text>
          <Text style={styles.introDesc}>
            Aqui estão guardadas as poesias e orações que você escreveu ao longo dos anos. Cada palavra reflete a sua essência, fé e recomeço.
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={poems}
        keyExtractor={(item) => item.id}
        renderItem={renderPoemCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={48} color="#D8D2C2" />
            <Text style={styles.emptyTitle}>Nenhum poema registrado ainda</Text>
            <Text style={styles.emptySubtitle}>
              Toque no ícone de caneta no topo para compor uma nova poesia ou oração.
            </Text>
          </View>
        }
      />

      {/* FULLSCREEN READING MODAL */}
      <Modal
        visible={!!selectedPoem}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPoem(null)}
      >
        {selectedPoem && (
          <View style={[styles.readingContainer, { paddingTop: Math.max(insets.top, 20) }]}>
            {/* Modal Header */}
            <View style={styles.readingHeader}>
              <TouchableOpacity
                onPress={() => setSelectedPoem(null)}
                style={styles.closeModalButton}
              >
                <Ionicons name="close" size={24} color="#24523F" />
              </TouchableOpacity>

              <View style={styles.readingHeaderActions}>
                <TouchableOpacity
                  onPress={() => handleSharePoem(selectedPoem)}
                  style={styles.iconAction}
                >
                  <Ionicons name="share-social-outline" size={22} color="#24523F" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handleOpenEditor(selectedPoem);
                  }}
                  style={styles.iconAction}
                >
                  <Ionicons name="pencil-outline" size={22} color="#24523F" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeletePoem(selectedPoem)}
                  style={styles.iconAction}
                >
                  <Ionicons name="trash-outline" size={22} color="#9E2A3B" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.readingScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Crest & Title */}
              <View style={styles.readingCrest}>
                <Ionicons name="sparkles" size={24} color="#C28E34" />
                <Text style={styles.readingDate}>{selectedPoem.date}</Text>
              </View>

              <Text style={styles.readingTitle}>{selectedPoem.title}</Text>

              {/* Decorative line */}
              <View style={styles.ornamentLine}>
                <View style={styles.lineSegment} />
                <Ionicons name="rose-outline" size={18} color="#9E2A3B" />
                <View style={styles.lineSegment} />
              </View>

              {/* Stanzas */}
              <View style={styles.stanzasBox}>
                <Text style={styles.readingContent}>{selectedPoem.content}</Text>
              </View>

              {/* Author note */}
              {selectedPoem.authorNote && (
                <View style={styles.authorNoteBox}>
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#C28E34" />
                  <Text style={styles.authorNoteText}>{selectedPoem.authorNote}</Text>
                </View>
              )}

              {/* Tags */}
              {selectedPoem.tags && (
                <View style={styles.readingTagsRow}>
                  {selectedPoem.tags.map((t, idx) => (
                    <View key={idx} style={styles.readingTagBadge}>
                      <Text style={styles.readingTagText}>#{t}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Botão de Ver Manuscrito Original (se disponível) */}
              {MANUSCRIPT_ASSETS[selectedPoem.id] && (
                <TouchableOpacity
                  style={styles.manuscriptButton}
                  activeOpacity={0.85}
                  onPress={() => setShowManuscriptModal(true)}
                >
                  <View style={styles.manuscriptIconCircle}>
                    <Ionicons name="document-text" size={20} color="#C28E34" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.manuscriptButtonTitle}>Ver Poema Manuscrito Original 📜</Text>
                    <Text style={styles.manuscriptButtonSub}>Toque para ver a folha e a escrita original</Text>
                  </View>
                  <Ionicons name="eye-outline" size={20} color="#24523F" />
                </TouchableOpacity>
              )}

              <View style={styles.readingSignature}>
                <Text style={styles.readingSignatureText}>Tikvá Sheli 🌿 Escrito com amor</Text>
              </View>
            </ScrollView>

            {/* Modal para Visualização do Manuscrito do Poema */}
            {MANUSCRIPT_ASSETS[selectedPoem.id] && (
              <Modal
                visible={showManuscriptModal}
                animationType="fade"
                transparent={false}
                onRequestClose={() => setShowManuscriptModal(false)}
              >
                <SafeAreaView style={styles.manuscriptModalContainer}>
                  <View style={styles.manuscriptModalHeader}>
                    <View>
                      <Text style={styles.manuscriptModalTitle}>Manuscrito do Poema 📜</Text>
                      <Text style={styles.manuscriptModalSub}>Poema original escrito à mão</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.manuscriptModalClose}
                      onPress={() => setShowManuscriptModal(false)}
                    >
                      <Ionicons name="close" size={24} color="#24523F" />
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
                      source={MANUSCRIPT_ASSETS[selectedPoem.id]}
                      style={styles.manuscriptFullImage}
                      resizeMode="contain"
                    />
                  </ScrollView>
                </SafeAreaView>
              </Modal>
            )}
          </View>
        )}
      </Modal>

      {/* EDITOR / COMPOSER MODAL */}
      <Modal
        visible={isEditorOpen}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setIsEditorOpen(false)}
      >
        <View style={[styles.editorContainer, { paddingTop: Math.max(insets.top, 20) }]}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={() => setIsEditorOpen(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.editorTitle}>
              {editingPoem ? 'Editar Poema' : 'Novo Poema ou Salmo'}
            </Text>
            <TouchableOpacity onPress={handleSavePoem}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editorBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Título do Poema</Text>
            <TextInput
              style={styles.textInput}
              value={formTitle}
              onChangeText={setFormTitle}
              placeholder="Ex: Recomeço, A Cada Amanhecer..."
              placeholderTextColor="#8A928A"
            />

            <Text style={styles.fieldLabel}>Data</Text>
            <TextInput
              style={styles.textInput}
              value={formDate}
              onChangeText={setFormDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#8A928A"
            />

            <Text style={styles.fieldLabel}>Versos / Estrofes</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formContent}
              onChangeText={setFormContent}
              placeholder="Escreva aqui os versos inspirados pelo Senhor..."
              placeholderTextColor="#8A928A"
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>Nota / Contexto (Opcional)</Text>
            <TextInput
              style={styles.textInput}
              value={formAuthorNote}
              onChangeText={setFormAuthorNote}
              placeholder="Ex: Escrito após o clamor da madrugada..."
              placeholderTextColor="#8A928A"
            />

            <Text style={styles.fieldLabel}>Tags (Separadas por vírgula)</Text>
            <TextInput
              style={styles.textInput}
              value={formTags}
              onChangeText={setFormTags}
              placeholder="Fé, Esperança, Louvor"
              placeholderTextColor="#8A928A"
            />

            <View style={{ height: 60 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F1',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE5D8',
    backgroundColor: '#F8F6F1',
  },
  backButton: {
    padding: 8,
    marginRight: 6,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#24523F',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6E776E',
    marginTop: 1,
  },
  newPoemButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#24523F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#24523F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  introBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6DFCE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  introTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24523F',
  },
  introDesc: {
    fontSize: 12.5,
    color: '#556055',
    lineHeight: 18,
    marginTop: 3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  poemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E8E1D1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8C7A58',
    marginLeft: 6,
  },
  originalBadge: {
    backgroundColor: '#F5EFE1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8C9A7',
  },
  originalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A6820',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#24523F',
    marginBottom: 6,
  },
  cardPreview: {
    fontSize: 14,
    color: '#4B554B',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: '#F2EFE9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  tagPillText: {
    fontSize: 11,
    color: '#5A675A',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3EFE6',
    paddingTop: 10,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#24523F',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#526052',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#7F8C7F',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },

  // Reading Modal Styles
  readingContainer: {
    flex: 1,
    backgroundColor: '#FBF9F4',
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE5D8',
  },
  closeModalButton: {
    padding: 8,
  },
  readingHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconAction: {
    padding: 8,
    marginLeft: 6,
  },
  readingScroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
  },
  readingCrest: {
    alignItems: 'center',
    marginBottom: 8,
  },
  readingDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8C7A58',
    marginTop: 4,
  },
  readingTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#24523F',
    textAlign: 'center',
    marginBottom: 12,
  },
  ornamentLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  lineSegment: {
    width: 60,
    height: 1,
    backgroundColor: '#DDCFB8',
    marginHorizontal: 10,
  },
  stanzasBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#EAE1D2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  readingContent: {
    fontSize: 17,
    color: '#2A382A',
    lineHeight: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  authorNoteBox: {
    flexDirection: 'row',
    backgroundColor: '#F4ECE1',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  authorNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#695738',
    marginLeft: 10,
    lineHeight: 19,
  },
  readingTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 18,
  },
  readingTagBadge: {
    backgroundColor: '#EAE5D8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    margin: 4,
  },
  readingTagText: {
    fontSize: 12,
    color: '#5C675C',
    fontWeight: '600',
  },
  readingSignature: {
    alignItems: 'center',
    marginTop: 28,
  },
  readingSignatureText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#8A968A',
  },
  manuscriptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EA',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6D9BE',
    marginTop: 20,
    marginBottom: 4,
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
    backgroundColor: '#F3E8D2',
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

  // Editor Modal Styles
  editorContainer: {
    flex: 1,
    backgroundColor: '#F8F6F1',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE5D8',
  },
  cancelText: {
    fontSize: 15,
    color: '#6A756A',
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#24523F',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24523F',
  },
  editorBody: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#24523F',
    marginTop: 12,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCD4C4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2C352C',
  },
  textArea: {
    minHeight: 180,
    lineHeight: 24,
  },
});
