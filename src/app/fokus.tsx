import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, Text, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Chip, Header, Icon } from '../components/UI';
import { useTheme } from '../lib/colors';
import { useData } from '../lib/data';

const R = 120, SW = 14, SZ = 2 * (R + SW), CIRC = 2 * Math.PI * R;
const mmss = (s: number) => `${String(Math.floor(Math.max(s, 0) / 60)).padStart(2, '0')}:${String(Math.max(s, 0) % 60).padStart(2, '0')}`;

export default function Fokus() {
  const c = useTheme();
  const { tasks, settings, setSettings } = useData();
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('timer');
  const total = settings.focusMin * 60;
  const [secs, setSecs] = useState(total);
  const [run, setRun] = useState(false);
  const [edit, setEdit] = useState(false);
  const [picker, setPicker] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const task = tasks.find((t) => t.id === taskId);
  const start = mode === 'timer' ? total : 0;

  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setSecs((x) => (mode === 'timer' ? x - 1 : x + 1)), 1000);
    return () => clearInterval(id);
  }, [run, mode]);
  useEffect(() => {
    if (mode === 'timer' && run && secs <= 0) {
      setRun(false); setSecs(total); Vibration.vibrate([0, 400, 200, 400]);
      Alert.alert('Sesi fokus selesai', 'Waktunya istirahat sebentar!');
    }
  }, [secs]);

  const reset = (m = mode, t = total) => { setRun(false); setSecs(m === 'timer' ? t : 0); };
  const prog = mode === 'timer' ? secs / total : (secs % 60) / 60;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top', 'bottom']}>
      <Header title="Fokus" />
      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{ flexDirection: 'row', backgroundColor: c.chip, borderRadius: 99, padding: 4 }}>
          {(['timer', 'stopwatch'] as const).map((m) => (
            <Pressable key={m} onPress={() => { setMode(m); reset(m); }}
              style={{ paddingHorizontal: 28, paddingVertical: 10, borderRadius: 99, backgroundColor: mode === m ? c.primary : 'transparent' }}>
              <Text style={{ fontSize: 16, color: mode === m ? '#fff' : c.muted }}>{m === 'timer' ? 'Timer' : 'Stopwatch'}</Text>
            </Pressable>))}
        </View>
        <Pressable onPress={() => setPicker(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 24 }}>
          <Text style={{ fontSize: 18, color: c.text }}>{task ? task.title : 'Pilih tugas'}</Text>
          <Icon n="chevron-forward" size={18} color={c.muted} />
        </Pressable>
        <View style={{ width: SZ, height: SZ, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SZ} height={SZ} style={{ position: 'absolute' }}>
            <Circle cx={SZ / 2} cy={SZ / 2} r={R} stroke={c.chip} strokeWidth={SW} fill="none" />
            <Circle cx={SZ / 2} cy={SZ / 2} r={R} stroke={c.primary} strokeWidth={SW} fill="none" strokeLinecap="round"
              strokeDasharray={`${CIRC}`} strokeDashoffset={CIRC * (1 - prog)} rotation={-90} origin={`${SZ / 2}, ${SZ / 2}`} />
          </Svg>
          <Text style={{ fontSize: 60, fontWeight: '600', color: c.text }}>{mmss(secs)}</Text>
          {mode === 'timer' && !run && (
            <Pressable onPress={() => setEdit(!edit)} style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
              <Icon n="create-outline" size={16} color={c.primary} /><Text style={{ color: c.primary }}>Edit durasi</Text>
            </Pressable>)}
        </View>
        {edit && mode === 'timer' && !run && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            {[5, 15, 25, 45, 60].map((n) => (
              <Chip key={n} label={`${n}m`} on={settings.focusMin === n} onPress={() => { setSettings({ focusMin: n }); reset('timer', n * 60); setEdit(false); }} />))}
          </View>)}
      </View>
      <View style={{ paddingHorizontal: 32, paddingBottom: 24, gap: 10 }}>
        <Pressable onPress={() => setRun(!run)} style={{ backgroundColor: c.primary, padding: 18, borderRadius: 99, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>{run ? 'Jeda' : secs !== start ? 'Lanjutkan' : 'Mulai'}</Text>
        </Pressable>
        {!run && secs !== start && (
          <Pressable onPress={() => reset()} style={{ alignItems: 'center', padding: 8 }}><Text style={{ color: c.muted }}>Atur ulang</Text></Pressable>)}
      </View>

      <Modal visible={picker} transparent animationType="slide" onRequestClose={() => setPicker(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => setPicker(false)} />
        <View style={{ backgroundColor: c.bg, maxHeight: '60%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16 }}>
          <FlatList data={[{ id: '', title: 'Tanpa tugas' } as any, ...tasks.filter((t) => !t.done)]} keyExtractor={(t) => t.id || 'none'}
            renderItem={({ item }) => (
              <Pressable onPress={() => { setTaskId(item.id || null); setPicker(false); }} style={{ padding: 14 }}>
                <Text style={{ fontSize: 17, color: taskId === (item.id || null) ? c.primary : c.text }}>{item.title}</Text>
              </Pressable>)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
