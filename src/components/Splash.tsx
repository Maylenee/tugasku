import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { APP_NAME, Logo } from '../lib/brand';

export default function Splash({ visible }: { visible: boolean }) {
  const op = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const [gone, setGone] = useState(false);

  useEffect(() => { Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(); }, []);
  useEffect(() => {
    if (!visible) Animated.timing(op, { toValue: 0, duration: 350, useNativeDriver: true }).start(() => setGone(true));
  }, [visible]);
  if (gone) return null;

  return (
    <Animated.View pointerEvents={visible ? 'auto' : 'none'}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#62B6FF', alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <View style={{ position: 'absolute', width: 520, height: 520, borderRadius: 260, backgroundColor: 'rgba(255,255,255,0.08)', top: -160, left: -200 }} />
      <View style={{ position: 'absolute', width: 640, height: 640, borderRadius: 320, backgroundColor: 'rgba(255,255,255,0.07)', bottom: -300, right: -260 }} />
      <Animated.View style={{ alignItems: 'center', transform: [{ scale }] }}>
        <Logo size={112} />
        <Text style={{ marginTop: 24, fontSize: 40, fontWeight: '800', color: '#fff' }}>{APP_NAME}</Text>
      </Animated.View>
    </Animated.View>
  );
}
