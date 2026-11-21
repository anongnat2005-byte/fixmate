import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { s } from '../styles';

const TABS = [
  { key: 'home', label: 'Home' },
  { key: 'history', label: 'History' },
  { key: 'settings', label: 'Settings' },
];

// แถบเมนูด้านล่าง Home / History / Settings
export default function BottomBar({ active, onChange }) {
  return (
    <View style={s.bottomBar}>
      {TABS.map((t) => (
        <TouchableOpacity key={t.key} style={s.tab} onPress={() => onChange(t.key)}>
          <Text style={[s.tabTxt, active === t.key && s.tabTxtActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
