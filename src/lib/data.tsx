import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Sub = { id: string; t: string; d: boolean };
export type Repeat = 'none' | 'daily' | 'weekly';
export type Task = {
  id: string; title: string; cat: string | null; pri: 1 | 2 | 3; date: string;
  done: boolean; doneAt?: string; star: boolean; sub: Sub[]; repeat: Repeat; created: number;
};
export type Habit = { id: string; name: string; days: string[] };
export type Cat = { id: string; name: string; icon: string; color: string };
export type Settings = {
  accent: string; darkAuto: boolean; showSub: boolean; weekStart: 0 | 1;
  calView: 'list' | 'month' | '3day'; sort: 'created' | 'pri' | 'date'; focusMin: number;
};
type State = { tasks: Task[]; habits: Habit[]; cats: Cat[]; settings: Settings };
export type NewTask = Partial<Omit<Task, 'id' | 'created' | 'done'>> & { title: string };

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const today = () => fmt(new Date());
export const addDays = (s: string, n: number) => { const d = parse(s); d.setDate(d.getDate() + n); return fmt(d); };
export const dateLabel = (s: string) => {
  const t = today();
  if (s === t) return 'Hari ini';
  if (s === addDays(t, 1)) return 'Besok';
  if (s === addDays(t, -1)) return 'Kemarin';
  return `${s.slice(8)}/${s.slice(5, 7)}`;
};

const DEF: State = {
  tasks: [], habits: [],
  cats: [
    { id: 'kerja', name: 'Kerja', icon: 'briefcase-outline', color: '#4A9BE8' },
    { id: 'pribadi', name: 'Pribadi', icon: 'cafe-outline', color: '#4CB87A' },
    { id: 'wishlist', name: 'Wishlist', icon: 'heart-outline', color: '#9B6BE0' },
    { id: 'ultah', name: 'Hari ulang tahun', icon: 'gift-outline', color: '#E5604D' },
  ],
  settings: { accent: '#0A8DFF', darkAuto: false, showSub: true, weekStart: 0, calView: 'list', sort: 'created', focusMin: 25 },
};

type Ctx = State & {
  ready: boolean;
  addTask: (t: NewTask) => void; updateTask: (id: string, p: Partial<Task>) => void;
  toggleTask: (id: string) => void; removeTasks: (ids: string[]) => void;
  addHabit: (n: string) => void; toggleHabit: (id: string, d: string) => void; removeHabit: (id: string) => void;
  addCat: (n: string) => void; removeCat: (id: string) => void; setSettings: (p: Partial<Settings>) => void;
};
const DataCtx = createContext<Ctx>(null as unknown as Ctx);
export const useData = () => useContext(DataCtx);
const KEY = 'tugasku:v2';
const PALETTE = ['#4A9BE8', '#4CB87A', '#9B6BE0', '#E5604D', '#F5B33F', '#14A38B'];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [st, setSt] = useState<State>(DEF);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) { const p = JSON.parse(raw); setSt({ ...DEF, ...p, settings: { ...DEF.settings, ...p.settings } }); }
    }).catch(() => {}).finally(() => setReady(true));
  }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(KEY, JSON.stringify(st)).catch(() => {}); }, [st, ready]);

  const v: Ctx = {
    ...st,
    ready,
    addTask: (t) => setSt((s) => ({ ...s, tasks: [...s.tasks, {
      cat: null, pri: 2, date: today(), star: false, sub: [], repeat: 'none', ...t,
      id: uid(), done: false, created: Date.now() }] })),
    updateTask: (id, p) => setSt((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...p } : t)) })),
    toggleTask: (id) => setSt((s) => {
      const t = s.tasks.find((x) => x.id === id);
      if (!t) return s;
      const done = !t.done;
      let tasks = s.tasks.map((x) => (x.id === id ? { ...x, done, doneAt: done ? today() : undefined } : x));
      if (done && t.repeat !== 'none') {
        tasks = [...tasks, { ...t, id: uid(), done: false, doneAt: undefined, created: Date.now(),
          date: addDays(t.date, t.repeat === 'daily' ? 1 : 7), sub: t.sub.map((u) => ({ ...u, d: false })) }];
      }
      return { ...s, tasks };
    }),
    removeTasks: (ids) => setSt((s) => ({ ...s, tasks: s.tasks.filter((t) => !ids.includes(t.id)) })),
    addHabit: (name) => setSt((s) => ({ ...s, habits: [...s.habits, { id: uid(), name, days: [] }] })),
    toggleHabit: (id, d) => setSt((s) => ({ ...s, habits: s.habits.map((h) => h.id !== id ? h :
      { ...h, days: h.days.includes(d) ? h.days.filter((x) => x !== d) : [...h.days, d] }) })),
    removeHabit: (id) => setSt((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) })),
    addCat: (name) => setSt((s) => ({ ...s, cats: [...s.cats, { id: uid(), name, icon: 'pricetag-outline', color: PALETTE[s.cats.length % PALETTE.length] }] })),
    removeCat: (id) => setSt((s) => ({ ...s, cats: s.cats.filter((c) => c.id !== id),
      tasks: s.tasks.map((t) => (t.cat === id ? { ...t, cat: null } : t)) })),
    setSettings: (p) => setSt((s) => ({ ...s, settings: { ...s.settings, ...p } })),
  };
  return <DataCtx.Provider value={v}>{children}</DataCtx.Provider>;
}
