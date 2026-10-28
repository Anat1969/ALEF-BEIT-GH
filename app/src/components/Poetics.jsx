import { useState } from 'react'
import PageIntro from './PageIntro'
import POWER from '../data/letterPower'
import { useLetters } from '../hooks/useLetters'

// Verbal art: a poem and a post for every letter, ready to copy.
// The poems follow Psalm 119: every line opens with the letter.
export default function Poetics({ selectedLetterId, onPick, onOpenCard }) {
  const { letters } = useLetters()
  const [copied, setCopied] = useState('')
  const letter = letters.find((l) => l.id === selectedLetterId) || letters[0]
  const p = POWER[letter.character]

  const copy = async (kind, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      setCopied('error')
    }
  }

  return (
    <div>
      <PageIntro
        title="כל אות, שיר ופוסט"
        insight="הכוח של האות, **במילים**."
        explain="שיר שכל שורה בו פותחת באות, כמו בתהלים קיט, ופוסט קצר לשיתוף."
        howToUse="בוחרים אות. **העתקת השיר** ו**העתקת הפוסט** מעתיקות את הטקסט כמו שהוא, מוכן להדבקה."
      />

      <div className="poet-letters" role="tablist" aria-label="בחירת אות">
        {letters.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={l.id === letter.id}
            className={`poet-letter ${l.id === letter.id ? 'is-active' : ''}`}
            onClick={() => onPick(l.id)}
          >
            {l.character}
          </button>
        ))}
      </div>

      <div className="poet-grid">
        <article className="poem-card" aria-label={`שיר ${letter.name}`}>
          <span className="poem-glyph" aria-hidden="true">{letter.character}</span>
          <span className="label">שיר · {p.power}</span>
          <div className="poem">
            {p.poem.map((line) => (
              <p key={line} className="poem-line">
                <span className="poem-first">{line[0]}</span>{line.slice(1)}
              </p>
            ))}
          </div>
          <button className="cta-solid" onClick={() => copy('poem', p.poem.join('\n'))}>
            {copied === 'poem' ? 'השיר הועתק' : 'העתקת השיר'}
          </button>
        </article>

        <article className="post-card" aria-label={`פוסט ${letter.name}`}>
          <span className="label">פוסט</span>
          <div className="post">
            {p.post.split('\n').map((line, i) => (
              <p key={line} className={i === 0 ? 'post-hook' : 'post-line'}>{line}</p>
            ))}
          </div>
          <div className="post-actions">
            <button className="cta-solid" onClick={() => copy('post', p.post)}>
              {copied === 'post' ? 'הפוסט הועתק' : 'העתקת הפוסט'}
            </button>
            <button className="cta-line" onClick={() => onOpenCard(letter.id)}>לכרטיס של {letter.character}׳</button>
          </div>
          {copied === 'error' && <p className="layer-source" role="alert">ההעתקה לא הצליחה בדפדפן הזה. אפשר לסמן את הטקסט ולהעתיק ידנית.</p>}
        </article>
      </div>
    </div>
  )
}
