import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useTheme } from '../lib/colors';
import { useData } from '../lib/data';
import { APP_NAME, Logo } from '../lib/brand';
import { Icon } from './UI';

export default function Drawer({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const c = useTheme();
  const r = useRouter();
  const { cats, tasks } = useData();
  const [open, setOpen] = useState(true);
  const go = (p: any) => { onClose(); r.push(p); };
  const Item = ({ icon, label, onPress, color, right, indent }: any) => (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14, paddingLeft: indent ? 36 : 0 }}>
      <Icon n={icon} size={24} color={color ?? c.primary} />
      <Text style={{ flex: 1, fontSize: 17, color: c.text }}>{label}</Text>
      {right}
    </Pressable>
  );
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <View style={{ width: '82%', backgroundColor: c.bg, paddingTop: 70 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <Logo size={44} bg={c.primary} fg="#fff" />
              <Text style={{ fontSize: 30, fontWeight: '800', color: c.primary }}>{APP_NAME}</Text>
            </View>
            <View style={{ backgroundColor: c.card, borderRadius: 18, paddingHorizontal: 16 }}>
              <Item icon="star-outline" label="Bintangi Tugas" onPress={() => go('/bintang')} />
              <Item icon="hourglass-outline" label="Fokus" onPress={() => go('/fokus')} />
              <Item icon="flag-outline" label="Kebiasaan" onPress={() => go('/kebiasaan')} />
              <Item icon="apps-outline" label="Kategori" onPress={() => setOpen(!open)}
                right={<Icon n={open ? 'chevron-up' : 'chevron-down'} size={18} color={c.muted} />} />
              {open && (
                <>
                  <Item indent icon="folder-open-outline" label="Semua" color={c.muted}
                    right={<Text style={{ color: c.muted }}>{tasks.filter((t) => !t.done).length}</Text>}
                    onPress={() => go({ pathname: '/', params: { cat: 'all' } })} />
                  {cats.map((x) => (
                    <Item key={x.id} indent icon={x.icon} label={x.name} color={x.color}
                      right={<Text style={{ color: c.muted }}>{tasks.filter((t) => t.cat === x.id && !t.done).length}</Text>}
                      onPress={() => go({ pathname: '/', params: { cat: x.id } })} />
                  ))}
                  <Item indent icon="add-circle-outline" label="Buat baru" color={c.muted} onPress={() => go('/kategori')} />
                </>
              )}
            </View>
            <View style={{ backgroundColor: c.card, borderRadius: 18, paddingHorizontal: 16, marginTop: 14 }}>
              <Item icon="shirt-outline" label="Tema" color="#C86BE0" onPress={() => go('/tema')} />
              <Item icon="settings-outline" label="Pengaturan" color="#6B7BE0" onPress={() => go('/pengaturan')} />
            </View>
          </ScrollView>
        </View>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  );
}
