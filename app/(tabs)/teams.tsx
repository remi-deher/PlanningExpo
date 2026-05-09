import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { shadows } from '@/constants/shadows';

// ─── Components ───────────────────────────────────────────────────────────────

function TeamSection({ teamId, teamName, teamColor }: { teamId: string; teamName: string; teamColor: string }) {
  const { collaborators } = useAppStore();
  const members = collaborators.filter((c) => c.teamId === teamId);

  return (
    <View style={[styles.teamSection, shadows.medium]}>
      {/* Team Header */}
      <View style={[styles.teamHeader, { backgroundColor: `${teamColor}15` }]}>
        <View style={[styles.teamDot, { backgroundColor: teamColor }]} />
        <Text style={[styles.teamName, { color: teamColor }]}>{teamName}</Text>
        <View style={[styles.memberCountBadge, { backgroundColor: teamColor }]}>
          <Text style={styles.memberCountText}>{members.length}</Text>
        </View>
      </View>

      {members.length === 0 ? (
        <Text style={styles.noMembers}>Aucun membre dans cette équipe</Text>
      ) : (
        members.map((member) => (
          <View key={member.id} style={styles.memberRow}>
            <View style={[styles.memberAvatar, { backgroundColor: `${teamColor}20` }]}>
              <Text style={[styles.memberAvatarText, { color: teamColor }]}>
                {member.firstName[0]}{member.lastName[0]}
              </Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.firstName} {member.lastName}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{member.role}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TeamsScreen() {
  const { teams, collaborators } = useAppStore();
  const noTeamMembers = collaborators.filter((c) => !c.teamId);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Équipes</Text>
        <Text style={styles.statsText}>{teams.length} équipes · {collaborators.length} membres</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {teams.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>Aucune équipe</Text>
            <Text style={styles.emptySubtitle}>Ajoutez des équipes depuis les Paramètres.</Text>
          </View>
        ) : (
          teams.map((team) => (
            <TeamSection key={team.id} teamId={team.id} teamName={team.name} teamColor={team.colorHex} />
          ))
        )}
        {noTeamMembers.length > 0 && (
          <TeamSection teamId="__none__" teamName="Sans équipe" teamColor="#8E8E93" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 34, fontWeight: '700', color: '#000', marginBottom: 4 },
  statsText: { fontSize: 14, color: '#8E8E93', fontWeight: '500' },

  list: { padding: 16, gap: 16, paddingBottom: 40 },

  teamSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  teamHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  teamDot: { width: 10, height: 10, borderRadius: 5 },
  teamName: { flex: 1, fontSize: 16, fontWeight: '700' },
  memberCountBadge: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  memberCountText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  noMembers: { fontSize: 13, color: '#8E8E93', padding: 14, paddingTop: 0 },

  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  memberAvatarText: { fontSize: 14, fontWeight: '700' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: '600', color: '#000' },
  memberRole: { fontSize: 13, color: '#8E8E93', marginTop: 1 },
  roleTag: { backgroundColor: '#F2F2F7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  roleTagText: { fontSize: 11, color: '#8E8E93', fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E' },
  emptySubtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
});
