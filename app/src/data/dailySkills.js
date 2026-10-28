// The daily practice: one letter per hour, 06:00 to 01:00.
// Each slot turns the letter's force into three steps:
// think (the question to hold), action (the deed) and note (what to write down after).
const SKILLS_DATA = [
  { id: 1, char: 'א', name: 'פתיחה באחד', time: '06:00–07:00', think: 'מה אחד שאני רוצה לחבר היום?', action: 'שלוש נשימות, ושלוש כוונות בכתב', note: 'הכוונה החשובה מבין השלוש', duration: 5 },
  { id: 2, char: 'ב', name: 'בניית הבית', time: '07:00–08:00', think: 'מה צריך להיות סגור היום, ומה פתוח?', action: 'לכתוב דבר אחד שלא עושים היום', note: 'מה נשמר בזכות הגבול', duration: 5 },
  { id: 3, char: 'ג', name: 'נתינה ראשונה', time: '08:00–09:00', think: 'למי אפשר לתת, לפני שביקשו?', action: 'מעשה נתינה קטן אחד, בצנעה', note: 'למי נתתי, ואיך הרגשתי', duration: 5 },
  { id: 4, char: 'ד', name: 'חציית הסף', time: '09:00–10:00', think: 'איזו דאגה עומדת בדלת?', action: 'לכתוב את הדאגה ואת הצעד הבא, ולעשות אותו', note: 'הצעד שעשיתי', duration: 15 },
  { id: 5, char: 'ה', name: 'גילוי', time: '10:00–11:00', think: 'על מה אני מודה הבוקר?', action: 'תודה אחת מפורשת, בשם ובפירוט', note: 'למי הודיתי, ועל מה', duration: 10 },
  { id: 6, char: 'ו', name: 'חיבור', time: '11:00–12:00', think: 'את מי כדאי לחבר למי?', action: 'הודעה אחת שמחברת שני אנשים', note: 'מי חובר, ולמה', duration: 10 },
  { id: 7, char: 'ז', name: 'עצירה', time: '12:00–13:00', think: 'בשביל מה אני עושה את מה שאני עושה?', action: 'שבע דקות בלי מסך, ושבע נשימות לפני כל תגובה', note: 'מה נזכרתי בעצירה', duration: 7 },
  { id: 8, char: 'ח', name: 'כיוון החיים', time: '13:00–14:00', think: 'האם הבחירות שלי מכוונות למטרה?', action: 'לבדוק בחירה אחת מול המטרה, ולתקן כיוון', note: 'מה תיקנתי', duration: 10 },
  { id: 9, char: 'ט', name: 'הטוב הנסתר', time: '14:00–15:00', think: 'איפה יש טוב שעוד לא נראה?', action: 'לשחרר טינה אחת, במשפט כתוב', note: 'הטוב שמצאתי', duration: 10 },
  { id: 10, char: 'י', name: 'הנקודה', time: '15:00–16:00', think: 'מה הצעד הקטן ביותר שמזיז משהו?', action: 'שתי דקות של הרגל אחד', note: 'כמה ימים ברצף', duration: 5 },
  { id: 11, char: 'כ', name: 'כף פתוחה', time: '16:00–17:00', think: 'מה מונח בכף היד שלי עכשיו?', action: 'לתת זמן, עזרה או כבוד. כשעולה כעס: לפתוח את היד ולנשום', note: 'מה נתתי', duration: 10 },
  { id: 12, char: 'ל', name: 'למידה', time: '17:00–18:00', think: 'מה אני רוצה להבין, שעוד לא הבנתי?', action: 'ללמוד מושג אחד, ולהסביר אותו למישהו', note: 'המושג, במשפט אחד שלי', duration: 30 },
  { id: 13, char: 'מ', name: 'זרימה', time: '18:00–19:00', think: 'מה נתקע אצלי ולא זורם?', action: 'לסגור לולאה פתוחה אחת, או למחול על עלבון אחד', note: 'מה שחררתי', duration: 15 },
  { id: 14, char: 'נ', name: 'נאמנות', time: '19:00–20:00', think: 'למה אני נאמנה, גם כשקשה?', action: 'לוותר בעניין קטן, ולהתמיד בעניין חשוב', note: 'במה התמדתי', duration: 15 },
  { id: 15, char: 'ס', name: 'תמיכה', time: '20:00–21:00', think: 'מי צריך עכשיו כתף?', action: 'שיחה או הודעה אחת של תמיכה', note: 'את מי תמכתי', duration: 10 },
  { id: 16, char: 'ע', name: 'מבט', time: '21:00–22:00', think: 'מה ראיתי היום בעין טובה?', action: 'שלושה דברים טובים שראיתי באדם אחד', note: 'השלושה, בכתב', duration: 10 },
  { id: 17, char: 'פ', name: 'מילה', time: '22:00–22:30', think: 'איזו מילה צריכה להיאמר, ועל מה לשתוק?', action: 'משפט אחד של פיוס או הכרה, בקול', note: 'מה אמרתי', duration: 10 },
  { id: 18, char: 'צ', name: 'יושר', time: '22:30–23:00', think: 'האם היום שלי היה הוגן כלפי כולם?', action: 'לתקן דבר אחד שלא היה הוגן', note: 'מה תיקנתי', duration: 10 },
  { id: 19, char: 'ק', name: 'הקדשה', time: '23:00–23:30', think: 'למה הקדשתי את היום?', action: 'עשר דקות שקט, למשהו שאיש לא רואה', note: 'למה הקדשתי', duration: 10 },
  { id: 20, char: 'ר', name: 'ראש למחר', time: '23:30–24:00', think: 'לאן אני מובילה מחר, ואת מי?', action: 'שלושה דברים למחר, לפי סדר חשיבות', note: 'הדבר הראשון למחר', duration: 10 },
  { id: 21, char: 'ש', name: 'שינוי', time: '00:00–00:30', think: 'מה אני מוכנה לפרק, כדי לבנות מחדש?', action: 'לבחור הרגל אחד לשינוי, ולכתוב את הצעד הראשון', note: 'הצעד הראשון', duration: 10 },
  { id: 22, char: 'ת', name: 'חותם', time: '00:30–01:00', think: 'מה אני חותמת היום?', action: 'שלוש שורות: מה הושלם, מה נלמד, ומה מתחיל מחר', note: 'שלוש השורות', duration: 10 },
]

// The day runs 06:00 to 01:00, so minutes after midnight count as the end of the previous day.
function dayMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const t = h * 60 + m
  return t < 6 * 60 ? t + 24 * 60 : t
}

// The slot of this hour, or the first slot of the day when it is night.
export function currentSkill(now = new Date()) {
  const t = dayMinutes(`${now.getHours()}:${now.getMinutes()}`)
  const slots = SKILLS_DATA.map((s) => {
    const [from, to] = s.time.split('–')
    return { ...s, from: dayMinutes(from), to: dayMinutes(to) }
  })
  const active = slots.find((s) => t >= s.from && t < s.to)
  if (active) return { skill: active, state: 'now' }
  return { skill: slots[0], state: 'next' }
}

export default SKILLS_DATA
