import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type {
  AppData,
  Bookmark,
  Habit,
  Language,
  Moment,
  Note,
  Space,
  Task,
  Theme,
  VoiceNote,
} from '../types';
import { translate } from '../data/i18n';
import { createSeedState } from '../data/seed';
import { DATA_VERSION, STORAGE_KEY } from '../utils/constants';
import { addDays, formatTimeHM, nowISO, todayISO, uid } from '../utils/date';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed?.version || parsed.version !== DATA_VERSION) return createSeedState();
    if (!parsed.settings) return createSeedState();
    if (parsed.settings.language !== 'zh') {
      parsed.settings.language = 'en';
    }
    if (parsed.settings.theme !== 'dark') parsed.settings.theme = 'light';
    if (!parsed.selectedDate) parsed.selectedDate = todayISO();
    return parsed;
  } catch {
    return createSeedState();
  }
}

function persist(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = document.documentElement.lang || 'zh-CN';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#151515' : '#F7F5F2');
}

type ToastItem = { id: string; text: string };
type ConfirmState = {
  message: string;
  resolve: (ok: boolean) => void;
} | null;

interface AppContextValue {
  data: AppData;
  loading: boolean;
  t: (key: string, vars?: Record<string, string | number>) => string;
  lang: Language;
  theme: Theme;
  selectedDate: string;
  toast: (text: string) => void;
  toasts: ToastItem[];
  confirm: (message: string) => Promise<boolean>;
  confirmState: ConfirmState;
  answerConfirm: (ok: boolean) => void;
  createOpen: boolean;
  setCreateOpen: (open: boolean) => void;
  setDate: (date: string) => void;
  shiftDate: (days: number) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  resetData: () => void;
  addSpace: (space: Pick<Space, 'name' | 'nameEn' | 'color' | 'icon'>) => Space;
  updateSpace: (id: string, patch: Partial<Space>) => void;
  deleteSpace: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addBookmark: (bm: Omit<Bookmark, 'id' | 'createdAt'>) => Bookmark;
  updateBookmark: (id: string, patch: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  addMoment: (m: Omit<Moment, 'id' | 'createdAt'>) => Moment;
  updateMoment: (id: string, patch: Partial<Moment>) => void;
  deleteMoment: (id: string) => void;
  addVoice: (v: Omit<VoiceNote, 'id' | 'createdAt'>) => VoiceNote;
  checkIn: (habitId: string, extra?: { minutes?: number; photo?: string; note?: string }) => void;
  undoCheckIn: (habitId: string, date?: string) => void;
  isChecked: (habitId: string, date?: string) => boolean;
  streakFor: (habitId: string) => number;
  spaceById: (id: string) => Space | undefined;
  habitById: (id: string) => Habit | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    const initial = loadData();
    applyTheme(initial.settings.theme);
    document.documentElement.lang = initial.settings.language === 'zh' ? 'zh-CN' : 'en';
    return initial;
  });
  const [loading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const commit = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const toast = useCallback((text: string) => {
    const id = uid();
    setToasts((prev) => [...prev, { id, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
  }, []);

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ message, resolve });
    });
  }, []);

  const answerConfirm = useCallback((ok: boolean) => {
    setConfirmState((curr) => {
      curr?.resolve(ok);
      return null;
    });
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(data.settings.language, key, vars),
    [data.settings.language],
  );

  const value = useMemo<AppContextValue>(() => {
    const selectedDate = data.selectedDate;
    return {
      data,
      loading,
      t,
      lang: data.settings.language,
      theme: data.settings.theme,
      selectedDate,
      toast,
      toasts,
      confirm,
      confirmState,
      answerConfirm,
      createOpen,
      setCreateOpen,
      setDate: (date) => commit((p) => ({ ...p, selectedDate: date })),
      shiftDate: (days) => commit((p) => ({ ...p, selectedDate: addDays(p.selectedDate, days) })),
      setLanguage: (language) => {
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
        commit((p) => ({ ...p, settings: { ...p.settings, language } }));
      },
      setTheme: (theme) => {
        applyTheme(theme);
        commit((p) => ({ ...p, settings: { ...p.settings, theme } }));
      },
      resetData: () => {
        const next = createSeedState();
        applyTheme(next.settings.theme);
        persist(next);
        setData(next);
      },
      addSpace: (space) => {
        const item: Space = {
          ...space,
          id: uid(),
          createdAt: nowISO(),
          updatedAt: nowISO(),
        };
        commit((p) => ({ ...p, spaces: [item, ...p.spaces] }));
        return item;
      },
      updateSpace: (id, patch) =>
        commit((p) => ({
          ...p,
          spaces: p.spaces.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: nowISO() } : s)),
        })),
      deleteSpace: (id) => commit((p) => ({ ...p, spaces: p.spaces.filter((s) => s.id !== id) })),
      addNote: (note) => {
        const item: Note = { ...note, id: uid(), createdAt: nowISO(), updatedAt: nowISO() };
        commit((p) => ({
          ...p,
          notes: [item, ...p.notes],
          spaces: p.spaces.map((s) => (s.id === note.spaceId ? { ...s, updatedAt: nowISO() } : s)),
        }));
        return item;
      },
      updateNote: (id, patch) =>
        commit((p) => ({
          ...p,
          notes: p.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: nowISO() } : n)),
        })),
      deleteNote: (id) => commit((p) => ({ ...p, notes: p.notes.filter((n) => n.id !== id) })),
      addTask: (task) => {
        const item: Task = { ...task, id: uid() };
        commit((p) => ({ ...p, tasks: [item, ...p.tasks] }));
        return item;
      },
      updateTask: (id, patch) =>
        commit((p) => ({
          ...p,
          tasks: p.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)),
        })),
      toggleTask: (id) =>
        commit((p) => ({
          ...p,
          tasks: p.tasks.map((task) => {
            if (task.id !== id) return task;
            const completed = !task.completed;
            return {
              ...task,
              completed,
              completedAt: completed ? `${p.selectedDate}T${formatTimeHM()}:00` : undefined,
            };
          }),
        })),
      deleteTask: (id) => commit((p) => ({ ...p, tasks: p.tasks.filter((task) => task.id !== id) })),
      addBookmark: (bm) => {
        const item: Bookmark = { ...bm, id: uid(), createdAt: nowISO() };
        commit((p) => ({ ...p, bookmarks: [item, ...p.bookmarks] }));
        return item;
      },
      updateBookmark: (id, patch) =>
        commit((p) => ({
          ...p,
          bookmarks: p.bookmarks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      deleteBookmark: (id) =>
        commit((p) => ({ ...p, bookmarks: p.bookmarks.filter((b) => b.id !== id) })),
      addMoment: (m) => {
        const item: Moment = { ...m, id: uid(), createdAt: nowISO() };
        commit((p) => ({ ...p, moments: [item, ...p.moments] }));
        return item;
      },
      updateMoment: (id, patch) =>
        commit((p) => ({
          ...p,
          moments: p.moments.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      deleteMoment: (id) => commit((p) => ({ ...p, moments: p.moments.filter((m) => m.id !== id) })),
      addVoice: (v) => {
        const item: VoiceNote = { ...v, id: uid(), createdAt: nowISO() };
        commit((p) => ({ ...p, voiceNotes: [item, ...p.voiceNotes] }));
        return item;
      },
      checkIn: (habitId, extra) =>
        commit((p) => {
          const date = p.selectedDate;
          if (p.checkIns.some((c) => c.habitId === habitId && c.date === date)) return p;
          return {
            ...p,
            checkIns: [
              {
                id: uid(),
                habitId,
                date,
                minutes: extra?.minutes,
                photo: extra?.photo,
                note: extra?.note,
                createdAt: nowISO(),
              },
              ...p.checkIns,
            ],
          };
        }),
      undoCheckIn: (habitId, date) =>
        commit((p) => {
          const d = date ?? p.selectedDate;
          return {
            ...p,
            checkIns: p.checkIns.filter((c) => !(c.habitId === habitId && c.date === d)),
          };
        }),
      isChecked: (habitId, date) => {
        const d = date ?? selectedDate;
        return data.checkIns.some((c) => c.habitId === habitId && c.date === d);
      },
      streakFor: (habitId) => {
        let streak = 0;
        let cursor = selectedDate;
        while (data.checkIns.some((c) => c.habitId === habitId && c.date === cursor)) {
          streak += 1;
          cursor = addDays(cursor, -1);
        }
        return streak;
      },
      spaceById: (id) => data.spaces.find((s) => s.id === id),
      habitById: (id) => data.habits.find((h) => h.id === id),
    };
  }, [
    answerConfirm,
    commit,
    confirm,
    confirmState,
    createOpen,
    data,
    loading,
    t,
    toast,
    toasts,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
