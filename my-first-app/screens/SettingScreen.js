import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { s } from '../styles';

// หน้าตั้งค่า: แสดงบัญชีที่ล็อกอินอยู่ และปุ่มออกจากระบบ
export default function SettingsScreen({ email, onLogout }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={s.greet}>Settings</Text>
      {email ? <Text style={s.settingsEmail}>บัญชี: {email}</Text> : null}
      <TouchableOpacity
        style={s.article}
        onPress={() => Alert.alert('เกี่ยวกับ', 'FixMate v1.0 (Demo)')}
      >
        <Text style={s.articleTxt}>เกี่ยวกับแอป</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.article} onPress={onLogout}>
        <Text style={[s.articleTxt, { color: '#EF4444' }]}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </View>
  );
}
