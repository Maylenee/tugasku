import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Empty, Fab, Header, Icon } from '../components/UI';
import { useTheme } from '../lib/colors';
import { Habit, addDays, parse, today, useData } from '../lib/data';

const streak = (h: Habit) => {
  let n = 0, d = h.days.includes(today()) ? today() : addDays(today(), -1);
  while (h.days.includes(d)) { n++; d = addDays(d, -1); }
  return n;
};
const L = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

export default function Kebiasaan() {
  const c = useTheme();
  const { habits, addHabit, toggleHabit, removeHabit } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const week = Array.from({ length: 7 }, (_, i) => addDays(today(), i - 6));
  const save = () => { if (name.trim()) addHabit(name.trim()); setName(''); setOpen(false); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <Header title="Kebiasaan" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {habits.length === 0 && <Empty icon="flag" text={'Anda belum menambahkan kebiasaan apa pun. Ketuk "+" untuk menambahkan.'} />}
        {habits.map((h) => (
          <Pressable key={h.id} onLongPress={() => Alert.alert('Hapus kebiasaan?', h.name, [{ text: 'Batal' }, { text: 'Hapus', style: 'destructive', onPress: () => removeHabit(h.id) }])}
            style={{ backgroundColor: c.card, borderRadius: 16, padding: 16, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>{h.name}</Text>
                <Text style={{ color: c.muted, marginTop: 2 }}>🔥 {streak(h)} hari berturut-turut</Text>
              </View>
              <Pressable onPress={() => toggleHabit(h.id, today())} hitSlop={8}>
                <Icon n={h.days.includes(today()) ? 'checkmark-circle' : 'ellipse-outline'} size={34} color={h.days.includes(today()) ? c.primary : c.muted} />
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
              {week.map((d) => (
                <Pressable key={d} onPress={() => toggleHabit(h.id, d)} style={{ alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 11, color: c.muted }}>{L[parse(d).getDay()]}</Text>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: h.days.includes(d) ? c.primary : c.chip }} />
                </Pressable>))}
            </View>
          </Pressable>))}
      </ScrollView>
      <Fab onPress={() => setOpen(true)} />
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={{ backgroundColor: c.bg, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TextInput autoFocus value={name} onChangeText={setName} onSubmitEditing={save} placeholder="Contoh: Minum 8 gelas air" placeholderTextColor={c.muted} style={{ flex: 1, fontSize: 18, color: c.text, paddingVertical: 12 }} />
            <Pressable onPress={save} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}><Icon n="checkmark" size={28} color="#fff" /></Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
