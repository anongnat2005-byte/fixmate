// API ดึงข้อมูลเนื้อหาจากฐานข้อมูล (ตาราง solutions และ articles)
// supabase-js จะเรียก REST API ของ Supabase ให้เอง เช่น GET /rest/v1/solutions
import { supabase } from '../lib/supabase';

// ดึงวิธีแก้ปัญหาทุกประเภท → คืนเป็น object แบบ { network: {...}, system: {...}, ... }
export async function fetchSolutions() {
  const { data, error } = await supabase.from('solutions').select('*');
  if (error) throw error;

  const map = {};
  data.forEach((r) => {
    map[r.type] = {
      icon: r.icon,
      title: r.title,
      sub: r.sub,
      causes: r.causes,
      note: r.note,
      tips: r.tips,
      steps: r.steps,
    };
  });
  return map;
}

// ดึงบทความแนะนำ เรียงตาม sort_order
export async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('title, type')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}
