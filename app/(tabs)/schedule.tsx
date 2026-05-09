import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { shadows } from '@/constants/shadows';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDay(date: Date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase().slice(0, 3);
}

function formatDayNumber(date: Date) {
  return date.getDate().toString();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function getDaysFromToday(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

// ─── Components ───────────────────────────────────────────────────────────────

function DateCard({ date, isSelected, onPress }: { date: Date; isSelected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.dateCard, isSelected && styles.dateCardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.dateDayLabel, isSelected && styles.dateTextSelected]}>{formatDay(date)}</Text>
      <Text style={[styles.dateDayNumber, isSelected && styles.dateTextSelected]}>{formatDayNumber(date)}</Text>
    </TouchableOpacity>
  );
}

function ScheduleCard({ schedule, collaboratorName, collaboratorRole, notes }: {
  schedule: { id: string; startTime: string; endTime: string };
  collaboratorName: string;
  collaboratorRole: string;
  notes?: string;
}) {
  return (
    <View style={styles.scheduleCard}>
      <View style={styles.cardAccent} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardName}>{collaboratorName}</Text>
            <Text style={styles.cardRole}>{collaboratorRole}</Text>
          </View>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{formatDateShort(schedule.startTime)}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.timeRow}>
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.timeText}>
              {formatTime(schedule.startTime)} – {formatTime(schedule.endTime)}
            </Text>
          </View>
          {notes && (
            <View style={styles.notesBadge}>
              <Text style={styles.notesBadgeText}>{notes}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ScheduleScreen() {
  const { schedules, collaborators } = useAppStore();
  const days = getDaysFromToday(7);
  const [selectedDate, setSelectedDate] = useState(days[0]);

  const filteredSchedules = schedules.filter((s) =>
    isSameDay(new Date(s.startTime), selectedDate)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Planning</Text>
      </View>

      {/* Horizontal Date Picker */}
      <View style={styles.datePicker}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datePickerContent}>
          {days.map((d) => (
            <DateCard
              key={d.toISOString()}
              date={d}
              isSelected={isSameDay(d, selectedDate)}
              onPress={() => setSelectedDate(d)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Schedule List */}
      <ScrollView contentContainerStyle={styles.list}>
        {filteredSchedules.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Aucun shift prévu</Text>
            <Text style={styles.emptySubtitle}>Ajoutez des shifts depuis les Paramètres.</Text>
          </View>
        ) : (
          filteredSchedules.map((schedule) => {
            const collab = collaborators.find((c) => c.id === schedule.collaboratorId);
            return (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                collaboratorName={collab ? `${collab.firstName} ${collab.lastName}` : 'Inconnu'}
                collaboratorRole={collab?.role ?? ''}
                notes={schedule.notes}
              />
            );
          })
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

  datePicker: { backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5EA' },
  datePickerContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  dateCard: {
    width: 55, height: 72, borderRadius: 14,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center', alignItems: 'center', gap: 4,
  },
  dateCardSelected: { backgroundColor: '#007AFF' },
  dateDayLabel: { fontSize: 11, fontWeight: '700', color: '#8E8E93' },
  dateDayNumber: { fontSize: 20, fontWeight: '700', color: '#000' },
  dateTextSelected: { color: '#fff' },

  list: { padding: 16, gap: 12, paddingBottom: 40 },

  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardAccent: { width: 6, backgroundColor: '#FF9500' },
  cardContent: { flex: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#000' },
  cardRole: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  dateBadge: { backgroundColor: '#F2F2F7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  dateBadgeText: { fontSize: 11, color: '#8E8E93', fontWeight: '600' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeIcon: { fontSize: 14 },
  timeText: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  notesBadge: { backgroundColor: '#E8F4FD', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  notesBadgeText: { fontSize: 11, color: '#007AFF', fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E' },
  emptySubtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
});
