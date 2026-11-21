// API ประวัติการวิเคราะห์ของผู้ใช้ (ตาราง analysis_history) ครบ CRUD
//   Create = saveAnalysis   Read = fetchHistory
//   Update = updateHistory  Delete = deleteHistory
// ฐานข้อมูลตั้ง Row Level Security ไว้ ผู้ใช้เห็น/แก้ไขได้เฉพาะแถวของตัวเอง
// คอลัมน์ user_id ถูกเติมอัตโนมัติจากบัญชีที่ล็อกอินอยู่ (default auth.uid())
import { supabase } from '../lib/supabase';
import { base64ToArrayBuffer } from '../lib/base64';

const BUCKET = 'screenshots';

// อัปโหลดรูปไปที่ Storage → คืน path เช่น "<user-id>/1700000000000.jpg"
async function uploadImage(base64) {
  const { data } = await supabase.auth.getUser();
  const userId = data && data.user ? data.user.id : null;
  if (!userId) throw new Error('ไม่พบผู้ใช้ที่ล็อกอิน');

  const path = `${userId}/${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, base64ToArrayBuffer(base64), { contentType: 'image/jpeg' });
  if (error) throw error;
  return path;
}

// CREATE: บันทึกผลการวิเคราะห์ (พร้อมรูปถ้ามี)
export async function saveAnalysis({ mode, device, type, severity, detail, image }) {
  let image_path = null;
  if (image && image.base64) image_path = await uploadImage(image.base64);

  const { error } = await supabase
    .from('analysis_history')
    .insert({ mode, device, type, severity, detail: detail || '', image_path });
  if (error) throw error;
}

// READ: ดึงประวัติ แล้วขอลิงก์ชั่วคราว (signed URL) สำหรับรูปที่แนบไว้
export async function fetchHistory() {
  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;

  const paths = data.filter((r) => r.image_path).map((r) => r.image_path);
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(paths, 3600);
    const urlByPath = {};
    (signed || []).forEach((x) => {
      if (x.signedUrl) urlByPath[x.path] = x.signedUrl;
    });
    data.forEach((r) => {
      r.image_url = r.image_path ? urlByPath[r.image_path] || null : null;
    });
  }
  return data;
}

// UPDATE: แก้ไขบันทึกของผู้ใช้ (note)
export async function updateHistory(id, { note }) {
  const { error } = await supabase
    .from('analysis_history')
    .update({ note })
    .eq('id', id);
  if (error) throw error;
}

// DELETE: ลบแถว และลบไฟล์รูปที่แนบด้วย
export async function deleteHistory(item) {
  const { error } = await supabase.from('analysis_history').delete().eq('id', item.id);
  if (error) throw error;
  if (item.image_path) {
    await supabase.storage.from(BUCKET).remove([item.image_path]);
  }
}
