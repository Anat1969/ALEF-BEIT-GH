import { useState } from 'react'
import PageIntro from './PageIntro'
import SKILLS_DATA from '../data/dailySkills'


export default function Workflow() {
  // Progress is per day and survives a refresh.
  const todayKey = `workflow-${new Date().toLocaleDateString('en-CA')}`
  const [completed, setCompleted] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(todayKey) || '[]')) } catch { return new Set() }
  })
  const [savedAt, setSavedAt] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const toggle = (id) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(todayKey, JSON.stringify([...next]))
      setSavedAt(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }))
      return next
    })
  }

  const progress = Math.round((completed.size / 22) * 100)
  const totalMinutes = SKILLS_DATA.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div>
      <PageIntro
        title="מיומנות לכל שעה ביום"
        subtitle="22 מיומנויות מ-06:00 עד 01:00"
        insight="**22 מיומנויות** מהבוקר עד הלילה."
        explain="כל אות היא תרגול קצר בשעה קבועה. לא חובה הכל: **3 עד 5** ביום מספיקות."
        howToUse="סימון ליד מיומנות שהושלמה נשמר מיד. לחיצה על שורה פותחת פרטים."
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
          <p className="text-xs font-mono text-gray-500" role="status">{savedAt ? `נשמר ${savedAt}` : 'נשמר אוטומטית בדפדפן, ומתאפס בכל יום חדש'}</p>
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
                  aria-pressed={isDone}
                  aria-label={`סימון ${skill.name} כהושלם`}
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
