import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

// Ganti nama aplikasi Anda di sini (dipakai di layar loading dan sidebar).
export const APP_NAME = 'Tugasku';

export function Logo({ size = 64, bg = '#FFFFFF', fg = '#0A8DFF' }: { size?: number; bg?: string; fg?: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.27, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="checkmark-done" size={size * 0.62} color={fg} />
    </View>
  );
}
