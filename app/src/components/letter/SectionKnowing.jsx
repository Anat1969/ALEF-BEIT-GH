import RichText from '../text/RichText'
import KNOWLEDGE from '../../data/letterKnowledge'
import SKILLS_DATA from '../../data/dailySkills'
import { relationsOf, gematriaOf } from '../../data/systems'

// The core of the card: what is known (with sources), what it means (marked
// as interpretation), and what to do with it today and in space.
export default function SectionKnowing({ letter, onSelectLetter, letters }) {
  const k = KNOWLEDGE[letter.character]
  if (!k) return null
  const skill = SKILLS_DATA.find((s) => s.char === letter.character)
  const relations = relationsOf(letter.character)
  const byChar = Object.fromEntries(letters.map((l) => [l.character, l]))
  const mouth = relations.find((r) => r.system.id === 'mouth')
  const klass = relations.find((r) => r.system.id === 'classes')

  const facts = [
    { label: 'פירוש השם', value: k.nameMeaning, chip: k.certainty, source: k.nameSource },
    { label: 'צורה', value: k.shape },
    { label: 'קול', value: k.sound },
    { label: 'גימטריה ומקום', value: `ערך ${gematriaOf(letter.character)} · האות ה-${letters.findIndex((l) => l.id === letter.id) + 1} מתוך 22` },
    mouth && { label: 'מאיפה בפה', value: `${mouth.group.label}, עם ${mouth.partners.join(' ')}`, source: 'ספר יצירה, פרק ב' },
    klass && { label: 'בספר יצירה', value: `${klass.group.label}${klass.group.note ? `: ${klass.group.note}` : ''}`, source: 'ספר יצירה' },
  ].filter(Boolean)

  return (
    <div className="knowing">
      <section className="layer layer-fact" aria-label="ידע">
        <span className="layer-label">1 · ידע · עובדות</span>
        <dl className="facts">
          {facts.map((f) => (
            <div key={f.label} className="fact">
              <dt className="label">{f.label}</dt>
              <dd>
                <span className="fact-value">{f.value}</span>
                {f.chip && <span className={`certainty certainty-${f.chip}`}>{f.chip}</span>}
                {f.source && <span className="fact-source">מקור: {f.source}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="layer layer-read" aria-label="הבנה">
        <span className="layer-label">2 · הבנה · פרשנות</span>
        <RichText as="p" className="insight-line" text={k.insight} />
        <RichText as="p" className="explain-line" text={k.explain} />
        <p className="layer-source">פרשנות שנגזרת מהעובדות שלמעלה. היא לא עובדה, ואפשר לחלוק עליה.</p>
      </section>

      <section className="layer layer-do" aria-label="יישום">
        <span className="layer-label">3 · יישום · פעולה</span>
        <div className="do-grid">
          <div>
            <span className="label">היום</span>
            <RichText as="p" className="layer-text" text={k.action} />
          </div>
          <div>
            <span className="label">במרחב</span>
            <RichText as="p" className="layer-text" text={k.space} />
          </div>
          {skill && (
            <div>
              <span className="label">בסדר היום</span>
              <RichText as="p" className="layer-text" text={`${skill.name}: ${skill.action}. **${skill.duration} דקות**, ${skill.time}.`} />
            </div>
          )}
        </div>
      </section>

      <section className="layer" aria-label="קשרים">
        <span className="layer-label">קשרים לפי כלל</span>
        <ul className="rel-list">
          {relations.map(({ system, partners }) => (
            <li key={system.id} className="rel-row">
              <span className="label">{system.name}</span>
              <span className="rel-partners">
                {partners.map((ch) => (
                  <button key={ch} className="rel-chip" onClick={() => onSelectLetter(byChar[ch].id)} aria-label={`לכרטיס של ${byChar[ch]?.name}`}>
                    {ch} <small>{byChar[ch]?.name}</small>
                  </button>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
