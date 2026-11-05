import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Drawer from '../../components/Drawer';
import TaskRow from '../../components/TaskRow';
import TaskSheet from '../../components/TaskSheet';
import { Chip, Empty, Fab, Icon, Menu, MenuItem } from '../../components/UI';
import { useTheme } from '../../lib/colors';
import { Task, today, useData } from '../../lib/data';

const SORTS = ['created', 'pri', 'date'] as const;
const SORT_L = { created: 'Buat Tugas', pri: 'Prioritas', date: 'Tanggal' };

export default function Tugas() {
  const c = useTheme();
  const r = useRouter();
  const { cat: catParam } = useLocalSearchParams<{ cat?: string }>();
  const { tasks, cats, settings, setSettings, toggleTask, removeTasks } = useData();
  const [cat, setCat] = useState('all');
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState<{ open: boolean; task?: Task }>({ open: false });
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => { if (catParam) setCat(catParam); }, [catParam]);

  const list = useMemo(() => tasks
    .filter((t) => cat === 'all' || t.cat === cat)
    .sort((a, b) => Number(a.done) - Number(b.done) ||
      (settings.sort === 'pri' ? a.pri - b.pri : settings.sort === 'date' ? a.date.localeCompare(b.date) : a.created - b.created)),
    [tasks, cat, settings.sort]);

  const review = () => {
    setMenu(false);
    const t = tasks.filter((x) => x.date === today());
    const d = t.filter((x) => x.done).length;
    Alert.alert('Tinjauan Hari Ini', t.length ? `${d} dari ${t.length} tugas hari ini selesai.\n${t.length - d} tugas lagi, semangat!` : 'Belum ada tugas untuk hari ini.');
  };
  const stopSelect = () => { setSelecting(false); setPicked([]); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}>
        {selecting
          ? <><Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>{picked.length} dipilih</Text>
              <Pressable onPress={stopSelect}><Text style={{ color: c.primary, fontSize: 16 }}>Batal</Text></Pressable></>
          : <><Pressable onPress={() => setDrawer(true)} hitSlop={10}><Icon n="menu" size={28} /></Pressable>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <Pressable onPress={() => r.push('/search')} hitSlop={10}><Icon n="search" size={26} /></Pressable>
                <Pressable onPress={() => setMenu(true)} hitSlop={10}><Icon n="ellipsis-horizontal" size={26} /></Pressable>
              </View></>}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }} style={{ flex: 1 }}>
          <Chip label="Semua" on={cat === 'all'} onPress={() => setCat('all')} />
          {cats.map((x) => <Chip key={x.id} label={x.name} on={cat === x.id} color={x.color} onPress={() => setCat(x.id)} />)}
        </ScrollView>
        <Pressable onPress={() => r.push('/kategori')} style={{ paddingHorizontal: 14 }}><Icon n="apps-outline" size={26} color={c.muted} /></Pressable>
      </View>

      <FlatList data={list} keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TaskRow task={item} selecting={selecting} picked={picked.includes(item.id)}
            onPick={() => setPicked((p) => (p.includes(item.id) ? p.filter((x) => x !== item.id) : [...p, item.id]))}
            onPress={() => setSheet({ open: true, task: item })} />)}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={<Empty text="Mulai hari ini, buat tugas Anda dan jalani kehidupan yang terorganisir!" onPress={() => setSheet({ open: true })} />} />

      {selecting
        ? <View style={{ flexDirection: 'row', gap: 12, padding: 16, backgroundColor: c.card }}>
            <Pressable style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: c.primary, alignItems: 'center' }}
              onPress={() => { picked.forEach((id) => { const t = tasks.find((x) => x.id === id); if (t && !t.done) toggleTask(id); }); stopSelect(); }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Selesaikan</Text></Pressable>
            <Pressable style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#E5484D', alignItems: 'center' }}
              onPress={() => { removeTasks(picked); stopSelect(); }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Hapus</Text></Pressable>
          </View>
        : <Fab onPress={() => setSheet({ open: true })} />}

      <TaskSheet visible={sheet.open} task={sheet.task} defaultCat={cat === 'all' ? null : cat} onClose={() => setSheet({ open: false })} />
      <Drawer visible={drawer} onClose={() => setDrawer(false)} />
      <Menu visible={menu} onClose={() => setMenu(false)} top={100}>
        <MenuItem icon="checkmark-done" label="Pilih tugas" onPress={() => { setMenu(false); setSelecting(true); }} />
        <MenuItem icon="reader-outline" label="Tinjauan Hari Ini" onPress={review} />
        <MenuItem icon="git-branch-outline" label="Tampilkan subtugas"
          right={<Switch value={settings.showSub} onValueChange={(v) => setSettings({ showSub: v })} />} />
        <MenuItem icon="funnel-outline" label={`Urutkan: ${SORT_L[settings.sort]}`}
          onPress={() => setSettings({ sort: SORTS[(SORTS.indexOf(settings.sort) + 1) % 3] })} />
      </Menu>
    </SafeAreaView>
  );
}
