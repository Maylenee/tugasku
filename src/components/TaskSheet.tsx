import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { PRI, PRI_LABEL, useTheme } from '../lib/colors';
import { Repeat, Sub, Task, addDays, dateLabel, today, uid, useData } from '../lib/data';
import { Chip, Icon } from './UI';

const REP: Repeat[] = ['none', 'daily', 'weekly'];
const REP_L = { none: 'Tidak berulang', daily: 'Setiap hari', weekly: 'Setiap minggu' };

export default function TaskSheet({ visible, onClose, task, defaultDate, defaultCat }:
  { visible: boolean; onClose: () => void; task?: Task; defaultDate?: string; defaultCat?: string | null }) {
  const c = useTheme();
  const { addTask, updateTask, removeTasks, cats } = useData();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [cat, setCat] = useState<string | null>(null);
  const [pri, setPri] = useState<1 | 2 | 3>(2);
  const [repeat, setRepeat] = useState<Repeat>('none');
  const [subs, setSubs] = useState<Sub[]>([]);
  const [subText, setSubText] = useState('');
  const [showSubs, setShowSubs] = useState(false);
  const [pick, setPick] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setTitle(task?.title ?? ''); setDate(task?.date ?? defaultDate ?? today());
    setCat(task?.cat ?? defaultCat ?? null); setPri(task?.pri ?? 2); setRepeat(task?.repeat ?? 'none');
    setSubs(task?.sub ?? []); setShowSubs(!!task?.sub.length); setPick(false); setSubText('');
  }, [visible]);

  const save = () => {
    if (!title.trim()) return;
    const body = { title: title.trim(), date, cat, pri, repeat, sub: subs };
    if (task) updateTask(task.id, body); else addTask(body);
    onClose();
  };
  const addSub = () => {
    if (!subText.trim()) return;
    setSubs([...subs, { id: uid(), t: subText.trim(), d: false }]); setSubText('');
  };
  const iconBtn = { padding: 6 } as const;
  const quick: [string, string][] = [['Hari ini', today()], ['Besok', addDays(today(), 1)], ['Lusa', addDays(today(), 2)], ['+7 hari', addDays(today(), 7)]];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={{ backgroundColor: c.bg, padding: 18, paddingBottom: 28, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <TextInput autoFocus={!task} value={title} onChangeText={setTitle} onSubmitEditing={save}
            placeholder="Meeting besok jam 3" placeholderTextColor={c.muted}
            style={{ fontSize: 20, color: c.text, paddingVertical: 10 }} />

          {showSubs && (
            <View style={{ marginBottom: 8 }}>
              {subs.map((u) => (
                <View key={u.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
                  <Pressable onPress={() => setSubs(subs.map((x) => (x.id === u.id ? { ...x, d: !x.d } : x)))}>
                    <Icon n={u.d ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={u.d ? c.primary : c.muted} />
                  </Pressable>
                  <Text style={{ flex: 1, color: u.d ? c.muted : c.text, textDecorationLine: u.d ? 'line-through' : 'none' }}>{u.t}</Text>
                  <Pressable onPress={() => setSubs(subs.filter((x) => x.id !== u.id))}><Icon n="close" size={18} color={c.muted} /></Pressable>
                </View>
              ))}
              <TextInput value={subText} onChangeText={setSubText} onSubmitEditing={addSub} placeholder="+ Tambah subtugas"
                placeholderTextColor={c.muted} style={{ color: c.text, paddingVertical: 8 }} />
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 }}>
            <Pressable onPress={() => setPick(!pick)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, ...iconBtn }}>
              <Icon n="calendar-outline" size={22} color={c.primary} />
              <Text style={{ color: c.primary, fontSize: 15 }}>{dateLabel(date)}</Text>
            </Pressable>
            <Pressable style={iconBtn} onPress={() => setRepeat(REP[(REP.indexOf(repeat) + 1) % 3])}>
              <Icon n="repeat" size={22} color={repeat === 'none' ? c.muted : c.primary} />
            </Pressable>
            <Pressable style={iconBtn} onPress={() => setShowSubs(!showSubs)}>
              <Icon n="git-branch-outline" size={22} color={showSubs || subs.length ? c.primary : c.muted} />
            </Pressable>
            <Pressable style={iconBtn} onPress={() => setPri(((pri % 3) + 1) as 1 | 2 | 3)}>
              <Icon n="flag" size={22} color={PRI[pri]} />
            </Pressable>
            <Text style={{ color: c.muted, fontSize: 12 }}>{PRI_LABEL[pri]}</Text>
          </View>
          {repeat !== 'none' && <Text style={{ color: c.muted, fontSize: 12, marginTop: 4 }}>{REP_L[repeat]}</Text>}

          {pick && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {quick.map(([l, d]) => <Chip key={l} label={l} on={date === d} onPress={() => { setDate(d); setPick(false); }} />)}
              {defaultDate && !quick.some(([, d]) => d === defaultDate) &&
                <Chip label={defaultDate} on={date === defaultDate} onPress={() => { setDate(defaultDate); setPick(false); }} />}
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ flex: 1 }}>
              <Chip label="Tanpa kategori" on={cat === null} onPress={() => setCat(null)} color={c.muted} />
              {cats.map((x) => <Chip key={x.id} label={x.name} on={cat === x.id} color={x.color} onPress={() => setCat(x.id)} />)}
            </ScrollView>
            {task && (
              <Pressable onPress={() => { removeTasks([task.id]); onClose(); }} hitSlop={8}>
                <Icon n="trash-outline" size={24} color={PRI[1]} />
              </Pressable>
            )}
            <Pressable onPress={save} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: title.trim() ? c.primary : c.muted, alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="checkmark" size={28} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
