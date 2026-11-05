import { useMemo } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { useData } from './data';

export const PRI = { 1: '#E5484D', 2: '#F59E0B', 3: '#3B82F6' } as const;
export const PRI_LABEL = { 1: 'Penting', 2: 'Sedang', 3: 'Santai' } as const;
export const ACCENTS = ['#0A8DFF', '#14213D', '#E5484D', '#F5B33F', '#F25C95', '#14A38B', '#FF7A1A', '#8B5CF6'];

const light = { bg: '#F0F4F9', card: '#FFFFFF', text: '#14213D', muted: '#8A94A6', line: '#E3E8EF', chip: '#DCE6F2' };
const dark = { bg: '#0F1419', card: '#1A2128', text: '#E8EDF2', muted: '#8793A0', line: '#27313A', chip: '#26323D' };

export function useTheme() {
  const { settings } = useData();
  const sys = useColorScheme();
  const isDark = settings.darkAuto && sys === 'dark';
  return useMemo(() => ({ ...(isDark ? dark : light), dark: isDark, primary: settings.accent }), [isDark, settings.accent]);
}
export type Colors = ReturnType<typeof useTheme>;

export function useThemed(f: (c: Colors) => Record<string, any>) {
  const c = useTheme();
  const s = useMemo(() => StyleSheet.create(f(c)), [c]) as Record<string, any>;
  return { c, s };
}
