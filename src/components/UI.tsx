import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useTheme } from '../lib/colors';

export function Icon({ n, size = 24, color }: { n: string; size?: number; color?: string }) {
  const c = useTheme();
  return <Ionicons name={n as any} size={size} color={color ?? c.text} />;
}

export function Header({ title, right }: { title: string; right?: React.ReactNode }) {
  const r = useRouter();
  const c = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
      <Pressable onPress={() => r.back()} hitSlop={12} style={{ width: 40 }}><Icon n="chevron-back" /></Pressable>
      <Text style={{ fontSize: 20, fontWeight: '700', color: c.text }}>{title}</Text>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function Menu({ visible, onClose, children, top = 100, left, right = 12 }:
  { visible: boolean; onClose: () => void; children: React.ReactNode; top?: number; left?: number; right?: number }) {
  const c = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }} onPress={onClose}>
        <View style={{ position: 'absolute', top, left, right: left === undefined ? right : undefined, minWidth: 230, backgroundColor: c.card, borderRadius: 18, padding: 6 }}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

export function MenuItem({ icon, label, onPress, right, color }:
  { icon?: string; label: string; onPress?: () => void; right?: React.ReactNode; color?: string }) {
  const c = useTheme();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
      {icon ? <Icon n={icon} size={22} color={color} /> : null}
      <Text style={{ flex: 1, fontSize: 16, color: color ?? c.text }}>{label}</Text>
      {right}
    </Pressable>
  );
}

export function Chip({ label, on, onPress, color }: { label: string; on: boolean; onPress: () => void; color?: string }) {
  const c = useTheme();
  const bg = color ?? c.primary;
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, backgroundColor: on ? bg : c.chip }}>
      <Text style={{ color: on ? '#fff' : c.text, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

export function Fab({ onPress }: { onPress: () => void }) {
  const c = useTheme();
  return (
    <Pressable onPress={onPress} style={{
      position: 'absolute', right: 20, bottom: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: c.primary,
      alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2,
      shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }}>
      <Ionicons name="add" size={32} color="#fff" />
    </Pressable>
  );
}

export function Empty({ icon = 'checkmark-done', text, onPress }: { icon?: string; text: string; onPress?: () => void }) {
  const c = useTheme();
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', marginTop: 70, paddingHorizontal: 32 }}>
      <>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: c.chip, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon as any} size={56} color={c.primary} />
        </View>
        <View style={{ marginTop: 24, backgroundColor: c.primary, padding: 16, borderRadius: 18, borderBottomLeftRadius: 4 }}>
          <Text style={{ color: '#fff', fontSize: 16, lineHeight: 22 }}>{text}</Text>
        </View>
      </>
    </Pressable>
  );
}
