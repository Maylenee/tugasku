import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PRI, useTheme } from '../lib/colors';
import { Task, dateLabel, useData } from '../lib/data';
import { Icon } from './UI';

export default function TaskRow({ task, onPress, selecting, picked, onPick }:
  { task: Task; onPress?: () => void; selecting?: boolean; picked?: boolean; onPick?: () => void }) {
  const c = useTheme();
  const { toggleTask, updateTask, cats, settings } = useData();
  const cat = cats.find((x) => x.id === task.cat);
  const subDone = task.sub.filter((u) => u.d).length;
  return (
    <Pressable onPress={selecting ? onPick : onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, padding: 14, borderRadius: 14,
        borderLeftWidth: 5, borderLeftColor: PRI[task.pri], marginBottom: 8 }}>
      <Pressable hitSlop={8} onPress={selecting ? onPick : () => toggleTask(task.id)}>
        <Icon n={selecting ? (picked ? 'checkbox' : 'square-outline') : task.done ? 'checkmark-circle' : 'ellipse-outline'}
          size={26} color={task.done || picked ? c.primary : PRI[task.pri]} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, color: task.done ? c.muted : c.text, textDecorationLine: task.done ? 'line-through' : 'none' }}>{task.title}</Text>
        <Text style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>
          {cat ? cat.name : 'Tanpa kategori'} · {dateLabel(task.date)}
          {settings.showSub && task.sub.length ? ` · ${subDone}/${task.sub.length}` : ''}
          {task.repeat !== 'none' ? ' · ↻' : ''}
        </Text>
      </View>
      {!selecting && (
        <Pressable hitSlop={8} onPress={() => updateTask(task.id, { star: !task.star })}>
          <Icon n={task.star ? 'star' : 'star-outline'} size={22} color={task.star ? '#F5B33F' : c.muted} />
        </Pressable>
      )}
    </Pressable>
  );
}
