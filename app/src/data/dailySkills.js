// The daily practice: one skill per letter, 06:00 to 01:00.
const SKILLS_DATA = [
  { id: 1, char: 'א', name: 'פתיחת היום', time: '06:00–07:00', action: 'נשימה × 3 + 3 כוונות', duration: 5 },
  { id: 2, char: 'ב', name: 'בחירה בדואל', time: '07:00–08:00', action: 'רשום שתי תוצאות אפשריות, בחר', duration: 10 },
  { id: 3, char: 'ג', name: 'גמול העמל', time: '08:00–09:00', action: 'אחרי משימה — עצור, הנה לעצמך', duration: 5 },
  { id: 4, char: 'ד', name: 'סף הבא', time: '09:00–10:00', action: 'פתח חלון חדש של המחשבה', duration: 15 },
  { id: 5, char: 'ה', name: 'הגלוי', time: '10:00–11:00', action: 'כתוב / דבר בקול / הפוך לגלוי', duration: 10 },
  { id: 6, char: 'ו', name: 'חיבור', time: '11:00–12:00', action: 'חבר דבר אחד לשני', duration: 15 },
  { id: 7, char: 'ז', name: 'כלי החדה', time: '12:00–13:00', action: 'משימה חדה בשעה הטובה', duration: 60 },
  { id: 8, char: 'ח', name: 'גדר, מגן', time: '13:00–14:00', action: 'הגן על עצמך, קבע גבול', duration: 10 },
  { id: 9, char: 'ט', name: 'יצירה מקדית', time: '14:00–15:00', action: 'בנה משהו ללא תוכנית', duration: 30 },
  { id: 10, char: 'י', name: 'יד המעשה', time: '15:00–16:00', action: 'עשה בידיים — תקן, בנה', duration: 60 },
  { id: 11, char: 'כ', name: 'כף היד', time: '16:00–17:00', action: 'תן משהו — כסף, זמן, תמיכה', duration: 10 },
  { id: 12, char: 'ל', name: 'למידה', time: '17:00–18:00', action: 'קרא, שמע, חקור', duration: 30 },
  { id: 13, char: 'מ', name: 'מעמקה', time: '18:00–19:00', action: 'מדיטציה, חשיבה אחורית', duration: 15 },
  { id: 14, char: 'נ', name: 'תנועה, משחק', time: '19:00–20:00', action: 'זז ללא תוכנית — הליכה, רקידה', duration: 30 },
  { id: 15, char: 'ס', name: 'סיום סדרה', time: '20:00–21:00', action: 'סכום את היום — 3 דברים', duration: 10 },
  { id: 16, char: 'ע', name: 'ראיה / בדיקה', time: '21:00–22:00', action: 'איך אתה מרגיש? מה השתנה?', duration: 10 },
  { id: 17, char: 'פ', name: 'דיבור / ביטוי', time: '22:00–22:30', action: 'ספר למישהו משהו', duration: 10 },
  { id: 18, char: 'צ', name: 'צדק / היישור', time: '22:30–23:00', action: 'תקן משהו שלא בסדר', duration: 10 },
  { id: 19, char: 'ק', name: 'חשיבה קריטית', time: '23:00–23:30', action: 'מה הייתי יכול לעשות אחרת?', duration: 10 },
  { id: 20, char: 'ר', name: 'ריאות תודעה', time: '23:30–24:00', action: 'תוכנן למחר, תמונה גדולה', duration: 15 },
  { id: 21, char: 'ש', name: 'שינוי / קול חדש', time: '00:00–00:30', action: 'רגע של היעדר תוכנית', duration: 30 },
  { id: 22, char: 'ת', name: 'סוף יום', time: '00:30–01:00', action: 'הכנה לשינה — רגיעה', duration: 30 },
]

export default SKILLS_DATA
