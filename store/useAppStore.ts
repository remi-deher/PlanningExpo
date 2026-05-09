import { create } from 'zustand';

// MARK: - Interfaces
export interface Team {
  id: string;
  name: string;
  colorHex: string;
  icon: string;
}

export interface Collaborator {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  teamId?: string;
  avatarUrl?: string;
}

export interface Schedule {
  id: string;
  collaboratorId: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  teamId?: string;
  content: string;
  timestamp: string; // ISO String
}

interface AppState {
  teams: Team[];
  collaborators: Collaborator[];
  schedules: Schedule[];
  messages: Message[];
}

interface AppActions {
  addTeam: (team: Team) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  addSchedule: (schedule: Schedule) => void;
  addMessage: (message: Message) => void;
}

type AppStore = AppState & AppActions;

// MARK: - Mock Data
const mockTeams: Team[] = [
  { id: 't1', name: 'Équipe Matin', colorHex: '#3B82F6', icon: 'sunrise' },
  { id: 't2', name: 'Équipe Soir', colorHex: '#8B5CF6', icon: 'moon' },
];

const mockCollaborators: Collaborator[] = [
  { id: 'c1', firstName: 'Jean', lastName: 'Dupont', role: 'Manager', teamId: 't1' },
  { id: 'c2', firstName: 'Marie', lastName: 'Curie', role: 'Développeur', teamId: 't2' },
  { id: 'c3', firstName: 'Pierre', lastName: 'Gaspard', role: 'Designer', teamId: 't1' },
];

const now = new Date();
const mockSchedules: Schedule[] = [
  { 
    id: 's1', 
    collaboratorId: 'c1', 
    startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0).toISOString(),
    endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0).toISOString(),
    notes: 'Shift standard'
  },
  { 
    id: 's2', 
    collaboratorId: 'c2', 
    startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0).toISOString(),
    endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0).toISOString(),
    notes: 'Shift soir'
  },
];

const mockMessages: Message[] = [
  { id: 'm1', senderId: 'c1', teamId: 't1', content: 'Bonjour à l\'équipe Matin !', timestamp: new Date(now.getTime() - 3600000).toISOString() },
  { id: 'm2', senderId: 'c2', receiverId: 'c1', content: 'Salut Jean, j\'ai fini ma tâche.', timestamp: new Date(now.getTime() - 1800000).toISOString() },
];

// MARK: - Store Creation
export const useAppStore = create<AppStore>((set) => ({
  teams: mockTeams,
  collaborators: mockCollaborators,
  schedules: mockSchedules,
  messages: mockMessages,

  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  addCollaborator: (collaborator) => set((state) => ({ collaborators: [...state.collaborators, collaborator] })),
  addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));
