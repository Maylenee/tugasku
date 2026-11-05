import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Icon } from '../components/UI';
import { useTheme } from '../lib/colors';
import { useData } from '../lib/data';

export default function Kategori() {
  const c = useTheme();
  const { cats, tasks, addCat, removeCat } = useData();
  const [name, setName] = useState('');
  const add = () => { if (name.trim()) addCat(name.trim()); setName(''); };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <Header title="Kelola Kategori" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {cats.map((x) => (
            <View key={x.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: c.card, borderRadius: 14, padding: 14, marginBottom: 8 }}>
              <Icon n={x.icon} size={24} color={x.color} />
              <Text style={{ flex: 1, fontSize: 17, color: c.text }}>{x.name}</Text>
              <Text style={{ color: c.muted }}>{tasks.filter((t) => t.cat === x.id && !t.done).length}</Text>
              <Pressable hitSlop={8} onPress={() => Alert.alert('Hapus kategori?', `Tugas di "${x.name}" akan menjadi tanpa kategori.`, [{ text: 'Batal' }, { text: 'Hapus', style: 'destructive', onPress: () => removeCat(x.id) }])}>
                <Icon n="trash-outline" size={20} color={c.muted} />
              </Pressable>
            </View>))}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.card, borderRadius: 14, padding: 6, paddingLeft: 14, marginTop: 8 }}>
            <Icon n="add-circle-outline" size={24} color={c.muted} />
            <TextInput value={name} onChangeText={setName} onSubmitEditing={add} placeholder="Buat baru" placeholderTextColor={c.muted} style={{ flex: 1, fontSize: 17, color: c.text, paddingVertical: 10 }} />
            <Pressable onPress={add} style={{ padding: 10 }}><Text style={{ color: c.primary, fontWeight: '600' }}>Tambah</Text></Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
