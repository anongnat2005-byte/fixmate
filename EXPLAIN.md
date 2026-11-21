# อธิบายการทำงานของ FixMate (สำหรับนำเสนออาจารย์)

แอปศูนย์รวมวิธีแก้ปัญหา IT ทำด้วย React Native + Expo (รันผ่าน Expo Go) และใช้ Supabase เป็นระบบหลังบ้าน
ส่วนหนึ่งของโค้ดเขียนโดยใช้ AI ช่วย เอกสารนี้อธิบายว่าแต่ละส่วนทำงานอย่างไร

## 1) เทียบกับเกณฑ์การให้คะแนน

| เกณฑ์ | ทำอย่างไร | ไฟล์ที่ต้องเปิดให้ดู |
|---|---|---|
| มีหน้าอย่างน้อย 5 หน้า กดเชื่อมโยงและส่งข้อมูลได้ | มี **8 หน้า**: Login, Home, Analyze, Result, Steps, Related, History, Settings | `src/screens/*.js` |
| เชื่อม Supabase | สร้าง client ตัวเดียว ใช้ URL + anon key | `src/lib/supabase.js`, `src/config.js` |
| หน้า Login เชื่อม Supabase | สมัคร / เข้าสู่ระบบ / ลืมรหัสผ่าน / ออกจากระบบ ด้วย Supabase Auth | `src/api/auth.js`, `src/screens/LoginScreen.js` |
| CRUD | ตาราง `analysis_history` ครบ 4 อย่าง (ดูข้อ 3) | `src/api/history.js`, `src/screens/HistoryScreen.js` |
| API ภายนอก (คะแนนพิเศษ) | เรียก **Stack Exchange API** ค้นกระทู้จาก SuperUser | `src/api/stackexchange.js`, `src/screens/RelatedScreen.js` |
| บันทึกรูป / เครื่องมืออื่น | แนบรูปจากคลังภาพหรือกล้อง เก็บใน **Supabase Storage** แล้วแสดงในประวัติ | `src/screens/AnalyzeScreen.js`, `src/api/history.js` |
| ใช้ CSS ให้สวยงาม | React Native ใช้ `StyleSheet` (เหมือน CSS) รวมไว้ที่ไฟล์เดียว: สี, มุมโค้ง, การ์ด, ปุ่ม, โมดัล | `src/styles.js` |

## 2) แอปส่งข้อมูลระหว่างหน้าอย่างไร

`App.js` เป็นตัวกลาง เก็บ state ไว้ที่เดียว (ประเภทอุปกรณ์, ประเภทปัญหา, ความรุนแรง, รายละเอียด, รูป)
แล้วส่งให้แต่ละหน้าผ่าน props เมื่อกดปุ่มจะเรียกฟังก์ชัน `setScreen('ชื่อหน้า')` เพื่อเปลี่ยนหน้า

```
Login → Home → Analyze → Result → Steps
                           ├─→ Related (เรียก API ภายนอก)
                           └─→ บันทึกลง Supabase → History (แก้ไข/ลบ)
Settings → ออกจากระบบ → Login
```

ตัวอย่างการส่งข้อมูล: หน้า Analyze เลือก "เครือข่าย" + "ความรุนแรงปานกลาง" → เก็บใน state ของ `App.js`
→ หน้า Result อ่านค่าเดียวกันไปแสดงผล และส่งไปบันทึกลงฐานข้อมูล

## 3) CRUD ทำงานอย่างไร (ตาราง `analysis_history`)

| การทำงาน | ผู้ใช้ทำอะไร | โค้ด (`src/api/history.js`) | คำสั่งที่ Supabase ทำ |
|---|---|---|---|
| **C**reate | กด "บันทึกผลลัพธ์" | `saveAnalysis()` | `insert` แถวใหม่ (ถ้ามีรูปจะอัปโหลดก่อน) |
| **R**ead | เปิดแท็บ History | `fetchHistory()` | `select` เรียงใหม่สุดก่อน |
| **U**pdate | กด "แก้ไข" แล้วพิมพ์บันทึก | `updateHistory()` | `update` คอลัมน์ `note` |
| **D**elete | กด "ลบ" | `deleteHistory()` | `delete` แถว + ลบไฟล์รูป |

