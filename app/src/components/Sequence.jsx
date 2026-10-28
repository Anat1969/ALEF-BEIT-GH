import PageIntro from './PageIntro'
import RichText, { MeaningBox } from './text/RichText'
import POWER from '../data/letterPower'
import { useLetters } from '../hooks/useLetters'
import { JOURNEY, JOURNEY_SOURCE, JOURNEY_SUMMARY, HIERARCHY, HIERARCHY_INSIGHT, ORDER_FACTS } from '../data/sequence'

// Why the letters come in this order: the journey, the hierarchy, and order facts.
export default function Sequence({ onSelectLetter }) {
  const { letters } = useLetters()
  const byChar = Object.fromEntries(letters.map((l) => [l.character, l]))

  const LetterButton = ({ ch }) => (
    <button className="seq-letter" onClick={() => onSelectLetter(byChar[ch].id)} aria-label={`לכרטיס של ${byChar[ch]?.name}`}>
      <span className="seq-glyph">{ch}</span>
      <span className="seq-power">{POWER[ch]?.power.replace('כוח ', '')}</span>
    </button>
  )

  return (
    <div>
      <PageIntro
        title="למה האותיות מסודרות כך"
        insight="הסדר הוא **מסע אחד**, לא רשימה."
        explain="כל אות ממשיכה את הקודמת. התלמוד קורא את האותיות לפי הסדר, כדרך שמתחילה בלמידה ונחתמת באמת."
        howToUse="שלוש קריאות של הסדר: **המסע** (מה מוביל ממה), **המדרגות** (אחדות, עשרות ומאות), ו**הסימנים** שקיימים רק בזכות הסדר."
      />

      <section aria-labelledby="journey-h" className="seq-section">
        <div className="section-head">
          <span className="eyebrow">1 · המסע</span>
          <h2 id="journey-h" className="section-title">מלמידה ועד אמת</h2>
          <p className="section-note">מקור: {JOURNEY_SOURCE}</p>
        </div>
        <MeaningBox kind="insight" label="התובנה" text={JOURNEY_SUMMARY} />
        <ol className="journey">
          {JOURNEY.map((step, i) => (
            <li key={step.letters} className="journey-step">
              <span className="journey-n">{String(i + 1).padStart(2, '0')}</span>
              <div className="journey-letters">
                {step.letters.split('').filter((ch) => byChar[ch]).map((ch) => <LetterButton key={ch} ch={ch} />)}
              </div>
              <div className="journey-body">
                <p className="journey-reading">{step.reading}</p>
                <RichText as="p" className="journey-insight" text={step.insight} />
                <p className="journey-action"><span className="label">מה עושים</span>{step.action}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tiers-h" className="seq-section">
        <div className="section-head">
          <span className="eyebrow">2 · המדרגות</span>
          <h2 id="tiers-h" className="section-title">מהפנים, אל האחר, אל העולם</h2>
        </div>
        <MeaningBox kind="insight" label="התובנה" text={HIERARCHY_INSIGHT} />
        <div className="stairs">
          {HIERARCHY.map((tier, i) => (
            <div key={tier.id} className={`stair stair-${i + 1}`}>
              <div className="stair-head">
                <span className="stair-label">{tier.label}</span>
                <span className="tier-range">{tier.range}</span>
              </div>
              <div className="journey-letters">
                {tier.letters.split('').map((ch) => <LetterButton key={ch} ch={ch} />)}
              </div>
              <p className="layer-source">{tier.fact}</p>
              <RichText as="p" className="layer-text" text={tier.reading} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="facts-h" className="seq-section">
        <div className="section-head">
          <span className="eyebrow">3 · הסימנים</span>
          <h2 id="facts-h" className="section-title">מה שקיים רק בזכות הסדר</h2>
        </div>
        <div className="layers">
          {ORDER_FACTS.map((f) => (
            <div key={f.title} className="layer layer-fact">
              <span className="layer-label">{f.title}</span>
              <RichText as="p" className="layer-text" text={f.fact} />
              <RichText as="p" className="explain-line" text={f.insight} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
