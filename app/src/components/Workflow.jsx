import { useState } from 'react'
import PageIntro from './PageIntro'

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

export default function Workflow() {
  const [completed, setCompleted] = useState(new Set())
  const [expandedId, setExpandedId] = useState(null)

  const toggle = (id) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const progress = Math.round((completed.size / 22) * 100)
  const totalMinutes = SKILLS_DATA.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div>
      <PageIntro
        title="Workflow יומי"
        subtitle="22 מיומנויות מ-06:00 עד 01:00"
        purpose="זהו סדר היום שלך לפי 22 האותיות — כל אות מייצגת מיומנות אחת בזמן מסוים ביום. מפתיחת הבוקר ועד הכנה לשינה, כל רגע ביום מקבל משמעות וכוונה."
        howToUse="סמני V ליד כל מיומנות שהשלמת. לחצי על שורה כדי לראות פרטים נוספים. שימי לב — לא חובה לעשות הכל! בחרי 3-5 מיומנויות ביום ובני עליהן."
        example={`לדוגמה: התחילי עם א׳ (5 דקות נשימה ב-06:00), ג׳ (5 דקות הנאה ב-08:00), וס׳ (10 דקות סיכום ב-20:00) — 3 תרגולים קטנים שמשנים את היום.`}
        tip={`סה"כ ${totalMinutes} דקות (${Math.round(totalMinutes / 60)} שעות) אם עושים הכל. אבל אפילו 20 דקות ביום של 3 מיומנויות נבחרות = שינוי אמיתי.`}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text dark:text-dark-text">התקדמות היום</h3>
        </div>
        <div className="text-left">
          <span className="text-4xl font-bold text-accent dark:text-accent-light">{progress}%</span>
          <p className="text-sm text-text-tertiary dark:text-gray-500">{completed.size}/22 הושלמו</p>
        </div>
      </div>

      <div className="w-full bg-surface dark:bg-dark-surface h-3 mb-8">
        <div
          className="bg-accent dark:bg-accent-light h-3 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {SKILLS_DATA.map(skill => {
          const isDone = completed.has(skill.id)
          const isExpanded = expandedId === skill.id
          return (
            <div
              key={skill.id}
              className={`
                border transition-all duration-200
                ${isDone
                  ? 'border-success/40 bg-success/5 dark:border-success/30 dark:bg-success/10'
                  : 'border-border dark:border-dark-border'
                }
              `}
            >
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => toggle(skill.id)}
                  className={`
                    w-7 h-7 border-2 flex items-center justify-center shrink-0 transition-colors text-sm
                    ${isDone
                      ? 'bg-success border-success text-white'
                      : 'border-border dark:border-dark-border hover:border-accent dark:hover:border-accent-light'
                    }
                  `}
                >
                  {isDone && '✓'}
                </button>

                <span className="text-3xl shrink-0">{skill.char}</span>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : skill.id)}
                  className="flex-1 text-right"
                >
                  <span className={`text-base font-medium ${isDone ? 'line-through text-text-tertiary dark:text-gray-600' : 'text-text dark:text-dark-text'}`}>
                    {skill.name}
                  </span>
                  <span className="text-sm text-text-tertiary dark:text-gray-500 block">{skill.time}</span>
                </button>

                <span className="text-sm text-text-tertiary dark:text-gray-500 shrink-0 bg-surface dark:bg-dark-bg px-2 py-1">{skill.duration} דק׳</span>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pr-14 text-base text-text-secondary dark:text-gray-400 border-t border-border/50 dark:border-dark-border/50 pt-3">
                  <p><span className="font-bold text-text dark:text-dark-text">פעולה:</span> {skill.action}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
