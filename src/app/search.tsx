import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskRow from '../components/TaskRow';
import TaskSheet from '../components/TaskSheet';
import { Icon } from '../components/UI';
import { useTheme } from '../lib/colors';
import { Task, useData } from '../lib/data';

export default function Search() {
  const c = useTheme();
  const r = useRouter();
  const { tasks } = useData();
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<Task | undefined>();
  const k = q.trim().toLowerCase();
  const res = k ? tasks.filter((t) => t.title.toLowerCase().includes(k) || t.sub.some((u) => u.t.toLowerCase().includes(k))) : [];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.chip, borderRadius: 12, paddingHorizontal: 12 }}>
          <Icon n="search" size={20} color={c.muted} />
          <TextInput autoFocus value={q} onChangeText={setQ} placeholder="Masukkan kata kunci" placeholderTextColor={c.muted} style={{ flex: 1, paddingVertical: 12, color: c.text, fontSize: 16 }} />
        </View>
        <Pressable onPress={() => r.back()}><Text style={{ color: c.primary, fontSize: 16 }}>Batalkan</Text></Pressable>
      </View>
      <FlatList data={res} keyExtractor={(t) => t.id} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <TaskRow task={item} onPress={() => setEdit(item)} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: c.muted, marginTop: 40 }}>
          {k ? 'Tidak ada tugas yang cocok.' : 'Tugas dan subtugas yang cocok akan ditampilkan di sini.'}</Text>} />
      <TaskSheet visible={!!edit} task={edit} onClose={() => setEdit(undefined)} />
    </SafeAreaView>
  );
}
