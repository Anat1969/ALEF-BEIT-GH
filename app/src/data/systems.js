// Relationship systems between letters. Every relationship is computed from a
// known rule with a source, never typed by hand. Each system has three layers:
// rule (fact), meaning (interpretation, marked as such) and action (what to do).

export const ORDER = 'אבגדהוזחטיכלמנסעפצקרשת'.split('')

const MOUTH = [
  { id: 'throat', label: 'גרון', letters: 'אחהע' },
  { id: 'palate', label: 'חך', letters: 'גיכק' },
  { id: 'tongue', label: 'לשון', letters: 'דטלנת' },
  { id: 'teeth', label: 'שיניים', letters: 'זסשרצ' },
  { id: 'lips', label: 'שפתיים', letters: 'בומפ' },
]

const CLASSES = [
  { id: 'mothers', label: '3 אמות', letters: 'אמש', note: 'אוויר, מים ואש' },
  { id: 'doubles', label: '7 כפולות', letters: 'בגדכפרת', note: 'לכל אחת היו שתי הגיות' },
  { id: 'simple', label: '12 פשוטות', letters: 'הוזחטילנסעצק', note: 'הגייה אחת' },
]

const FINALS = [
  { id: 'kaf', label: 'כ / ך', letters: 'כ' },
  { id: 'mem', label: 'מ / ם', letters: 'מ' },
  { id: 'nun', label: 'נ / ן', letters: 'נ' },
  { id: 'pe', label: 'פ / ף', letters: 'פ' },
  { id: 'tsade', label: 'צ / ץ', letters: 'צ' },
]

const GEMATRIA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400]
export const gematriaOf = (ch) => GEMATRIA[ORDER.indexOf(ch)]
const smallNumber = (n) => Number(String(n).replace(/0+$/, ''))

// What each mirror pair teaches together. Where the two letters form a word, it is named.
const ATBASH_PAIRS = [
  { word: 'את', insight: 'הראשונה והאחרונה יוצרות את המילה **את**. "את השמים ואת הארץ": במסורת, רמז לכל האותיות מא׳ עד ת׳. התחלה טובה כבר יודעת איך תיחתם.' },
  { word: 'שלום בית', insight: 'בית (ב) ואש (ש): **שלום בית**. אותה אש בבית מחממת, או שורפת.' },
  { word: 'גר', insight: 'נתינה (ג) וראש (ר) יוצרות **גר**. "ואהבתם את הגר" (דברים י, יט): הנהגה נבחנת ביחס לזר.' },
  { word: 'דק', insight: 'סף (ד) וקדושה (ק) יוצרות **דק**. "קול דממה דקה" (מלכים א יט, יב): הקדושה עוברת בסף בקול השקט ביותר.' },
  { word: '', insight: 'גילוי (ה) וצדק (צ): **פתיחות צריכה צדק**, אחרת היא הפקרות.' },
  { word: '', insight: 'חיבור (ו) ודיבור (פ): **המילה היא הוו הגדול** ביותר בין אנשים. היא מחברת, או קורעת.' },
  { word: 'זע', insight: 'זמן (ז) ומבט (ע): **מה שמביטים בו, אותו זוכרים**. הזיכרון נבנה מתשומת לב.' },
  { word: 'חס', insight: 'חיים (ח) ותמיכה (ס) יוצרות **חס**, חמלה: חיים שתומכים במי שנופל.' },
  { word: '', insight: 'הטוב הנסתר (ט) והנאמנות (נ): **נאמנות היא להמשיך להאמין בטוב** שעוד לא נראה.' },
  { word: 'ים', insight: 'נקודה (י) ומים (מ) יוצרות **ים**: כל ים עשוי טיפות, נקודה אחרי נקודה.' },
  { word: 'כל', insight: 'זוג האמצע, כף (כ) ולימוד (ל), יוצר **כל**. כאן כל המראות נפגשות.' },
]

const atbashGroups = ORDER.slice(0, 11).map((ch, i) => ({
  id: `atbash-${i}`,
  label: `${ch} מול ${ORDER[21 - i]}${ATBASH_PAIRS[i].word ? ` · ${ATBASH_PAIRS[i].word}` : ''}`,
  letters: ch + ORDER[21 - i],
  insight: ATBASH_PAIRS[i].insight,
}))

const smallGroups = Array.from({ length: 9 }, (_, i) => {
  const d = i + 1
  return {
    id: `small-${d}`,
    label: `${d}`,
    letters: ORDER.filter((ch) => smallNumber(gematriaOf(ch)) === d).join(''),
  }
})

