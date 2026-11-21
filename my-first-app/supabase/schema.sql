-- FixMate: ฐานข้อมูลสำหรับแอป (รันทั้งไฟล์ใน Supabase → SQL Editor → New query → Run)
-- รันซ้ำได้ ไม่ทำให้ข้อมูลซ้ำ

-- 1) ตารางวิธีแก้ปัญหา (อ่านอย่างเดียว) ------------------------------------
create table if not exists public.solutions (
  type   text primary key,          -- network | system | hardware | other
  icon   text not null,
  title  text not null,
  sub    text not null,
  causes text[] not null,           -- สาเหตุที่เป็นไปได้
  note   text not null,             -- หมายเหตุระดับความเสี่ยง
  tips   text[] not null,           -- คำแนะนำเบื้องต้น
  steps  text[] not null            -- วิธีแก้ทีละขั้นตอน
);

-- 2) ตารางบทความแนะนำ (อ่านอย่างเดียว) --------------------------------------
create table if not exists public.articles (
  id         bigint generated always as identity primary key,
  title      text not null,
  type       text not null references public.solutions(type),
  sort_order int  not null default 0
);

-- 3) ตารางประวัติการวิเคราะห์ (ของแต่ละผู้ใช้) --------------------------------
create table if not exists public.analysis_history (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  mode       text not null,
  device     text not null,
  type       text not null references public.solutions(type),
  severity   text not null check (severity in ('low', 'mid', 'high')),
  detail     text not null default '',
  created_at timestamptz not null default now()
);

-- เพิ่มคอลัมน์ note (บันทึกของผู้ใช้ แก้ไขได้) และ image_path (รูปที่แนบ)
alter table public.analysis_history add column if not exists note       text not null default '';
alter table public.analysis_history add column if not exists image_path text;

-- ที่เก็บรูปภาพ (Supabase Storage) แบบ private: ไฟล์อยู่ในโฟลเดอร์ตาม user id ของเจ้าของ
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false)
on conflict (id) do nothing;

drop policy if exists "screenshots: insert own" on storage.objects;
create policy "screenshots: insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "screenshots: read own" on storage.objects;
create policy "screenshots: read own" on storage.objects for select to authenticated
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "screenshots: delete own" on storage.objects;
create policy "screenshots: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

-- 4) Row Level Security: กำหนดว่าใครอ่าน/เขียนอะไรได้ -------------------------
alter table public.solutions        enable row level security;
alter table public.articles         enable row level security;
alter table public.analysis_history enable row level security;

drop policy if exists "solutions: read when logged in" on public.solutions;
create policy "solutions: read when logged in"
  on public.solutions for select to authenticated using (true);

drop policy if exists "articles: read when logged in" on public.articles;
create policy "articles: read when logged in"
  on public.articles for select to authenticated using (true);

drop policy if exists "history: read own" on public.analysis_history;
create policy "history: read own"
  on public.analysis_history for select to authenticated using (auth.uid() = user_id);

drop policy if exists "history: insert own" on public.analysis_history;
create policy "history: insert own"
  on public.analysis_history for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "history: update own" on public.analysis_history;
create policy "history: update own"
  on public.analysis_history for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "history: delete own" on public.analysis_history;
create policy "history: delete own"
  on public.analysis_history for delete to authenticated using (auth.uid() = user_id);

