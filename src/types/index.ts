export type Language = 'zh' | 'en';
export type Theme = 'light' | 'dark';
export type SpaceColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow';
export type TaskPriority = 'normal' | 'important';
export type HabitKind = 'fitness' | 'study' | 'morning' | 'custom';
export type MomentKind = 'note' | 'checkin' | 'photo' | 'voice';

export interface User {
  id: string;
  name: string;
  greetingName: string;
}

export interface Space {
  id: string;
  name: string;
  nameEn: string;
  color: SpaceColor;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  spaceId: string;
  title: string;
  body: string;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
  cover?: string;
  checklist: ChecklistItem[];
}

export interface Task {
  id: string;
  title: string;
  date: string;
  dueTime?: string;
  spaceId?: string;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string;
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  nameEn: string;
  kind: HabitKind;
  icon: string;
  targetLabel: string;
  targetLabelEn: string;
  targetMinutes?: number;
  goalTime?: string;
}

export interface CheckIn {
  id: string;
  habitId: string;
  date: string;
  minutes?: number;
  photo?: string;
  note?: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  url: string;
  domain: string;
  title: string;
  description: string;
  category: 'design' | 'dev' | 'inspire' | 'other';
  tags: string[];
  createdAt: string;
  date: string;
}

export interface Moment {
  id: string;
  date: string;
  time: string;
  title: string;
  text: string;
  image?: string;
  kind: MomentKind;
  tint: 'blue' | 'purple' | 'green' | 'orange' | 'yellow';
  createdAt: string;
}

export interface VoiceNote {
  id: string;
  title: string;
  transcript: string;
  durationSec: number;
  date: string;
  createdAt: string;
}

export interface Settings {
  language: Language;
  theme: Theme;
}

export interface AppData {
  version: number;
  user: User;
  settings: Settings;
  selectedDate: string;
  spaces: Space[];
  notes: Note[];
  tasks: Task[];
  habits: Habit[];
  checkIns: CheckIn[];
  bookmarks: Bookmark[];
  moments: Moment[];
  voiceNotes: VoiceNote[];
}
