import { useState } from 'react'
import { useLetters } from '../hooks/useLetters'
import PageIntro from './PageIntro'

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
        howToUse="לחצי על אות כדי לעבור לכרטיס המלא שלה. עבור אותיות עם נתונים — כפתור 'העתק פרומפט' מעתיק את הפרומפט ל-Midjourney, שתוכלי להדביק ישירות בכלי היצירה."
        example={`לדוגמה: אות א׳ — הפרומפט מתאר "חלל לבן אינסופי עם דמות עומדת בשקט, אור רך ממעל" — הדביקי ב-Midjourney וקבלי תמונה מדויקת.`}
        tip="תמונות Midjourney מומלצות ביחס 16:9 עם סגנון --style raw לתוצאה נקייה. שמרי כל תמונה בתיקיית output/ של הפרויקט."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {letters.map(letter => {
          const full = getLetter(letter.id)
          const hasPrompt = full.hasData && full.visual_prompt
          return (
            <div
              key={letter.id}
              className="group relative aspect-square border border-border dark:border-dark-border bg-surface dark:bg-dark-surface overflow-hidden hover:border-accent dark:hover:border-accent-light transition-all duration-200"
            >
              <button
                onClick={() => onSelectLetter(letter.id)}
                className="absolute inset-0 flex items-center justify-center w-full h-full"
              >
                {letterImages.getImage(letter.id) ? (
                  <img src={letterImages.getImage(letter.id)} alt={letter.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl text-muted dark:text-gray-600 group-hover:text-accent dark:group-hover:text-accent-light transition-colors">
                    {letter.character}
                  </span>
                )}
              </button>

              <div className="absolute bottom-0 inset-x-0 bg-white/95 dark:bg-dark-bg/95 py-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-text dark:text-dark-text block text-center">{letter.name}</span>
                {hasPrompt && (
                  <button
                    onClick={(e) => { e.stopPropagation(); copyPrompt(full) }}
                    className="mt-1 w-full text-xs py-1 bg-accent dark:bg-accent-light text-white hover:-translate-y-px hover:shadow-sm active:translate-y-0 transition-all"
                  >
                    {copiedId === letter.id ? 'הועתק!' : 'העתק פרומפט'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-center text-base text-text-tertiary dark:text-gray-500">
        תמונות Midjourney יתווספו בהמשך — כרגע מוצגות placeholders. העבירי עכבר מעל אות עם נתונים כדי להעתיק את הפרומפט.
      </p>
    </div>
  )
}
