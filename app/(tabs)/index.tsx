import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppStore } from '@/store/useAppStore';

export default function DashboardScreen() {
  const { teams, collaborators, schedules } = useAppStore();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="default">Bonjour,</ThemedText>
            <ThemedText type="title">Gestionnaire</ThemedText>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <IconSymbol name="person.fill" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Grid Stats */}
        <View style={styles.grid}>
          <StatCard 
            title="Équipes" 
            value={String(teams.length)} 
            icon="square.grid.2x2.fill" 
            accent="#007AFF" 
          />
          <StatCard 
            title="Membres" 
            value={String(collaborators.length)} 
            icon="person.3.fill" 
            accent="#34C759" 
          />
          <StatCard 
            title="Shifts" 
            value={String(schedules.length)} 
            icon="clock.fill" 
            accent="#FF9500" 
          />
          <StatCard 
            title="Alertes" 
            value="0" 
            icon="bell.fill" 
            accent="#FF3B30" 
          />
        </View>

        {/* Recent Schedules */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Aujourd'hui</ThemedText>
          {schedules.length === 0 ? (
            <ThemedText style={styles.emptyText}>Aucun shift prévu</ThemedText>
          ) : (
            schedules.map((schedule) => {
              const collaborator = collaborators.find(c => c.id === schedule.collaboratorId);
              return (
                <View key={schedule.id} style={styles.scheduleRow}>
                  <View style={[styles.dot, { backgroundColor: '#007AFF' }]} />
                  <View style={styles.scheduleInfo}>
                    <ThemedText type="defaultSemiBold">
                      {collaborator ? `${collaborator.firstName} ${collaborator.lastName}` : 'Inconnu'}
                    </ThemedText>
                    <ThemedText type="default" style={styles.subtext}>
                      {collaborator?.role || 'Rôle inconnu'}
                    </ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold">
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </ThemedText>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function StatCard({ title, value, icon, accent }: { title: string, value: string, icon: any, accent: string }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${accent}15` }]}>
        <IconSymbol name={icon} size={20} color={accent} />
      </View>
      <ThemedText style={[styles.cardValue, { color: accent }]}>{value}</ThemedText>
      <ThemedText type="default" style={styles.cardTitle}>{title}</ThemedText>
    </View>
  );
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60, // Space for status bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 30,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  section: {
    marginTop: 10,
  },
  emptyText: {
    color: '#8E8E93',
    marginTop: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 15,
  },
  scheduleInfo: {
    flex: 1,
  },
  subtext: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
