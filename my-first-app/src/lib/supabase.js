// สร้าง Supabase client ตัวเดียวใช้ทั้งแอป
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isConfigured } from '../config';

// ถ้ายังไม่ได้ใส่ค่าใน config.js ใช้ค่าชั่วคราวกันแอปพังตอนเปิด
// (หน้า Login จะแจ้งเตือนให้ตั้งค่าก่อน)
export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isConfigured ? SUPABASE_ANON_KEY : 'placeholder-key',
  {
    auth: {
      storage: AsyncStorage, // จำการล็อกอินไว้ในเครื่อง
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
