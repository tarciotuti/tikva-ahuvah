import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TIMELINE_MILESTONES, CONVERSATION_SNIPPETS } from '../data/timelineData';
import { TimelineMilestone, ConversationSnippet } from '../types';

export default function TimelineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'marcos' | 'trechos'>('marcos');
  const [expandedSnippetId, setExpandedSnippetId] = useState<string | null>(null);

  const handleShareSnippet = async (item: ConversationSnippet) => {
    try {
      const dialog = item.messages
        .map((m) => `[${m.time}] *${m.sender}*: ${m.text}`)
        .join('\n\n');
      const text = `📜 *${item.title}* (${item.date})\n\n${dialog}\n\n✨ Tikva Ahuvah • Trechos da Nossa História`;
      await Share.share({ message: text });
    } catch (err) {
      console.warn('Erro ao compartilhar trecho:', err);
    }
  };

  const renderMilestone = ({ item, index }: { item: TimelineMilestone; index: number }) => {
    const isLast = index === TIMELINE_MILESTONES.length - 1;

    return (
      <View style={styles.milestoneRow}>
        {/* Timeline spine & icon */}
        <View style={styles.spineColumn}>
          <View style={styles.milestoneIconCircle}>
            <Ionicons name={item.icon as any} size={18} color="#C28E34" />
          </View>
          {!isLast && <View style={styles.spineLine} />}
        </View>

        {/* Milestone card */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneBadgeRow}>
            <View style={styles.yearBadge}>
              <Text style={styles.yearBadgeText}>{item.year}</Text>
            </View>
            <Text style={styles.milestoneDateText}>{item.date}</Text>
          </View>

          <Text style={styles.milestoneTitle}>{item.title}</Text>
          <Text style={styles.milestoneSubtitle}>{item.subtitle}</Text>
          <Text style={styles.milestoneDescription}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderSnippet = ({ item }: { item: ConversationSnippet }) => {
    const isExpanded = expandedSnippetId === item.id;

    return (
      <TouchableOpacity
        style={[styles.snippetCard, isExpanded && styles.snippetCardExpanded]}
        activeOpacity={0.88}
        onPress={() => setExpandedSnippetId((prev) => (prev === item.id ? null : item.id))}
      >
        {/* Snippet Header */}
        <View style={styles.snippetHeader}>
          <View style={styles.snippetNumberBadge}>
            <Text style={styles.snippetNumberText}>Trecho #{item.number}</Text>
          </View>
          <View style={styles.snippetHeaderRight}>
            <Ionicons name="calendar-outline" size={13} color="#8A7B60" />
            <Text style={styles.snippetDate}>{item.date}</Text>
            {isExpanded && (
              <TouchableOpacity
                onPress={() => handleShareSnippet(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="share-social-outline" size={16} color="#24523F" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.snippetTitle}>{item.title}</Text>

        {!isExpanded ? (
          // VISÃO COMPACTA: Apenas 1 ou 2 linhas
          <View style={styles.compactContainer}>
            <Text style={styles.compactPreviewText} numberOfLines={2}>
              &ldquo;{item.messages[0]?.text || item.context}&rdquo;
            </Text>
            <View style={styles.compactFooterRow}>
              <View style={styles.compactMsgBadge}>
                <Ionicons name="chatbubbles-outline" size={13} color="#24523F" />
                <Text style={styles.compactMsgBadgeText}>
                  {item.messages.length} {item.messages.length === 1 ? 'mensagem' : 'mensagens'}
                </Text>
              </View>
              <View style={styles.compactOpenLink}>
                <Text style={styles.compactOpenLinkText}>Toque para ler completo</Text>
                <Ionicons name="chevron-down" size={15} color="#24523F" />
              </View>
            </View>
          </View>
        ) : (
          // VISÃO COMPLETA E DETALHADA
          <View style={styles.expandedContainer}>
            <Text style={styles.snippetContext}>{item.context}</Text>

            {/* Conversation Dialog Bubbles */}
            <View style={styles.dialogContainer}>
              {item.messages.map((m, idx) => {
                const isEla = m.sender === 'Ela';

                return (
                  <View
                    key={idx}
                    style={[
                      styles.bubbleWrapper,
                      isEla ? styles.bubbleLeft : styles.bubbleRight,
                    ]}
                  >
                    <View
                      style={[
                        styles.chatBubble,
                        isEla ? styles.bubbleEla : styles.bubbleEle,
                      ]}
                    >
                      <View style={styles.bubbleHeader}>
                        <Text
                          style={[
                            styles.bubbleSender,
                            isEla ? styles.senderEla : styles.senderEle,
                          ]}
                        >
                          {isEla ? 'Ela (Tikvá)' : 'Ele (Líder)'}
                        </Text>
                        <Text style={styles.bubbleTime}>{m.time}</Text>
                      </View>
                      <Text style={styles.bubbleText}>{m.text}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Tags & Botão Recolher */}
            <View style={styles.expandedFooterRow}>
              {item.tags && item.tags.length > 0 && (
                <View style={styles.snippetTagsRow}>
                  {item.tags.map((t, idx) => (
                    <View key={idx} style={styles.snippetTagPill}>
                      <Text style={styles.snippetTagText}>#{t}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.collapseLink}>
                <Text style={styles.collapseLinkText}>Recolher conversa</Text>
                <Ionicons name="chevron-up" size={15} color="#8A7B60" />
              </View>
            </View>
          </View>
        )}
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
          <Text style={styles.headerTitle}>Nossa Linha do Tempo</Text>
          <Text style={styles.headerSubtitle}>Marcos & Trechos da Nossa História (2021 – 2026)</Text>
        </View>
      </View>

      {/* Segmented Control Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'marcos' && styles.activeTabButton]}
          onPress={() => setActiveTab('marcos')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="hourglass-outline"
            size={16}
            color={activeTab === 'marcos' ? '#FFFFFF' : '#4E5A4E'}
          />
          <Text
            style={[styles.tabButtonText, activeTab === 'marcos' && styles.activeTabText]}
          >
            Marcos da História
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'trechos' && styles.activeTabButton]}
          onPress={() => setActiveTab('trechos')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chatbubbles-outline"
            size={16}
            color={activeTab === 'trechos' ? '#FFFFFF' : '#4E5A4E'}
          />
          <Text
            style={[styles.tabButtonText, activeTab === 'trechos' && styles.activeTabText]}
          >
            Trechos Marcantes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {activeTab === 'marcos' ? (
        <FlatList
          data={TIMELINE_MILESTONES}
          keyExtractor={(item) => item.id}
          renderItem={renderMilestone}
          contentContainerStyle={styles.timelineContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerBanner}>
              <Ionicons name="trail-sign-outline" size={26} color="#C28E34" />
              <View style={styles.headerBannerText}>
                <Text style={styles.headerBannerTitle}>A Jornada de Fé & Amor 🌿</Text>
                <Text style={styles.headerBannerDesc}>
                  Mais de 5 anos construídos sobre a rocha: desde as primeiras madrugadas de clamor em 2021 até hoje.
                </Text>
              </View>
            </View>
          }
        />
      ) : (
        <FlatList
          data={CONVERSATION_SNIPPETS}
          keyExtractor={(item) => item.id}
          renderItem={renderSnippet}
          contentContainerStyle={styles.snippetsContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerBanner}>
              <Ionicons name="chatbubble-ellipses-outline" size={26} color="#9E2A3B" />
              <View style={styles.headerBannerText}>
                <Text style={styles.headerBannerTitle}>Diálogos que Marcaram o Coração 💌</Text>
                <Text style={styles.headerBannerDesc}>
                  Momentos autênticos da nossa conversa: da oração na madrugada às risadas e ao consolo na fraqueza.
                </Text>
              </View>
            </View>
          }
        />
      )}
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
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6E776E',
    marginTop: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: '#EBE6DC',
    borderRadius: 14,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
  },
  activeTabButton: {
    backgroundColor: '#24523F',
    shadowColor: '#24523F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#526052',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6DFCE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerBannerText: {
    flex: 1,
    marginLeft: 14,
  },
  headerBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24523F',
  },
  headerBannerDesc: {
    fontSize: 12.5,
    color: '#556055',
    lineHeight: 18,
    marginTop: 3,
  },

  // Milestones styles
  timelineContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  milestoneRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  spineColumn: {
    alignItems: 'center',
    width: 36,
    marginRight: 12,
  },
  milestoneIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3ECDE',
    borderWidth: 2,
    borderColor: '#C28E34',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  spineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D8CCA8',
    marginVertical: 4,
  },
  milestoneCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8E1D1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  milestoneBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  yearBadge: {
    backgroundColor: '#24523F',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  yearBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  milestoneDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8C7A58',
  },
  milestoneTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#24523F',
    marginBottom: 3,
  },
  milestoneSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9E2A3B',
    marginBottom: 8,
  },
  milestoneDescription: {
    fontSize: 13.5,
    color: '#4B574B',
    lineHeight: 21,
  },

  // Snippets styles
  snippetsContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  snippetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E1D1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  snippetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  snippetNumberBadge: {
    backgroundColor: '#F5EFE1',
    borderWidth: 1,
    borderColor: '#D8C9A7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
  },
  snippetNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A6820',
  },
  snippetHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snippetDate: {
    fontSize: 12,
    color: '#8A7B60',
    marginLeft: 4,
    fontWeight: '600',
  },
  snippetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#24523F',
    marginBottom: 3,
  },
  snippetContext: {
    fontSize: 12.5,
    color: '#657365',
    marginBottom: 12,
  },

  // Chat bubbles
  dialogContainer: {
    backgroundColor: '#F9F7F2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  bubbleWrapper: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRight: {
    justifyContent: 'flex-end',
  },
  chatBubble: {
    maxWidth: '85%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleEla: {
    backgroundColor: '#FFF0F2',
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#F3D4D8',
  },
  bubbleEle: {
    backgroundColor: '#EAF3EE',
    borderTopRightRadius: 2,
    borderWidth: 1,
    borderColor: '#CBE2D4',
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  bubbleSender: {
    fontSize: 11,
    fontWeight: '700',
    marginRight: 12,
  },
  senderEla: {
    color: '#9E2A3B',
  },
  senderEle: {
    color: '#24523F',
  },
  bubbleTime: {
    fontSize: 10,
    color: '#99A399',
  },
  bubbleText: {
    fontSize: 13.5,
    color: '#2F382F',
    lineHeight: 19,
  },

  // Leader Note
  leaderNoteBox: {
    flexDirection: 'row',
    backgroundColor: '#FBF5EB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8DCC6',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  leaderNoteText: {
    flex: 1,
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#6B5838',
    marginLeft: 8,
    lineHeight: 18,
  },
  snippetTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  snippetTagPill: {
    backgroundColor: '#F0ECE4',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 6,
    marginTop: 2,
  },
  snippetTagText: {
    fontSize: 11,
    color: '#687568',
  },
  snippetCardExpanded: {
    borderColor: '#C28E34',
    borderWidth: 1.5,
  },
  compactContainer: {
    marginTop: 6,
  },
  compactPreviewText: {
    fontSize: 13,
    color: '#556658',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  compactFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3EDE0',
  },
  compactMsgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EAF3EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  compactMsgBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#24523F',
  },
  compactOpenLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactOpenLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#24523F',
  },
  expandedContainer: {
    marginTop: 6,
  },
  expandedFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  collapseLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  collapseLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A7B60',
  },
});
