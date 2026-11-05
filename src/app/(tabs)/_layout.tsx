import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from '../../lib/colors';

const ic = (n: string) => ({ color, size }: { color: any; size: number }) =>
  <Ionicons name={n as any} size={size} color={color} />;

export default function TabsLayout() {
  const c = useTheme();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: c.primary, tabBarInactiveTintColor: c.muted,
      tabBarStyle: { backgroundColor: c.bg, borderTopColor: c.line } }}>
      <Tabs.Screen name="index" options={{ title: 'Tugas', tabBarIcon: ic('document-text') }} />
      <Tabs.Screen name="kalender" options={{ title: 'Kalender', tabBarIcon: ic('calendar') }} />
      <Tabs.Screen name="milikku" options={{ title: 'Milikku', tabBarIcon: ic('happy') }} />
    </Tabs>
  );
}
