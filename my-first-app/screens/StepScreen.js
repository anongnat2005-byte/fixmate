import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { s } from '../styles';
import Header from '../components/Header';

// หน้า 5: วิธีแก้ทีละขั้นตอน (กดติ๊กทีละข้อได้)
export default function StepsScreen({ solution, onBack, onDone }) {
  const r = solution;
  const [done, setDone] = useState([]);

  const toggle = (i) =>
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  return (
    <View style={{ flex: 1 }}>
      <Header title="วิธีแก้ทีละขั้นตอน" subtitle={r.title} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {r.steps.map((st, i) => {
          const checked = done.includes(i);
          return (
            <TouchableOpacity
              key={st}
              style={[s.stepRow, checked && { backgroundColor: '#E8F8EE' }]}
              onPress={() => toggle(i)}
            >
              <View style={[s.stepNum, checked && { backgroundColor: '#22C55E' }]}>
                <Text style={s.stepNumTxt}>{checked ? '✓' : i + 1}</Text>
              </View>
              <Text style={[s.stepTxt, checked && { color: '#6B7280' }]}>{st}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={[s.primaryBtn, { marginTop: 20 }]}
          onPress={() => {
            if (done.length === r.steps.length) {
              Alert.alert('เรียบร้อย 🎉', 'แก้ปัญหาครบทุกขั้นตอนแล้ว', [
                { text: 'กลับหน้าแรก', onPress: onDone },
              ]);
            } else {
              Alert.alert(
                'ยังไม่ครบ',
                `ทำแล้ว ${done.length}/${r.steps.length} ขั้นตอน`
              );
            }
          }}
        >
          <Text style={s.primaryBtnTxt}>แก้ปัญหาเสร็จแล้ว</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
