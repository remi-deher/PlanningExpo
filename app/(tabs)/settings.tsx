import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { shadows } from '@/constants/shadows';

// ─── Add Team Form ─────────────────────────────────────────────────────────────

function AddTeamForm({ onClose }: { onClose: () => void }) {
  const addTeam = useAppStore((s) => s.addTeam);
  const [name, setName] = useState('');
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const submit = () => {
    if (!name.trim()) { Alert.alert('Champ requis', "Saisissez un nom d'équipe."); return; }
    addTeam({ id: Math.random().toString(36).slice(2), name: name.trim(), colorHex: selectedColor, icon: 'people' });
    onClose();
  };

  return (
    <SafeAreaView style={styles.formContainer} edges={['top']}>
      <Text style={styles.formTitle}>Nouvelle équipe</Text>
      <TextInput style={styles.input} placeholder="Nom de l'équipe" value={name} onChangeText={setName} />
      <Text style={styles.inputLabel}>Couleur</Text>
      <View style={styles.colorRow}>
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotSelected]}
            onPress={() => setSelectedColor(c)}
          />
        ))}
      </View>
      <View style={styles.formActions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelText}>Annuler</Text></TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={submit}><Text style={styles.submitText}>Ajouter</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Add Collaborator Form ─────────────────────────────────────────────────────

function AddCollaboratorForm({ onClose }: { onClose: () => void }) {
  const { teams, addCollaborator } = useAppStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');

  const submit = () => {
    if (!firstName.trim() || !lastName.trim() || !role.trim()) {
      Alert.alert('Champs requis', 'Remplissez tous les champs.'); return;
    }
    addCollaborator({ id: Math.random().toString(36).slice(2), firstName: firstName.trim(), lastName: lastName.trim(), role: role.trim(), teamId: teamId || undefined });
    onClose();
  };

  return (
    <SafeAreaView style={styles.formContainer} edges={['top']}>
      <Text style={styles.formTitle}>Nouveau collaborateur</Text>
      <TextInput style={styles.input} placeholder="Prénom" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Nom" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Rôle (ex: Développeur)" value={role} onChangeText={setRole} />
      <Text style={styles.inputLabel}>Équipe</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {teams.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.teamChip, teamId === t.id && { backgroundColor: t.colorHex }]}
            onPress={() => setTeamId(t.id)}
          >
            <Text style={[styles.teamChipText, teamId === t.id && { color: '#fff' }]}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.formActions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelText}>Annuler</Text></TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={submit}><Text style={styles.submitText}>Ajouter</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Add Schedule Form ─────────────────────────────────────────────────────────

function AddScheduleForm({ onClose }: { onClose: () => void }) {
  const { collaborators, addSchedule } = useAppStore();
  const [collabId, setCollabId] = useState(collaborators[0]?.id ?? '');
  const [notes, setNotes] = useState('');

  const submit = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0);
    addSchedule({ id: Math.random().toString(36).slice(2), collaboratorId: collabId, startTime: start.toISOString(), endTime: end.toISOString(), notes: notes.trim() || undefined });
    onClose();
  };

  return (
    <SafeAreaView style={styles.formContainer} edges={['top']}>
      <Text style={styles.formTitle}>Nouveau créneau</Text>
      <Text style={styles.inputLabel}>Collaborateur</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {collaborators.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.teamChip, collabId === c.id && styles.chipSelected]}
            onPress={() => setCollabId(c.id)}
          >
            <Text style={[styles.teamChipText, collabId === c.id && { color: '#fff' }]}>{c.firstName} {c.lastName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TextInput style={styles.input} placeholder="Notes (optionnel)" value={notes} onChangeText={setNotes} />
      <View style={styles.formActions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelText}>Annuler</Text></TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={submit}><Text style={styles.submitText}>Ajouter</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Settings Row ──────────────────────────────────────────────────────────────

function SettingsRow({ icon, label, onPress, last }: { icon: string; label: string; onPress: () => void; last?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.settingsRow, !last && styles.settingsRowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowChevron}>›</Text>
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.sectionContent, shadows.small]}>{children}</View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type ActiveForm = 'team' | 'collaborator' | 'schedule' | null;

export default function SettingsScreen() {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  if (activeForm === 'team') return <AddTeamForm onClose={() => setActiveForm(null)} />;
  if (activeForm === 'collaborator') return <AddCollaboratorForm onClose={() => setActiveForm(null)} />;
  if (activeForm === 'schedule') return <AddScheduleForm onClose={() => setActiveForm(null)} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <Section title="Gestion des données">
          <SettingsRow icon="👥" label="Ajouter une équipe" onPress={() => setActiveForm('team')} />
          <SettingsRow icon="👤" label="Ajouter un collaborateur" onPress={() => setActiveForm('collaborator')} />
          <SettingsRow icon="📅" label="Planifier un créneau" onPress={() => setActiveForm('schedule')} last />
        </Section>
        <Section title="Application">
          <View style={styles.infoRow}>
            <Text style={styles.rowIcon}>ℹ️</Text>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 34, fontWeight: '700', color: '#000' },
  list: { padding: 16, gap: 24, paddingBottom: 40 },

  section: {},
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, paddingHorizontal: 4 },
  sectionContent: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },

  settingsRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  settingsRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5EA' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowIcon: { fontSize: 20 },
  rowLabel: { flex: 1, fontSize: 16, color: '#000' },
  rowChevron: { fontSize: 22, color: '#C7C7CC', fontWeight: '300' },
  infoValue: { fontSize: 16, color: '#8E8E93' },

  // Forms
  formContainer: { flex: 1, backgroundColor: '#F2F2F7', padding: 20 },
  formTitle: { fontSize: 28, fontWeight: '700', color: '#000', marginBottom: 24 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    fontSize: 16, color: '#000', marginBottom: 12,
    ...shadows.small,
  },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
  colorRow: { flexDirection: 'row', gap: 12, marginBottom: 24, paddingLeft: 4 },
  colorDot: { width: 30, height: 30, borderRadius: 15 },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff', transform: [{ scale: 1.2 }] },
  teamChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E5E5EA', marginRight: 8 },
  chipSelected: { backgroundColor: '#007AFF' },
  teamChipText: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  formActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#E5E5EA', alignItems: 'center' },
  cancelText: { fontSize: 16, fontWeight: '600', color: '#8E8E93' },
  submitBtn: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#007AFF', alignItems: 'center' },
  submitText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
