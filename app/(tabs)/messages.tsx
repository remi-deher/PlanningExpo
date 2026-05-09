import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore, Collaborator, Team, Message } from '@/store/useAppStore';
import { shadows } from '@/constants/shadows';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Conversation {
  id: string;
  title: string;
  isTeam: boolean;
  lastMessage?: Message;
  color: string;
  initials: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  return isToday
    ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function buildConversations(
  messages: Message[],
  collaborators: Collaborator[],
  teams: Team[]
): Conversation[] {
  const map: Record<string, Conversation> = {};

  for (const msg of messages) {
    if (msg.teamId) {
      const team = teams.find((t) => t.id === msg.teamId);
      if (!team) continue;
      const key = `team-${msg.teamId}`;
      const prev = map[key];
      if (!prev || new Date(msg.timestamp) > new Date(prev.lastMessage?.timestamp ?? 0)) {
        map[key] = { id: key, title: team.name, isTeam: true, lastMessage: msg, color: team.colorHex, initials: getInitials(team.name) };
      }
    } else if (msg.receiverId) {
      const u1 = collaborators.find((c) => c.id === msg.senderId);
      const u2 = collaborators.find((c) => c.id === msg.receiverId);
      if (!u1 || !u2) continue;
      const key = [u1.id, u2.id].sort().join('-');
      const title = `${u1.firstName} ${u1.lastName} & ${u2.firstName} ${u2.lastName}`;
      const prev = map[key];
      if (!prev || new Date(msg.timestamp) > new Date(prev.lastMessage?.timestamp ?? 0)) {
        map[key] = { id: key, title, isTeam: false, lastMessage: msg, color: '#FF9500', initials: getInitials(title) };
      }
    }
  }

  return Object.values(map).sort((a, b) =>
    new Date(b.lastMessage?.timestamp ?? 0).getTime() - new Date(a.lastMessage?.timestamp ?? 0).getTime()
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

function ConversationRow({ conv }: { conv: Conversation }) {
  return (
    <TouchableOpacity style={styles.convRow} activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: `${conv.color}20` }]}>
        <Text style={[styles.avatarText, { color: conv.color }]}>{conv.initials}</Text>
      </View>
      <View style={styles.convContent}>
        <View style={styles.convHeader}>
          <Text style={styles.convTitle} numberOfLines={1}>{conv.title}</Text>
          {conv.isTeam && (
            <View style={styles.teamBadge}><Text style={styles.teamBadgeText}>Équipe</Text></View>
          )}
          {conv.lastMessage && (
            <Text style={styles.convTime}>{formatDate(conv.lastMessage.timestamp)}</Text>
          )}
        </View>
        {conv.lastMessage && (
          <Text style={styles.convPreview} numberOfLines={2}>{conv.lastMessage.content}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MessagesScreen() {
  const { messages, collaborators, teams } = useAppStore();
  const [search, setSearch] = useState('');

  const conversations = buildConversations(messages, collaborators, teams);
  const filtered = search
    ? conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : conversations;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une conversation..."
          placeholderTextColor="#8E8E93"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>Aucune conversation</Text>
            <Text style={styles.emptySubtitle}>Les messages apparaîtront ici.</Text>
          </View>
        ) : (
          filtered.map((conv) => <ConversationRow key={conv.id} conv={conv} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },

  header: { paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 34, fontWeight: '700', color: '#000' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    ...shadows.small,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },

  list: { padding: 16, paddingTop: 4, gap: 2, paddingBottom: 40 },

  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    gap: 14,
    ...shadows.small,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700' },
  convContent: { flex: 1 },
  convHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  convTitle: { fontSize: 16, fontWeight: '600', color: '#000', flex: 1 },
  teamBadge: { backgroundColor: '#E8F4FD', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  teamBadgeText: { fontSize: 10, color: '#007AFF', fontWeight: '700' },
  convTime: { fontSize: 12, color: '#8E8E93' },
  convPreview: { fontSize: 14, color: '#8E8E93', lineHeight: 18 },

  emptyState: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E' },
  emptySubtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
});
