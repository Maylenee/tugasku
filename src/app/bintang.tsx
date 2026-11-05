import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskRow from '../components/TaskRow';
import TaskSheet from '../components/TaskSheet';
import { Empty, Header } from '../components/UI';
import { useTheme } from '../lib/colors';
import { Task, useData } from '../lib/data';

export default function Bintang() {
  const c = useTheme();
  const { tasks } = useData();
  const [edit, setEdit] = useState<Task | undefined>();
  const list = tasks.filter((t) => t.star).sort((a, b) => Number(a.done) - Number(b.done));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <Header title="Bintangi Tugas" />
      <FlatList data={list} keyExtractor={(t) => t.id} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <TaskRow task={item} onPress={() => setEdit(item)} />}
        ListEmptyComponent={<Empty icon="star" text="Ketuk bintang pada tugas untuk menandainya sebagai penting." />} />
      <TaskSheet visible={!!edit} task={edit} onClose={() => setEdit(undefined)} />
    </SafeAreaView>
  );
}