**ความปลอดภัย:** ตารางเปิด Row Level Security ไว้ ผู้ใช้แต่ละคนเห็น/แก้ไข/ลบได้เฉพาะแถวที่ `user_id` ตรงกับตัวเอง
(ดู policy ท้ายไฟล์ `supabase/schema.sql`) แม้คนอื่นได้ anon key ไปก็อ่านข้อมูลของคนอื่นไม่ได้

## 4) Login ทำงานอย่างไร

1. ผู้ใช้กรอกอีเมล/รหัสผ่าน กด Login → `signIn()` เรียก `supabase.auth.signInWithPassword`
2. Supabase ตรวจสอบรหัสผ่าน (เก็บแบบเข้ารหัส) แล้วส่ง session กลับมา
3. `App.js` ฟังเหตุการณ์ `onAuthStateChange` พอมี session ก็เปลี่ยนไปหน้า Home เอง
4. session ถูกเก็บใน AsyncStorage ปิดแอปแล้วเปิดใหม่ยังล็อกอินค้างอยู่
5. ออกจากระบบ (Settings) → `signOut()` → session หาย → กลับหน้า Login

## 5) API ภายนอกทำงานอย่างไร

หน้า Result กด "ดูกระทู้ที่เกี่ยวข้อง" → หน้า Related เรียก

```
GET https://api.stackexchange.com/2.3/search/advanced?q=<คำค้น>&site=superuser
```

ได้ข้อมูล JSON (รายการกระทู้: ชื่อ, ลิงก์, คะแนน, จำนวนคำตอบ) → แปลงเป็นรายการในแอป → กดเปิดอ่านกระทู้จริงในเบราว์เซอร์
ไม่ต้องใช้ API key (จำกัดประมาณ 300 ครั้งต่อวันต่อ IP) คำค้นต้องเป็นภาษาอังกฤษ เพราะ SuperUser เป็นเว็บภาษาอังกฤษ

## 6) รูปภาพทำงานอย่างไร

1. หน้า Analyze กด "เลือกจากคลังภาพ" หรือ "ถ่ายรูป" (ไลบรารี `expo-image-picker`)
2. ได้รูปเป็น base64 เก็บใน state (แสดงตัวอย่างได้ทันที)
3. กด "บันทึกผลลัพธ์" → แปลง base64 เป็นไบต์ (`src/lib/base64.js`) → อัปโหลดไปที่ Supabase Storage
   bucket `screenshots` โฟลเดอร์ตาม id ผู้ใช้ → เก็บ path ลงคอลัมน์ `image_path`
4. หน้า History ขอลิงก์ชั่วคราว (signed URL) มาแสดงรูป เพราะ bucket เป็น private คนอื่นเปิดดูไม่ได้

## 7) การใช้ AI ช่วยเขียนโค้ด

- ใช้ AI ช่วยร่างโค้ดและโครงสร้างโปรเจกต์ แล้วนำมารัน ทดสอบ และปรับแก้เอง
- สามารถอธิบายแต่ละไฟล์ได้ตามตารางข้อ 1 และขั้นตอนในข้อ 2-6
- ข้อมูลวิธีแก้ปัญหา (ตาราง `solutions`, `articles`) เป็นข้อมูลตัวอย่างสำหรับเดโม

## 8) คำถามที่อาจารย์อาจถาม

**ทำไมใส่ anon key ไว้ในแอปได้?** — เป็นคีย์สาธารณะ ความปลอดภัยอยู่ที่ Row Level Security ในฐานข้อมูล ส่วน service_role key ห้ามใส่ในแอป

**ถ้าเน็ตหลุดเกิดอะไรขึ้น?** — ข้อมูลวิธีแก้ใช้ข้อมูลจำลอง (`mockData.js`) แทน และหน้า Home แสดงสถานะ ส่วนฟังก์ชันบันทึก/ประวัติจะแจ้งข้อผิดพลาด

**ทำไมแยกไฟล์?** — แยกตามหน้าที่: `screens` = หน้าจอ, `api` = ติดต่อ Supabase/เว็บภายนอก, `components` = ชิ้นส่วนใช้ซ้ำ, `data` = ข้อมูลจำลอง, `styles.js` = หน้าตา ทำให้แก้ไขง่าย
