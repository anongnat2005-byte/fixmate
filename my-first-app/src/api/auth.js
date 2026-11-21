// API ฝั่ง Login: สมัครสมาชิก / เข้าสู่ระบบ / ออกจากระบบ / ลืมรหัสผ่าน
import { supabase } from '../lib/supabase';

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data; // data.session เป็น null ถ้าเปิดให้ต้องยืนยันอีเมลก่อน
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

// แปลงข้อความ error ของ Supabase เป็นภาษาไทย
export function authErrorMessage(error) {
  const msg = (error && error.message) || '';
  if (msg.includes('Invalid login credentials')) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  if (msg.includes('already registered')) return 'อีเมลนี้ถูกใช้สมัครไปแล้ว';
  if (msg.includes('Password should be')) return 'รหัสผ่านสั้นเกินไป (อย่างน้อย 6 ตัวอักษร)';
  if (msg.includes('Email not confirmed')) return 'ยังไม่ได้ยืนยันอีเมล กรุณาตรวจสอบกล่องจดหมาย';
  if (msg.includes('invalid format') || msg.includes('valid email')) return 'รูปแบบอีเมลไม่ถูกต้อง';
  if (msg.includes('rate limit')) return 'ลองบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่';
  if (msg.includes('Network request failed')) return 'เชื่อมต่ออินเทอร์เน็ตไม่ได้';
  return msg || 'เกิดข้อผิดพลาด';
}
