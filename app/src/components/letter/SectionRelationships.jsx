import RichText from '../text/RichText'
import KNOWLEDGE from '../../data/letterKnowledge'
import { relationsOf } from '../../data/systems'

// Relationships of one letter, each from a known rule: who, why, and what to do.
export default function SectionRelationships({ letter, letters, onSelectLetter }) {
  const byChar = Object.fromEntries(letters.map((l) => [l.character, l]))
  return (
    <div className="space-y-4">
      {relationsOf(letter.character).map(({ system, partners }) => (
        <div key={system.id} className="layer">
          <span className="layer-label">{system.name}</span>
          <RichText as="p" className="layer-text" text={system.rule} />
          <div className="rel-partners mt-3">
            {partners.map((ch) => (
              <button key={ch} className="rel-chip" onClick={() => onSelectLetter(byChar[ch].id)}>
                {ch} <small>{KNOWLEDGE[ch]?.nameMeaning.split(',')[0]}</small>
              </button>
            ))}
          </div>
          <RichText as="p" className="explain-line" text={system.meaning} />
        </div>
      ))}
    </div>
  )
}
