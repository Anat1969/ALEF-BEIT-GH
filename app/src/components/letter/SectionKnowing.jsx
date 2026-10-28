import RichText, { MeaningBox } from '../text/RichText'
import KNOWLEDGE from '../../data/letterKnowledge'
import POWER from '../../data/letterPower'
import { JOURNEY } from '../../data/sequence'
import SKILLS_DATA from '../../data/dailySkills'
import { relationsOf, gematriaOf } from '../../data/systems'

// The core of the card: the letter's force in two directions, its place in the
// sequence, then what is known (with sources), what it means, and what to do.
export default function SectionKnowing({ letter, onSelectLetter, letters }) {
  const k = KNOWLEDGE[letter.character]
  if (!k) return null
  const skill = SKILLS_DATA.find((s) => s.char === letter.character)
  const relations = relationsOf(letter.character)
  const byChar = Object.fromEntries(letters.map((l) => [l.character, l]))
  const mouth = relations.find((r) => r.system.id === 'mouth')
  const klass = relations.find((r) => r.system.id === 'classes')
  const power = POWER[letter.character]
  const index = letters.findIndex((l) => l.id === letter.id)
  const prev = letters[index - 1]
  const next = letters[index + 1]
  const step = JOURNEY.find((j) => j.letters.includes(letter.character))

  const facts = [
    { label: 'פירוש השם', value: k.nameMeaning, source: k.nameSource },
    { label: 'בדרשת האותיות', value: power?.talmud, source: 'שבת קד ע״א' },
    { label: 'צורה', value: k.shape },
    { label: 'קול', value: k.sound },
    { label: 'גימטריה ומקום', value: `ערך ${gematriaOf(letter.character)} · האות ה-${letters.findIndex((l) => l.id === letter.id) + 1} מתוך 22` },
    mouth && { label: 'מאיפה בפה', value: `${mouth.group.label}, עם ${mouth.partners.join(' ')}`, source: 'ספר יצירה, פרק ב' },
    klass && { label: 'בספר יצירה', value: `${klass.group.label}${klass.group.note ? `: ${klass.group.note}` : ''}`, source: 'ספר יצירה' },
  ].filter(Boolean)

  return (
    <div className="knowing">
      {power && (
        <section className="power" aria-label="הכוח של האות">
          <span className="label">הכוח</span>
          <p className="power-name">{power.power}</p>
          <p className="power-line">{power.powerLine}</p>
          <div className="power-poles">
            <MeaningBox kind="solution" label={`לחיוב · ${power.plus.word}`} text={`${power.plus.line}${power.plus.more ? ` **${power.plus.more}**.` : ''}`} />
            <MeaningBox kind="problem" label={`לשלילה · ${power.minus.word}`} text={`${power.minus.line}${power.minus.more ? ` **${power.minus.more}**.` : ''}`} />
          </div>
          <p className="power-tilt"><span className="label">איך מטים לחיוב</span>{power.tilt}</p>
        </section>
      )}

      <section className="layer" aria-label="לפני ואחרי">
        <span className="layer-label">במקום שלה בסדר</span>
        <div className="seq-row">
          {prev ? (
            <button className="seq-letter" onClick={() => onSelectLetter(prev.id)} aria-label={`האות הקודמת, ${prev.name}`}>
              <span className="seq-glyph">{prev.character}</span>
              <span className="seq-power">{POWER[prev.character]?.power.replace('כוח ', '')}</span>
            </button>
          ) : <span className="seq-edge">ההתחלה</span>}
          <span className="seq-letter is-current">
            <span className="seq-glyph">{letter.character}</span>
            <span className="seq-power">{power?.power.replace('כוח ', '')}</span>
          </span>
          {next ? (
            <button className="seq-letter" onClick={() => onSelectLetter(next.id)} aria-label={`האות הבאה, ${next.name}`}>
              <span className="seq-glyph">{next.character}</span>
              <span className="seq-power">{POWER[next.character]?.power.replace('כוח ', '')}</span>
            </button>
          ) : <span className="seq-edge">החותם</span>}
        </div>
        {step && (
          <>
            <p className="journey-reading">{step.reading}</p>
            <RichText as="p" className="explain-line" text={step.insight} />
          </>
        )}
      </section>

      <section className="layer layer-fact" aria-label="ידע">
        <span className="layer-label">1 · ידע · עובדות</span>
        <dl className="facts">
          {facts.map((f) => (
            <div key={f.label} className="fact">
              <dt className="label">{f.label}</dt>
              <dd>
                <span className="fact-value">{f.value}</span>
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
        <p className="layer-source">התובנה נגזרת מהכוח ומהעובדות שלמעלה.</p>
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
