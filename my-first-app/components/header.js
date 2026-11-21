import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { s } from '../styles';

// แถบหัวข้อด้านบน พร้อมปุ่มย้อนกลับ
export default function Header({ title, subtitle, onBack }) {
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={onBack} style={s.backBtn}>
        <Text style={s.backTxt}>‹</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={s.headerTitle}>{title}</Text>
        {subtitle ? <Text style={s.headerSub}>{subtitle}</Text> : null}
      </View>
      <View style={s.backBtn} />
    </View>
  );
}
