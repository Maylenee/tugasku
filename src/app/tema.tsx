import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Icon } from '../components/UI';
import { ACCENTS, useTheme } from '../lib/colors';
import { useData } from '../lib/data';

export default function Tema() {
  const c = useTheme();
  const { settings, setSettings } = useData();
  const card = { backgroundColor: c.card, borderRadius: 16, padding: 16, marginBottom: 14 } as const;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <Header title="Tema" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[card, { flexDirection: 'row', alignItems: 'center' }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, color: c.text }}>Mode Gelap Otomatis</Text>
            <Text style={{ color: c.muted, marginTop: 2 }}>Ikuti Mode Gelap sistem</Text>
          </View>
          <Switch value={settings.darkAuto} onValueChange={(v) => setSettings({ darkAuto: v })} />
        </View>
        <View style={card}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: c.text, marginBottom: 14 }}>Warna Aksen</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {ACCENTS.map((a) => (
              <Pressable key={a} onPress={() => setSettings({ accent: a })}
                style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: a, alignItems: 'center', justifyContent: 'flex-end', padding: 6 }}>
                {settings.accent === a && <Icon n="checkmark-circle" size={22} color="#fff" />}
              </Pressable>))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
