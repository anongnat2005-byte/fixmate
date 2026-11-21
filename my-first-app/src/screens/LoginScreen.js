import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { s } from '../styles';
import { isConfigured } from '../config';
import { signIn, signUp, resetPassword, authErrorMessage } from '../api/auth';

// หน้า 1: เข้าสู่ระบบ / สมัครสมาชิก (ใช้ Supabase Auth)
// เมื่อสำเร็จ App.js จะรู้เองผ่าน onAuthStateChange แล้วพาไปหน้า Home
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (checkPassword = true) => {
    if (!isConfigured) {
      Alert.alert(
        'ยังไม่ได้ตั้งค่าฐานข้อมูล',
        'กรุณาใส่ SUPABASE_URL และ SUPABASE_ANON_KEY ในไฟล์ src/config.js'
      );
      return false;
    }
    if (!email.trim() || (checkPassword && !password)) {
      Alert.alert('กรอกข้อมูลไม่ครบ', 'กรุณากรอก Email และ Password');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      Alert.alert('เข้าสู่ระบบไม่สำเร็จ', authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;
    if (password.length < 6) {
      Alert.alert('รหัสผ่านสั้นเกินไป', 'ต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    setLoading(true);
    try {
      const { session } = await signUp(email.trim(), password);
      if (!session) {
        Alert.alert(
          'สมัครสมาชิกสำเร็จ',
          'กรุณายืนยันอีเมลของคุณ แล้วกลับมาเข้าสู่ระบบ'
        );
      }
    } catch (e) {
      Alert.alert('สมัครสมาชิกไม่สำเร็จ', authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!validate(false)) return;
    setLoading(true);
    try {
      await resetPassword(email.trim());
      Alert.alert('ส่งอีเมลแล้ว', 'กรุณาตรวจสอบอีเมลเพื่อตั้งรหัสผ่านใหม่');
    } catch (e) {
      Alert.alert('ส่งอีเมลไม่สำเร็จ', authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.loginWrap}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.logoIcon}>🔧</Text>
        <Text style={s.logoText}>FixMate</Text>
        <Text style={s.logoSub}>ศูนย์รวมวิธีแก้ปัญหา IT{'\n'}ในที่เดียว</Text>

        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
        <TextInput
          style={s.input}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          style={[s.loginBtn, loading && s.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.loginBtnTxt}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgot} disabled={loading}>
          <Text style={s.forgot}>ลืมรหัสผ่าน?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.createBtn, loading && s.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={s.createBtnTxt}>Create account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
