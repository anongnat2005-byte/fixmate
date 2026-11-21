// แปลงข้อความ base64 (ที่ได้จากตัวเลือกรูป) เป็นไบต์ เพื่ออัปโหลดขึ้น Supabase Storage
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function base64ToArrayBuffer(b64) {
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, '');
  const bytes = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let p = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const a = CHARS.indexOf(clean[i]);
    const b = CHARS.indexOf(clean[i + 1]);
    const c = i + 2 < clean.length ? CHARS.indexOf(clean[i + 2]) : -1;
    const d = i + 3 < clean.length ? CHARS.indexOf(clean[i + 3]) : -1;
    bytes[p++] = (a << 2) | (b >> 4);
    if (c !== -1) bytes[p++] = ((b & 15) << 4) | (c >> 2);
    if (d !== -1) bytes[p++] = ((c & 3) << 6) | d;
  }
  return bytes.buffer.slice(0, p);
}
