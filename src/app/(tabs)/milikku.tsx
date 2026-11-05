import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Share, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/UI';
import { useTheme } from '../../lib/colors';
import { addDays, today, useData } from '../../lib/data';

export default function Milikku() {
  const c = useTheme();
  const r = useRouter();
  const { tasks, cats } = useData();
  const { width } = useWindowDimensions();
  const done = tasks.filter((t) => t.done);

  const byDate: Record<string, { all: number; done: number }> = {};
  tasks.forEach((t) => { const e = (byDate[t.date] ??= { all: 0, done: 0 }); e.all++; if (t.done) e.done++; });
  const perfect = Object.entries(byDate).filter(([d, e]) => d <= today() && e.all > 0 && e.all === e.done).length;

  const doneOn: Record<string, number> = {};
  done.forEach((t) => { if (t.doneAt) doneOn[t.doneAt] = (doneOn[t.doneAt] ?? 0) + 1; });
  const WEEKS = 16;
  const t0 = new Date(); const dayIdx = t0.getDay();
  const endOfWeek = addDays(today(), 6 - dayIdx);
  const cell = Math.floor((width - 32 - 36 - 28) / WEEKS) - 3;
  const shade = (n: number) => (n === 0 ? c.chip : n === 1 ? c.primary + '66' : n === 2 ? c.primary + 'AA' : c.primary);

  const Stat = ({ n, l }: { n: number; l: string }) => (
    <View style={{ flex: 1, backgroundColor: c.card, borderRadius: 16, padding: 18, alignItems: 'center' }}>
      <Text style={{ fontSize: 30, fontWeight: '700', color: c.text }}>{n}</Text>
      <Text style={{ color: c.muted, marginTop: 4 }}>{l}</Text>
    </View>
  );
  const card = { backgroundColor: c.card, borderRadius: 16, padding: 18, marginTop: 12 } as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: c.text }}>Milikku</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Pressable onPress={() => Share.share({ message: `Saya sudah menyelesaikan ${done.length} tugas dan punya ${perfect} Hari Sempurna di Tugasku!` })}><Icon n="share-outline" /></Pressable>
            <Pressable onPress={() => r.push('/pengaturan')}><Icon n="settings-outline" /></Pressable>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}><Stat n={done.length} l="Tugas Selesai" /><Stat n={perfect} l="Hari Sempurna" /></View>

        <View style={card}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: c.text, marginBottom: 12 }}>Peta Panas</Text>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {Array.from({ length: WEEKS }, (_, w) => (
              <View key={w} style={{ gap: 3 }}>
                {Array.from({ length: 7 }, (_, d) => {
                  const ds = addDays(endOfWeek, -((WEEKS - 1 - w) * 7 + (6 - d)));
                  return <View key={d} style={{ width: cell, height: cell, borderRadius: 4, backgroundColor: ds > today() ? 'transparent' : shade(doneOn[ds] ?? 0) }} />;
                })}
              </View>
            ))}
          </View>
          {!done.length && <Text style={{ color: c.muted, marginTop: 10 }}>Belum ada data tugas selesai.</Text>}
        </View>

        <View style={card}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Tugas Selesai per Kategori</Text>
          {[...cats, { id: 'none', name: 'Tanpa kategori', color: c.muted }].map((x) => {
            const all = tasks.filter((t) => (x.id === 'none' ? t.cat === null : t.cat === x.id));
            const d = all.filter((t) => t.done).length;
            return (
              <View key={x.id} style={{ marginTop: 14 }}>
                <Text style={{ color: c.text, marginBottom: 6 }}>{x.name} · {d}/{all.length}</Text>
                <View style={{ height: 8, backgroundColor: c.line, borderRadius: 99, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${all.length ? (d / all.length) * 100 : 0}%`, backgroundColor: x.color }} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