export const SYSTEMS = [
  {
    id: 'atbash',
    name: 'מראה: א״ת ב״ש',
    rule: 'הראשונה מול האחרונה, השנייה מול הלפני אחרונה, וכן הלאה: **11 זוגות**.',
    source: 'צופן עתיק שמופיע בתנ״ך: "ומלך ששך" (ירמיהו כה, כו) הוא מלך בבל: ב׳ מתחלפת ב-ש׳, ול׳ ב-כ׳.',
    meaning: 'כל זוג הוא **שני קצוות של ציר אחד**: התחלה וסוף, בית ואש, נקודה ומים.',
    action: 'כשעובדים עם אות, שואלים מה **הקצה השני** שלה. למשל א׳ (פתיחה) ות׳ (חותם): לפני שפותחים משימה, קובעים איך יידעו שהיא נגמרה.',
    why: 'למה דווקא הפוך? ההיפוך הוא **קריאה מהקצוות אל המרכז**. כל זוג נמצא באותו מרחק מההתחלה ומהסוף, וכל הזוגות מתכנסים לאמצע, אל **כ־ל**, שיוצרות את המילה **כל**. התובנה: לכל כוח יש קצה נגדי שמשלים אותו, ורק יחד הם השלם.',
    groups: atbashGroups,
  },
  {
    id: 'small',
    name: 'אותו מספר בשלושה גדלים',
    rule: 'מוחקים את האפסים מהגימטריה: **א׳ = 1, י׳ = 10, ק׳ = 100**, וכולן שוות 1.',
    source: 'שיטת "מספר קטן" בגימטריה המסורתית.',
    meaning: '**אותו רעיון בשלושה קני מידה**: יחידה, עשרות ומאות. כמו חדר, בניין ושכונה.',
    action: 'לוקחים עיקרון של אות אחת ומפעילים אותו בשלושה גדלים: **אצלי, בצוות, ובעיר**. למשל ב׳ (בית): פינה שלי, משרד, שכונה.',
    groups: smallGroups,
  },
  {
    id: 'mouth',
    name: 'מאיפה בפה',
    rule: '**חמש קבוצות** לפי המקום שבו האות נוצרת: גרון, חך, לשון, שיניים ושפתיים.',
    source: 'ספר יצירה, פרק ב: אחה״ע, גיכ״ק, דטלנ״ת, זסשר״ץ, בומ״ף.',
    meaning: 'אותיות **אחיות בגוף** מתחלפות זו בזו בשורשים: עלז, עלס ועלץ פירושן אחד, שמחה.',
    action: 'אומרים בקול את אותיות הקבוצה ומרגישים איפה בפה הן נוגעות. כך **שם האות נהיה תחושה**.',
    groups: MOUTH,
  },
  {
    id: 'classes',
    name: 'שלוש, שבע, שתים עשרה',
    rule: '**3 אמות** (אמ״ש), **7 כפולות** (בג״ד כפר״ת) ו-**12 פשוטות**.',
    source: 'ספר יצירה, פרקים א עד ה.',
    meaning: 'הכפולות היו בעלות **שתי הגיות**. היום נשארו שלוש: בּ/ב, כּ/כ, פּ/פ. אות עם שני מצבים, כמו מרחב ביום ובלילה.',
    action: 'מזהים בכל פרויקט את שלוש האמות: מה **האוויר** (המרחב), מה **המים** (הזרימה) ומה **האש** (האנרגיה).',
    groups: CLASSES,
  },
  {
    id: 'finals',
    name: 'בדרך ובסוף',
    rule: '**5 אותיות** משנות צורה בסוף מילה: ך ם ן ף ץ.',
    source: 'שבת קד ע״א: "נו״ן כפופה ונו״ן פשוטה... צד״י כפופה וצד״י פשוטה".',
    meaning: 'אותה אות **בתהליך ובסיום** נראית אחרת: נ׳ כפופה בדרך, ן זקופה בסוף.',
    action: 'בכל משימה מבחינים בין **צורת הדרך** (גמישה) לבין **צורת הסיום** (ישרה וברורה).',
    groups: FINALS,
  },
]

// Every relationship of one letter, across all systems.
export function relationsOf(ch) {
  return SYSTEMS.map((system) => {
    const group = system.groups.find((g) => g.letters.includes(ch))
    const partners = group ? group.letters.split('').filter((c) => c !== ch) : []
    return { system, group, partners }
  }).filter((r) => r.group)
}
