import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { s } from '../styles';
import Header from '../components/Header';
import Chip from '../components/Chip';
import { DEVICES, TYPES, SEVERITIES, MODES } from '../data/mockData';

// หน้า 3: วิเคราะห์ปัญหา
export default function AnalyzeScreen({
  mode, setMode,
  device, setDevice,
  type, setType,
  severity, setSeverity,
  detail, setDetail,
  image, setImage,
  onBack, onSubmit,
}) {
  // เลือกรูปจากคลังภาพ หรือถ่ายรูปใหม่ แล้วเก็บเป็น { uri, base64 } ใน state
  const pickImage = async (fromCamera) => {
    try {
      const options = { mediaTypes: ['images'], quality: 0.5, base64: true };
      let result;
      if (fromCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('ไม่ได้รับอนุญาต', 'กรุณาอนุญาตการใช้กล้องในการตั้งค่า');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const a = result.assets[0];
        setImage({ uri: a.uri, base64: a.base64 });
      }
    } catch (e) {
      Alert.alert('เลือกรูปไม่สำเร็จ', (e && e.message) || 'กรุณาลองใหม่');
    }
  };

  const detailTitle =
    mode === 'scan' ? '4. วางข้อความ Error' : '4. รายละเอียดเพิ่มเติม (ถ้ามี)';
  const detailHint =
    mode === 'scan'
      ? 'วางข้อความ Error หรือรหัส Error ที่นี่...'
      : 'อธิบายปัญหาเพิ่มเติม เช่น ข้อความ Error หรือสิ่งที่เกิดขึ้น...';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="วิเคราะห์ปัญหา"
        subtitle="เลือกข้อมูลให้ครบ เพื่อผลลัพธ์ที่แม่นยำ"
        onBack={onBack}
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.row}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[s.modeTab, mode === m.key && s.modeTabActive]}
              onPress={() => setMode(m.key)}
            >
              <Text style={[s.modeTxt, mode === m.key && { color: '#fff' }]}>
                {m.th}
              </Text>
              <Text style={[s.modeTxt, mode === m.key && { color: '#fff' }]}>
                {m.en}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>1. ประเภทอุปกรณ์</Text>
        <View style={s.row}>
          {DEVICES.map((d) => (
            <Chip
              key={d}
              label={d}
              selected={device === d}
              onPress={() => setDevice(d)}
              style={{ flex: 1 }}
            />
          ))}
        </View>

        <Text style={s.label}>2. ประเภทปัญหา</Text>
        <View style={s.row}>
          {TYPES.map((t) => (
            <Chip
              key={t.key}
              label={t.label}
              selected={type === t.key}
              onPress={() => setType(t.key)}
              style={{ flex: 1 }}
            />
          ))}
        </View>

        <Text style={s.label}>3. ระดับความรุนแรง</Text>
        <View style={s.row}>
          {SEVERITIES.map((v) => (
            <Chip
              key={v.key}
              label={v.label}
              selected={severity === v.key}
              onPress={() => setSeverity(v.key)}
              style={{ flex: 1 }}
              selectedStyle={s.chipWarn}
              selectedTextStyle={s.chipWarnTxt}
            />
          ))}
        </View>

        <Text style={s.label}>{detailTitle}</Text>
        <View style={s.textArea}>
          <TextInput
            style={s.textAreaInput}
            placeholder={detailHint}
            placeholderTextColor="#B0B7C3"
            multiline
            maxLength={500}
            value={detail}
            onChangeText={setDetail}
            textAlignVertical="top"
          />
          <Text style={s.counter}>{detail.length}/500</Text>
        </View>

        <Text style={s.label}>5. แนบรูปภาพหน้าจอ (ถ้ามี)</Text>
        {image ? (
          <View>
            <Image source={{ uri: image.uri }} style={s.previewImg} />
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={s.removeImg}>ลบรูป</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.row}>
            <TouchableOpacity style={s.imgBtn} onPress={() => pickImage(false)}>
              <Text style={s.imgBtnTxt}>🖼️ เลือกจากคลังภาพ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.imgBtn} onPress={() => pickImage(true)}>
              <Text style={s.imgBtnTxt}>📷 ถ่ายรูป</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={s.primaryBtn} onPress={onSubmit}>
          <Text style={s.primaryBtnTxt}>วิเคราะห์ปัญหา</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
