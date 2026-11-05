import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskRow from '../../components/TaskRow';
import TaskSheet from '../../components/TaskSheet';
import { Fab, Icon, Menu, MenuItem } from '../../components/UI';
import { useTheme } from '../../lib/colors';
import { Task, addDays, parse, today, useData } from '../../lib/data';

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const VIEWS = [['list', 'Tampilan Daftar', 'reorder-three-outline'], ['month', 'Tampilan Bulan', 'grid-outline'], ['3day', 'Tampilan 3 Hari', 'albums-outline']] as const;

export default function Kalender() {
  const c = useTheme();
  const { tasks, cats, settings, setSettings } = useData();
  const [cur, setCur] = useState(() => parse(today()));
  const [sel, setSel] = useState(today());
  const [filter, setFilter] = useState('all');
  const [menu, setMenu] = useState<'' | 'filter' | 'view' | 'more'>('');
  const [sheet, setSheet] = useState<{ open: boolean; task?: Task }>({ open: false });

  const ws = settings.weekStart, view = settings.calView;
  const ft = tasks.filter((t) => filter === 'all' || t.cat === filter);
  const y = cur.getFullYear(), m = cur.getMonth();
  const lead = (new Date(y, m, 1).getDay() - ws + 7) % 7;
  const total = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const dow = [...DAYS.slice(ws), ...DAYS.slice(0, ws)];
  const pad = (n: number) => String(n).padStart(2, '0');
  const move = (n: number) => {
    if (view === '3day') { const d = addDays(sel, 3 * n); setSel(d); setCur(parse(d)); }
    else setCur(new Date(y, m + n, 1));
  };
  const goToday = () => { setSel(today()); setCur(parse(today())); setMenu(''); };
  const dayTasks = ft.filter((t) => t.date === sel);
  const open = (task?: Task) => setSheet({ open: true, task });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Pressable onPress={() => move(-1)} hitSlop={10}><Icon n="chevron-back" /></Pressable>
          <Text style={{ fontSize: 20, fontWeight: '700', color: c.text }}>{MONTHS[m]} {y}</Text>
          <Pressable onPress={() => move(1)} hitSlop={10}><Icon n="chevron-forward" /></Pressable>
        </View>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Pressable onPress={() => setMenu('filter')}><Icon n={filter === 'all' ? 'funnel-outline' : 'funnel'} size={24} color={filter === 'all' ? c.text : c.primary} /></Pressable>
          <Pressable onPress={() => setMenu('view')}><Icon n="albums-outline" size={24} /></Pressable>
          <Pressable onPress={() => setMenu('more')}><Icon n="ellipsis-horizontal" size={24} /></Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {view !== '3day' ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 }}>
            {dow.map((d) => <Text key={d} style={{ width: '14.28%', textAlign: 'center', color: c.muted, fontWeight: '600', marginBottom: 6 }}>{d}</Text>)}
            {cells.map((d, i) => {
              if (!d) return <View key={i} style={{ width: '14.28%' }} />;
              const ds = `${y}-${pad(m + 1)}-${pad(d)}`;
              const on = ds === sel, dt = ft.filter((t) => t.date === ds);
              return (
                <Pressable key={i} onPress={() => setSel(ds)} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 4, minHeight: view === 'month' ? 74 : 54 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: on ? c.primary : 'transparent', borderWidth: !on && ds === today() ? 1.5 : 0, borderColor: c.primary }}>
                    <Text style={{ fontSize: 16, color: on ? '#fff' : c.text }}>{d}</Text>
                  </View>
                  {view === 'month'
                    ? dt.slice(0, 2).map((t) => <Text key={t.id} numberOfLines={1} style={{ fontSize: 9, color: c.text, backgroundColor: c.chip, borderRadius: 3, paddingHorizontal: 2, marginTop: 2, width: '92%' }}>{t.title}</Text>)
                    : <View style={{ width: 5, height: 5, borderRadius: 3, marginTop: 3, backgroundColor: dt.some((t) => !t.done) ? '#F59E0B' : 'transparent' }} />}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 12 }}>
            {[0, 1, 2].map((i) => {
              const d = addDays(sel, i);
              return (
                <View key={d} style={{ flex: 1, backgroundColor: c.card, borderRadius: 14, padding: 10, minHeight: 240 }}>
                  <Text style={{ fontWeight: '700', color: d === today() ? c.primary : c.text, marginBottom: 8 }}>{d.slice(8)}/{d.slice(5, 7)}</Text>
                  {ft.filter((t) => t.date === d).map((t) => (
                    <Pressable key={t.id} onPress={() => open(t)}>
                      <Text style={{ fontSize: 13, color: t.done ? c.muted : c.text, textDecorationLine: t.done ? 'line-through' : 'none', marginBottom: 6 }}>• {t.title}</Text>
                    </Pressable>))}
                </View>
              );
            })}
          </View>
        )}

        {view !== '3day' && (
          <View style={{ padding: 16 }}>
            {dayTasks.length
              ? dayTasks.map((t) => <TaskRow key={t.id} task={t} onPress={() => open(t)} />)
              : <Text style={{ textAlign: 'center', color: c.muted, marginTop: 24, lineHeight: 22 }}>
                  Klik + untuk membuat tugas baru.{'\n'}Rencanakan hari Anda dengan jelas dalam tampilan kalender!</Text>}
          </View>
        )}
      </ScrollView>

      <Fab onPress={() => open()} />
      <TaskSheet visible={sheet.open} task={sheet.task} defaultDate={sel} onClose={() => setSheet({ open: false })} />

      <Menu visible={menu === 'filter'} onClose={() => setMenu('')} top={110} right={80}>
        <MenuItem label="Semua tugas" color={filter === 'all' ? c.primary : undefined} onPress={() => { setFilter('all'); setMenu(''); }} />
        {cats.map((x) => <MenuItem key={x.id} label={x.name} color={filter === x.id ? c.primary : undefined} onPress={() => { setFilter(x.id); setMenu(''); }} />)}
      </Menu>
      <Menu visible={menu === 'view'} onClose={() => setMenu('')} top={110} right={50}>
        {VIEWS.map(([k, l, ico]) => <MenuItem key={k} icon={ico} label={l} color={view === k ? c.primary : undefined} onPress={() => { setSettings({ calView: k }); setMenu(''); }} />)}
      </Menu>
      <Menu visible={menu === 'more'} onClose={() => setMenu('')} top={110}>
        <MenuItem icon="today-outline" label="Ke hari ini" onPress={goToday} />
        <MenuItem icon="calendar-outline" label={`Minggu mulai: ${ws === 0 ? 'Minggu' : 'Senin'}`} onPress={() => { setSettings({ weekStart: ws === 0 ? 1 : 0 }); setMenu(''); }} />
      </Menu>
    </SafeAreaView>
  );
}
