import { useEffect, useRef, useState } from 'react'
import { useLetters } from '../hooks/useLetters'

const LETTERS_TO_SHOW = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס']

export default function BookAwakening({ onSelectLetter }) {
  const { letters } = useLetters()
  const [active, setActive] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onLetterClick = (char) => {
    const letter = letters.find((l) => l.character === char)
    if (letter) onSelectLetter(letter.id)
  }

  return (
    <section
      ref={ref}
      className={`book-awakening${active ? ' is-open' : ''}`}
      aria-label="ספר שמתעורר — כל אות היא חדר"
    >
      <div className="book-stage">
        {/* Book structure */}
        <div className="book" aria-hidden="true">
          <div className="book-spine" />
          <div className="book-page book-page-left">
            <div className="page-lines">
              {[...Array(7)].map((_, i) => <span key={i} className="page-line" />)}
            </div>
          </div>
          <div className="book-page book-page-right">
            <div className="page-lines">
              {[...Array(7)].map((_, i) => <span key={i} className="page-line" />)}
            </div>
          </div>
        </div>

        {/* Letters rising from the book */}
        <div className="rising-letters" aria-hidden="true">
          {LETTERS_TO_SHOW.map((char, i) => (
            <button
              key={char}
              className="rising-letter"
              style={{ '--delay': `${i * 0.07 + 0.4}s`, '--col': i % 5, '--row': Math.floor(i / 5) }}
              onClick={() => onLetterClick(char)}
              aria-label={`פתח את האות ${char}`}
              tabIndex={active ? 0 : -1}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className="book-caption">
        <p className="eyebrow">22 אותיות · ספר יצירה</p>
        <h2 className="book-title">הספר שמתעורר</h2>
        <p className="book-lead">כל אות עולה מהדף כחדר בפני עצמו. לחיצה על אות פותחת את כרטיס הכוח שלה.</p>
      </div>
    </section>
  )
}
