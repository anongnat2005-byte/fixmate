// API ภายนอก: Stack Exchange API (เว็บถามตอบ SuperUser เรื่องคอมพิวเตอร์)
// เอกสาร: https://api.stackexchange.com/docs/advanced-search
// ใช้ฟรี ไม่ต้องมี API key (จำกัดประมาณ 300 ครั้ง/วัน ต่อ IP)
// เรียกด้วย HTTP GET แล้วได้ข้อมูล JSON กลับมา

// ผลลัพธ์จาก API มีอักขระ HTML เช่น &#39; ต้องแปลงกลับเป็นตัวอักษรปกติ
function decodeHtml(text) {
  return String(text)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export async function searchSuperUser(query) {
  const url =
    'https://api.stackexchange.com/2.3/search/advanced' +
    `?order=desc&sort=relevance&site=superuser&pagesize=10&q=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`เรียก API ไม่สำเร็จ (HTTP ${res.status})`);
  const json = await res.json();

  return (json.items || []).map((i) => ({
    id: i.question_id,
    title: decodeHtml(i.title),
    link: i.link,
    score: i.score,
    answers: i.answer_count,
    answered: i.is_answered,
  }));
}
