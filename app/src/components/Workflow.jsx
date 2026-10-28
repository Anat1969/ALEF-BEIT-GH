import { useState } from 'react'
import PageIntro from './PageIntro'
import SKILLS_DATA, { currentSkill } from '../data/dailySkills'
import POWER from '../data/letterPower'

// One letter per hour. Each hour is a small loop: a thought to hold, a deed to do,
// and a line to write down. Progress and journal are saved per day.
const todayStamp = () => new Date().toLocaleDateString('en-CA')

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback } catch { return fallback }
}

export default function Workflow() {
  const day = todayStamp()
  const doneKey = `workflow-${day}`
  const journalKey = `journal-${day}`
  const [completed, setCompleted] = useState(() => new Set(readJSON(doneKey, [])))
  const [journal, setJournal] = useState(() => readJSON(journalKey, {}))
  const [savedAt, setSavedAt] = useState(null)
  const [openId, setOpenId] = useState(null)
  const { skill: now, state } = currentSkill()

  const stamp = () => setSavedAt(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }))

  const toggle = (id) => {
    const next = new Set(completed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setCompleted(next)
    localStorage.setItem(doneKey, JSON.stringify([...next]))
    stamp()
  }

  const write = (id, text) => {
    const next = { ...journal, [id]: text }
    setJournal(next)
    localStorage.setItem(journalKey, JSON.stringify(next))
    stamp()
  }

  const progress = Math.round((completed.size / 22) * 100)
  const written = Object.values(journal).filter((t) => t?.trim()).length

  return (
    <div>
      <PageIntro
        title="מיומנות לכל שעה ביום"
        subtitle="22 אותיות, מ-06:00 עד 01:00"
        insight="כל שעה: **מחשבה**, **מעשה**, **רישום**."
        explain="המחשבה מכוונת, המעשה מפעיל את הכוח של האות, והרישום הופך אותו לזיכרון."
        howToUse="לא חובה הכל: בוחרים **3 עד 5** שעות. מסמנים מה בוצע, ורושמים שורה אחת. הכל נשמר בדפדפן, לכל יום בנפרד."
        tip={state === 'now' ? `עכשיו ${now.time}: ${now.char}׳, ${now.name}.` : `היום מתחיל ב-06:00 עם א׳.`}
      />

      <div className="day-progress">
        <div>
          <span className="label">התקדמות היום</span>
          <span className="result-value">{completed.size}<small>/22</small></span>
        </div>
        <div>
          <span className="label">שורות ביומן</span>
          <span className="result-value">{written}<small>/22</small></span>
        </div>
        <p className="day-saved" role="status">{savedAt ? `נשמר ${savedAt}` : 'נשמר אוטומטית בדפדפן, ומתחיל מחדש בכל יום'}</p>
        <div className="result-bar day-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="התקדמות היום">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ol className="day-list">
        {SKILLS_DATA.map((skill) => {
          const power = POWER[skill.char]
          const isDone = completed.has(skill.id)
          const isNow = state === 'now' && now.id === skill.id
          const isOpen = openId === skill.id || isNow
          return (
            <li key={skill.id} className={`day-row ${isDone ? 'is-done' : ''} ${isNow ? 'is-now' : ''}`}>
              <div className="day-head">
                <button
                  className={`day-check ${isDone ? 'is-on' : ''}`}
                  onClick={() => toggle(skill.id)}
                  aria-pressed={isDone}
                  aria-label={`סימון ${skill.name} כהושלם`}
                >
                  {isDone ? 'בוצע' : 'לסמן'}
                </button>
                <span className="day-glyph">{skill.char}</span>
                <div className="day-title">
                  <span className="day-name">{skill.name}</span>
                  <span className="day-meta">{skill.time} · {skill.duration} דקות · {power?.power}</span>
                </div>
                {isNow && <span className="day-now">עכשיו</span>}
              </div>

              <div className="day-steps">
                <div><span className="label">מחשבה</span><p>{skill.think}</p></div>
                <div><span className="label">מעשה</span><p>{skill.action}</p></div>
                <div><span className="label">רושמים</span><p>{skill.note}</p></div>
              </div>

              {power && (
                <p className="day-poles">
                  <span className="pole pole-plus">{power.plus.word}</span>
                  <span className="pole-sep">או</span>
                  <span className="pole pole-minus">{power.minus.word}</span>
                  <span className="pole-tilt">{power.tilt}</span>
                </p>
              )}

              {isOpen ? (
                <label className="day-journal">
                  <span className="label">היומן שלי · {skill.note}</span>
                  <textarea
                    rows={2}
                    value={journal[skill.id] || ''}
                    onChange={(e) => write(skill.id, e.target.value)}
                    placeholder="שורה אחת: מה עשיתי, ומה שמתי לב."
                  />
                </label>
              ) : (
                <button className="cta-line day-open" onClick={() => setOpenId(skill.id)}>
                  {journal[skill.id]?.trim() ? `ביומן: ${journal[skill.id].slice(0, 40)}` : 'לרשום ביומן'}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
