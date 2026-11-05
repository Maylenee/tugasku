import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Icon } from '../components/UI';
import { useTheme } from '../lib/colors';
import { useData } from '../lib/data';

const VIEW_L = { list: 'Daftar', month: 'Bulan', '3day': '3 Hari' } as const;
const VIEWS = ['list', 'month', '3day'] as const;

export default function Pengaturan() {
  const c = useTheme();
  const r = useRouter();
  const { settings: s, setSettings } = useData();
  const Row = ({ icon, label, value, onPress, right }: any) => (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15 }}>
      <Icon n={icon} size={24} />
      <Text style={{ flex: 1, fontSize: 17, color: c.text }}>{label}</Text>
      {value ? <Text style={{ color: c.muted }}>{value}</Text> : null}
      {right ?? (onPress && !value ? <Icon n="chevron-forward" size={18} color={c.muted} /> : null)}
    </Pressable>
  );
  const Sec = ({ t, children }: any) => (
    <>
      <Text style={{ color: c.muted, fontSize: 15, marginTop: 18, marginBottom: 8, marginLeft: 4 }}>{t}</Text>
      <View style={{ backgroundColor: c.card, borderRadius: 18, paddingHorizontal: 16 }}>{children}</View>
    </>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <Header title="Pengaturan" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Sec t="Sesuaikan">
          <Row icon="shirt-outline" label="Tema" onPress={() => r.push('/tema')} />
          <Row icon="apps-outline" label="Kategori" onPress={() => r.push('/kategori')} />
          <Row icon="albums-outline" label="Tampilan kalender" value={VIEW_L[s.calView]}
            onPress={() => setSettings({ calView: VIEWS[(VIEWS.indexOf(s.calView) + 1) % 3] })} />
          <Row icon="git-branch-outline" label="Subtugas" right={<Switch value={s.showSub} onValueChange={(v) => setSettings({ showSub: v })} />} />
        </Sec>
        <Sec t="Tanggal & Waktu">
          <Row icon="calendar-number-outline" label="Hari pertama dalam seminggu" value={s.weekStart === 0 ? 'Minggu' : 'Senin'}
            onPress={() => setSettings({ weekStart: s.weekStart === 0 ? 1 : 0 })} />
        </Sec>
        <Sec t="Tentang">
          <Row icon="layers-outline" label="Versi" value="1.0.0" />
        </Sec>
      </ScrollView>
    </SafeAreaView>
  );
}