-- 5) ข้อมูลเริ่มต้น -------------------------------------------------------------
insert into public.solutions (type, icon, title, sub, causes, note, tips, steps) values
  ('network', '📶', 'Wi-Fi ต่อไม่ได้', 'ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้',
   array['ไดรเวอร์เครือข่ายมีปัญหา', 'การตั้งค่าเครือข่ายไม่ถูกต้อง', 'สัญญาณ Wi-Fi อ่อน', 'บริการเครือข่ายถูกปิดใช้งาน'],
   'เป็นปัญหาที่พบบ่อย สามารถแก้ไขได้ด้วยตัวเอง',
   array['ตรวจสอบว่าไม่ได้เปิดโหมด Airplane Mode ทิ้งไว้', 'ลองปิดเราเตอร์ Wi-Fi รอ 10 วินาที แล้วเปิดใหม่อีกครั้ง', 'ลบชื่อ Wi-Fi เดิมออก (Forget Network) แล้วลองเชื่อมต่อใหม่'],
   array['ปิดโหมด Airplane Mode แล้วเปิด Wi-Fi ใหม่', 'รีสตาร์ทเราเตอร์ (ถอดปลั๊ก 10 วินาที)', 'กด Forget Network แล้วเชื่อมต่อใหม่', 'อัปเดตหรือติดตั้งไดรเวอร์ Wi-Fi ใหม่', 'รีเซ็ตการตั้งค่าเครือข่าย (Network Reset)']),
  ('system', '💻', 'เครื่องช้า / โปรแกรมค้าง', 'ระบบตอบสนองช้าหรือโปรแกรมไม่ตอบสนอง',
   array['โปรแกรมทำงานเบื้องหลังมากเกินไป', 'หน่วยความจำ (RAM) ไม่เพียงพอ', 'พื้นที่ดิสก์เหลือน้อย', 'มีไวรัสหรือมัลแวร์'],
   'ส่วนใหญ่แก้ไขได้โดยการจัดการโปรแกรมและพื้นที่เก็บข้อมูล',
   array['ปิดโปรแกรมที่ไม่ได้ใช้งานผ่าน Task Manager', 'ลบไฟล์ขยะและถอนการติดตั้งโปรแกรมที่ไม่จำเป็น', 'รีสตาร์ทเครื่องแล้วลองใหม่อีกครั้ง'],
   array['เปิด Task Manager (Ctrl + Shift + Esc)', 'ปิดโปรแกรมที่ใช้ CPU/RAM สูงโดยไม่จำเป็น', 'ล้างไฟล์ชั่วคราวด้วย Disk Cleanup', 'สแกนไวรัสด้วย Windows Security', 'รีสตาร์ทเครื่อง']),
  ('hardware', '🖥️', 'ฮาร์ดแวร์ผิดปกติ', 'อุปกรณ์ไม่ทำงานหรือทำงานผิดปกติ',
   array['สายเชื่อมต่อหลวมหรือชำรุด', 'อุปกรณ์ร้อนเกินไป', 'แหล่งจ่ายไฟมีปัญหา', 'อุปกรณ์เสื่อมสภาพ'],
   'ควรตรวจสอบเบื้องต้นก่อน หากไม่หายให้ติดต่อช่างผู้เชี่ยวชาญ',
   array['ตรวจสอบสายไฟและสายเชื่อมต่อทุกเส้น', 'ถอดอุปกรณ์แล้วเสียบใหม่', 'ทดลองใช้พอร์ตหรืออุปกรณ์อื่นเพื่อเปรียบเทียบ'],
   array['ปิดเครื่องและถอดปลั๊ก', 'ตรวจสอบสายเชื่อมต่อและพอร์ต', 'เสียบอุปกรณ์ใหม่อีกครั้ง', 'ทดสอบกับพอร์ต/อุปกรณ์อื่น', 'หากยังไม่หาย ติดต่อศูนย์บริการ']),
  ('other', '🛠️', 'ปัญหาทั่วไป / Error', 'พบข้อความ Error หรือปัญหาที่ไม่ระบุประเภท',
   array['ซอฟต์แวร์เวอร์ชันเก่าหรือไม่เข้ากัน', 'ไฟล์ระบบเสียหาย', 'การตั้งค่าไม่ถูกต้อง', 'ข้อผิดพลาดชั่วคราวของระบบ'],
   'ลองค้นหาข้อความ Error เพื่อหาวิธีแก้ที่ตรงจุด',
   array['จดหรือแคปหน้าจอข้อความ Error ไว้', 'อัปเดตซอฟต์แวร์เป็นเวอร์ชันล่าสุด', 'รีสตาร์ทโปรแกรมหรือเครื่อง'],
   array['บันทึกรหัสและข้อความ Error', 'ค้นหารหัส Error ในแอป FixMate', 'อัปเดตโปรแกรม/ระบบปฏิบัติการ', 'ติดตั้งโปรแกรมที่มีปัญหาใหม่', 'รีสตาร์ทเครื่อง'])
on conflict (type) do update set
  icon = excluded.icon, title = excluded.title, sub = excluded.sub,
  causes = excluded.causes, note = excluded.note, tips = excluded.tips, steps = excluded.steps;

delete from public.articles;
insert into public.articles (title, type, sort_order) values
  ('แก้ Wi-Fi ต่อไม่ได้ (Windows 11)', 'network', 1),
  ('คอมพิวเตอร์ช้า ทำอย่างไร?', 'system', 2),
  ('วิธีแก้ Error ยอดนิยม', 'other', 3);
