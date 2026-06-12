import { useState } from 'react'
import { useLetters } from '../hooks/useLetters'
import PageIntro from './PageIntro'

function getAnyImage(letterId, letterImages) {
  const img = letterImages?.getImage(letterId)
  if (img) return img
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`article-hero-${letterId}`) || localStorage.getItem(`arch-image-${letterId}`) || null
}

export default function Gallery({ onSelectLetter, letterImages }) {
  const { letters, getLetter } = useLetters()
  const [copiedId, setCopiedId] = useState(null)

  const copyPrompt = (letter) => {
    if (!letter.hasData || !letter.visual_prompt) return
    const prompt = letter.visual_prompt.english || letter.visual_prompt.hebrew
    if (!prompt) return
    navigator.clipboard.writeText(prompt)
    setCopiedId(letter.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div>
      <PageIntro
        title="גלריה"
        subtitle="תמונות מתוך עולמה של כל אות"
        purpose="כל אות מייצגת עולם ויזואלי שלם — חלל אדריכלי, אווירה, חומרים ואור. הגלריה מציגה את התמונות שנוצרו עבור כל אות, ומאפשרת ליצור פרומפטים חדשים."
        howToUse="לחצי על אות כדי לעבור לכרטיס המלא שלה. עבור אותיות עם נתונים — כפתור 'העתק פרומפט' מעתיק את הפרומפט ל-Midjourney."
        example={`לדוגמה: אות א׳ — הפרומפט מתאר "חלל לבן אינסופי עם דמות עומדת בשקט, אור רך ממעל" — הדביקי ב-Midjourney וקבלי תמונה מדויקת.`}
        tip="תמונות Midjourney מומלצות ביחס 16:9 עם סגנון --style raw לתוצאה נקייה."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {letters.map(letter => {
          const full = getLetter(letter.id)
          const hasPrompt = full.hasData && full.visual_prompt
          const image = getAnyImage(letter.id, letterImages)
          const role = full.core?.archetypal_role || ''

          return (
            <div
              key={letter.id}
              className="group relative aspect-square glass-card overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => onSelectLetter(letter.id)}
                className="absolute inset-0 flex items-center justify-center w-full h-full"
              >
                {image ? (
                  <img src={image} alt={letter.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-accent/5 to-accent/15 p-3">
                    <span className="text-6xl font-light text-accent/25 group-hover:text-accent/50 transition-colors">
                      {letter.character}
                    </span>
                    {role && (
                      <span className="text-[10px] text-gray-500 text-center leading-tight line-clamp-2">{role}</span>
                    )}
                  </div>
                )}
              </button>

              <div className="absolute bottom-0 inset-x-0 bg-dark-bg/90 backdrop-blur-sm py-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-dark-text block text-center">{letter.name}</span>
                {hasPrompt && (
                  <button
                    onClick={(e) => { e.stopPropagation(); copyPrompt(full) }}
                    className="mt-1 w-full text-[10px] py-1 text-gray-400 hover:text-accent-light transition-colors"
                  >
                    {copiedId === letter.id ? 'הועתק!' : 'העתק פרומפט'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
