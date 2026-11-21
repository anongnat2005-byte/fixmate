import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { s } from '../styles';
import Header from '../components/Header';
import { RISK } from '../data/mockData';

// หน้า 4: ผลการวิเคราะห์
// solution = ข้อมูลวิธีแก้ของประเภทปัญหานี้ (มาจากฐานข้อมูล)
// onSave   = บันทึกผลลงตาราง analysis_history
// alreadySaved = true เมื่อเปิดมาจากหน้าประวัติ (ไม่ต้องบันทึกซ้ำ)
export default function ResultScreen({
  solution,
  severity,
  device,
  onBack,
  onStart,
  onSave,
  onRelated,
  imageUri,
  alreadySaved,
}) {
  const r = solution;
  const risk = RISK[severity];
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!alreadySaved);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
      Alert.alert('บันทึกแล้ว', 'บันทึกผลลัพธ์ลงฐานข้อมูลเรียบร้อย');
    } catch (e) {
      Alert.alert('บันทึกไม่สำเร็จ', (e && e.message) || 'กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="ผลการวิเคราะห์" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={s.resultCard}>
          <View style={s.resultIcon}>
            <Text style={{ fontSize: 28 }}>{r.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.resultTitle}>{r.title}</Text>
            <Text style={s.resultDev}>({device})</Text>
            <Text style={s.resultSub}>{r.sub}</Text>
          </View>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={s.previewImg} />
        ) : null}

        <Text style={s.sectionTitle}>สาเหตุที่เป็นไปได้</Text>
        {r.causes.map((c) => (
          <Text key={c} style={s.bullet}>• {c}</Text>
        ))}

        <View style={[s.riskBox, { backgroundColor: risk.bg }]}>
          <View style={[s.riskCircle, { backgroundColor: risk.color }]}>
            <Text style={s.riskArrow}>{risk.arrow}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.riskSmall}>ระดับความเสี่ยง</Text>
            <Text style={[s.riskLevel, { color: risk.color }]}>{risk.label}</Text>
          </View>
          <Text style={s.riskNote}>{r.note}</Text>
        </View>

        <View style={s.tipBox}>
          <Text style={s.tipTitle}>💡 คำแนะนำเบื้องต้น</Text>
          {r.tips.map((t) => (
            <Text key={t} style={s.tipTxt}>• {t}</Text>
          ))}
          <Text style={s.tipFoot}>
            หากยังไม่หาย ให้กดปุ่มเริ่มวิธีแก้ทีละขั้นตอนด้านล่าง
          </Text>
        </View>

        <TouchableOpacity style={s.primaryBtn} onPress={onStart}>
          <Text style={s.primaryBtnTxt}>▶ เริ่มวิธีแก้ทีละขั้นตอน →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.outlineBtn} onPress={onRelated}>
          <Text style={s.outlineBtnTxt}>🔎 ดูกระทู้ที่เกี่ยวข้อง (SuperUser API)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.outlineBtn, (saved || saving) && s.btnDisabled]}
          onPress={handleSave}
          disabled={saved || saving}
        >
          {saving ? (
            <ActivityIndicator color="#3B6EF0" />
          ) : (
            <Text style={s.outlineBtnTxt}>
              {saved ? '✓ บันทึกผลลัพธ์แล้ว' : 'บันทึกผลลัพธ์'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
