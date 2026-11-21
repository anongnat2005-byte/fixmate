// ตั้งค่าการเชื่อมต่อ Supabase
// เอาค่าจาก Supabase Dashboard → Project Settings → API
//   SUPABASE_URL      = Project URL (ขึ้นต้นด้วย https://)
//   SUPABASE_ANON_KEY = anon public key (หรือ publishable key)
// คีย์ชุดนี้เป็นคีย์สาธารณะ อยู่ในแอปได้ เพราะข้อมูลถูกป้องกันด้วย Row Level Security ในฐานข้อมูล
// ห้ามเอา service_role key มาใส่ในแอปเด็ดขาด

export const SUPABASE_URL = 'https://gvjogwuttephzvromzmv.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_ycxr0e6MCtGUpP8Es8iRPQ_mcoX6TVp';

export const isConfigured =
  SUPABASE_URL.startsWith('https://') && !SUPABASE_ANON_KEY.startsWith('YOUR_');
