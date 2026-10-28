import { useState } from 'react'
import PageIntro from './PageIntro'
import RichText, { MeaningBox } from './text/RichText'
import { SYSTEMS } from '../data/systems'
import KNOWLEDGE from '../data/letterKnowledge'
import { useLetters } from '../hooks/useLetters'

// One screen for every relationship: choose a system, see its groups,
// then pick a letter to see who it is tied to and what to do with that.
export default function Relations({ onSelectLetter }) {
  const { letters } = useLetters()
  const [systemId, setSystemId] = useState(() => localStorage.getItem('relations-system') || 'atbash')
  const [picked, setPicked] = useState(null)
  const system = SYSTEMS.find((s) => s.id === systemId) || SYSTEMS[0]
  const byChar = Object.fromEntries(letters.map((l) => [l.character, l]))

  const chooseSystem = (id) => {
    setSystemId(id)
    setPicked(null)
    localStorage.setItem('relations-system', id)
  }

  const pickedGroup = picked && system.groups.find((g) => g.letters.includes(picked))
  const partners = pickedGroup ? pickedGroup.letters.split('').filter((c) => c !== picked) : []

  return (
    <div>
      <PageIntro
        title="איך אותיות קשורות זו לזו"
        insight="**חמש שיטות** מוכרות, לא תחושה."
        explain="כל קשר כאן נשען על **כלל ידוע** ועל מקור. בוחרים שיטה, ואז אות."
        howToUse="לכל שיטה שלוש שכבות: **הכלל** (עובדה), **מה זה אומר** (פרשנות) ו**מה עושים עם זה** (פעולה)."
      />

      <div className="system-tabs" role="tablist" aria-label="שיטות קשר">
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={s.id === system.id}
            className={`system-tab ${s.id === system.id ? 'is-active' : ''}`}
            onClick={() => chooseSystem(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="layers">
        <div className="layer layer-fact">
          <span className="layer-label">הכלל · עובדה</span>
          <RichText as="p" className="layer-text" text={system.rule} />
          <p className="layer-source">מקור: {system.source}</p>
        </div>
        <div className="layer layer-read">
          <span className="layer-label">מה זה אומר · פרשנות</span>
          <RichText as="p" className="layer-text" text={system.meaning} />
        </div>
        <div className="layer layer-do">
          <span className="layer-label">מה עושים עם זה · פעולה</span>
          <RichText as="p" className="layer-text" text={system.action} />
        </div>
      </div>

      {system.why && <MeaningBox kind="insight" label="התובנה שמאחורי הבחירה" text={system.why} />}

      <p className="groups-hint">לחיצה על אות מראה את הקשרים שלה בשיטה הזו.</p>
      <div className={`groups groups-${system.id}`}>
        {system.groups.map((g) => (
          <div key={g.id} className={`group ${pickedGroup?.id === g.id ? 'is-picked' : ''}`}>
            <span className="group-label">{g.label}{g.note ? ` · ${g.note}` : ''}</span>
            {g.insight && <RichText as="p" className="group-insight" text={g.insight} />}
            <div className="group-letters">
              {g.letters.split('').map((ch) => (
                <button
                  key={ch}
                  className={`rel-tile ${picked === ch ? 'is-picked' : ''} ${partners.includes(ch) ? 'is-partner' : ''}`}
                  aria-pressed={picked === ch}
                  onClick={() => setPicked(picked === ch ? null : ch)}
                >
                  <span className="rel-glyph">{ch}</span>
                  <span className="rel-name">{byChar[ch]?.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {picked && (
        <div className="pair-panel" aria-live="polite">
          <span className="layer-label">{picked}׳ בשיטה הזו</span>
          <p className="pair-head"><b>{picked}׳ {byChar[picked]?.name}</b> · {KNOWLEDGE[picked]?.nameMeaning}</p>
          <RichText as="p" className="pair-insights" text={KNOWLEDGE[picked]?.insight} />
          {partners.length === 0 ? (
            <p className="layer-text">ל-{picked}׳ אין שותפה בשיטה הזו.</p>
          ) : (
            <>
              <span className="label pair-with">{partners.length === 1 ? 'השותפה שלה' : `${partners.length} השותפות שלה`}</span>
              <ul className="pair-list">
                {partners.map((ch) => (
                  <li key={ch} className="pair-row">
                    <span className="rel-glyph">{ch}</span>
                    <div className="pair-body">
                      <p className="pair-name"><b>{byChar[ch]?.name}</b> · {KNOWLEDGE[ch]?.nameMeaning}</p>
                      <RichText as="p" className="pair-insights" text={KNOWLEDGE[ch]?.insight} />
                    </div>
                    <button className="cta-line" onClick={() => onSelectLetter(byChar[ch].id)}>לכרטיס של {ch}׳</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
