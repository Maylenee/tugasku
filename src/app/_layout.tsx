import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import Splash from '../components/Splash';
import { useTheme } from '../lib/colors';
import { DataProvider, useData } from '../lib/data';

function Inner() {
  const c = useTheme();
  const { ready } = useData();
  const [min, setMin] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMin(true), 1400); return () => clearTimeout(t); }, []);
  return (
    <>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }} />
      <Splash visible={!(ready && min)} />
    </>
  );
}
export default function RootLayout() {
  return <DataProvider><Inner /></DataProvider>;
}
