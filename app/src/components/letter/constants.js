export const DIMENSION_CATEGORIES = [
  {
    id: 'senses',
    title: 'חושים',
    dims: [
      { key: 'sonic', label: 'שמיעה — הקול' },
      { key: 'visual', label: 'ראייה — המראה' },
      { key: 'tactile', label: 'מגע — התחושה' },
    ],
  },
  {
    id: 'sciences',
    title: 'מדעים',
    dims: [
      { key: 'mathematical', label: 'מתמטיקה — המספר' },
      { key: 'physics', label: 'פיזיקה — החוק' },
    ],
  },
  {
    id: 'body_soul',
    title: 'גוף ונפש',
    dims: [
      { key: 'physical', label: 'גוף — התנועה' },
      { key: 'psychological', label: 'נפש — הרגש' },
    ],
  },
  {
    id: 'space_time',
    title: 'מרחב וזמן',
    dims: [
      { key: 'spatial', label: 'מרחב — המקום' },
      { key: 'temporal', label: 'זמן — הרגע' },
    ],
  },
]

export const SECTIONS = [
  { id: 'knowing', label: 'הכוח, ידע ויישום' },
  { id: 'overview', label: 'סקירה' },
  { id: 'relationships', label: 'קשרים' },
  { id: 'words', label: 'שפה' },
  { id: 'skill', label: 'מיומנות' },
  { id: 'space', label: 'מודל מרחבי' },
  { id: 'prompt', label: 'אדריכלות' },
  { id: 'dimensions', label: 'מחקר חושי' },
  { id: 'article', label: 'מאמר' },
]

export const LANGUAGE_TABS = [
  { id: 'roots', label: 'שורשים' },
  { id: 'actions', label: 'פעולות' },
  { id: 'objects', label: 'חפצים ומושגים' },
]

export const RELATIONSHIP_TYPES = [
  { type: 'opposite', label: 'מנוגדת', color: 'danger', desc: 'אותיות בקוטב הנגדי — כוחות מאזנים' },
  { type: 'complementary', label: 'משלימה', color: 'info', desc: 'אותיות שמשלימות זו את זו — חיבור הדדי' },
  { type: 'reinforces', label: 'מחזקת', color: 'warning', desc: 'אותיות שמגבירות את הכוח — תהודה' },
  { type: 'sequential', label: 'רצף', color: 'accent', desc: 'אותיות שכנות באלף-בית — זרימה טבעית' },
  { type: 'mirror', label: 'מראה', color: 'info', desc: 'אותיות שמשקפות זו את זו — היפוך צורני או משמעותי' },
]
