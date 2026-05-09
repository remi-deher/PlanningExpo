import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppStore } from '@/store/useAppStore';
import { shadows } from '@/constants/shadows';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour 👋';
  if (h < 18) return 'Bon après-midi 👋';
  return 'Bonsoir 👋';
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatCard({ title, value, icon, accent }: {
  title: string; value: string; icon: any; accent: string;
}) {
  return (
    <View style={[styles.card, shadows.medium]}>
      <View style={[styles.iconContainer, { backgroundColor: `${accent}15` }]}>
        <IconSymbol name={icon} size={20} color={accent} />
      </View>
      <Text style={[styles.cardValue, { color: accent }]}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

function ScheduleRow({ name, role, start, end }: {
  name: string; role: string; start: string; end: string;
}) {
  return (
    <View style={[styles.scheduleRow, shadows.small]}>
      <View style={styles.dot} />
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleName}>{name}</Text>
        <Text style={styles.scheduleRole}>{role}</Text>
      </View>
      <Text style={styles.scheduleTime}>{formatTime(start)} – {formatTime(end)}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { teams, collaborators, schedules } = useAppStore();

  // Show only today's schedules
  const today = new Date();
  const todaySchedules = schedules.filter((s) => {
    const d = new Date(s.startTime);
    return d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.title}>Gestionnaire</Text>
          </View>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
            <IconSymbol name="person.fill" size={22} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.grid}>
          <StatCard title="Équipes"  value={String(teams.length)}         icon="square.grid.2x2.fill" accent="#007AFF" />
          <StatCard title="Membres"  value={String(collaborators.length)}  icon="person.3.fill"        accent="#34C759" />
          <StatCard title="Shifts"   value={String(schedules.length)}      icon="clock.fill"           accent="#FF9500" />
          <StatCard title="Alertes"  value="0"                             icon="bell.fill"            accent="#FF3B30" />
        </View>

        {/* Today's Shifts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          {todaySchedules.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyLabel}>Aucun shift prévu aujourd'hui</Text>
            </View>
          ) : (
            todaySchedules.map((s) => {
              const collab = collaborators.find((c) => c.id === s.collaboratorId);
              return (
                <ScheduleRow
                  key={s.id}
                  name={collab ? `${collab.firstName} ${collab.lastName}` : 'Inconnu'}
                  role={collab?.role ?? ''}
                  start={s.startTime}
                  end={s.endTime}
                />
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scrollContent: { padding: 20, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 15, color: '#8E8E93', fontWeight: '500', marginBottom: 2 },
  title: { fontSize: 34, fontWeight: '700', color: '#000' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F4FD', justifyContent: 'center', alignItems: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, marginBottom: 28 },

  card: { width: '47%', backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  iconContainer: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardValue: { fontSize: 30, fontWeight: '700', marginBottom: 4 },
  cardTitle: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },

  section: {},
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 12 },

  scheduleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#007AFF', marginRight: 14 },
  scheduleInfo: { flex: 1 },
  scheduleName: { fontSize: 15, fontWeight: '600', color: '#000' },
  scheduleRole: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  scheduleTime: { fontSize: 13, fontWeight: '600', color: '#007AFF' },

  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyLabel: { fontSize: 15, color: '#8E8E93' },
});
