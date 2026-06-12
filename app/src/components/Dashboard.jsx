import { useState } from 'react'
import { useLetters } from '../hooks/useLetters'
import PageIntro from './PageIntro'

function getLetterImage(letterId, letterImages) {
  const img = letterImages?.getImage(letterId)
  if (img) return img
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`article-hero-${letterId}`) || localStorage.getItem(`arch-image-${letterId}`) || null
}

export default function Dashboard({ onSelectLetter, letterImages }) {
  const { letters, getLetter } = useLetters()
  const [viewMode, setViewMode] = useState('grid')

  const readyCount = letters.filter(l => l.hasData).length

  return (
    <div>
      <PageIntro
        title="לוח בקרה"
        subtitle={`22 אותיות, 7 מימדים, מערכת חיה אחת`}
        purpose="זהו מפת הכניסה שלך למערכת. כל ריבוע מייצג אות עברית אחת — מערכת שלמה של ידע, תרגול ויצירה. מכאן את בוחרת לאיזו אות לצלול."
        howToUse="לחצי על אות כלשהי כדי לראות את הכרטיס המלא שלה — כולל 7 מימדים, מיומנות יומית, קשרים, ונתוני יצירה."
        example={`לדוגמה: לחצי על א׳ כדי לגלות שהיא מייצגת "נשימה ראשונה" — הצליל הכי שקט שקיים, עם תרגול יומי של 5 דקות נשימה ב-06:00.`}
        tip={`${readyCount} מתוך 22 אותיות מוכנות כרגע. גם עם 3 אותיות אפשר כבר להתחיל את התרגול היומי.`}
      />

      <div className="flex items-center justify-end gap-1 mb-4">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-2 py-1 text-[10px] transition-all ${viewMode === 'grid' ? 'text-accent bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}
        >
          כרטיסיות
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-2 py-1 text-[10px] transition-all ${viewMode === 'list' ? 'text-accent bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}
        >
          רשימה
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {letters.map(letter => {
            const full = getLetter(letter.id)
            const image = getLetterImage(letter.id, letterImages)
            const role = full.core?.archetypal_role || ''
            const oneLiner = full.synthesis?.one_liner || ''

            return (
              <button
                key={letter.id}
                onClick={() => onSelectLetter(letter.id)}
                className="group relative glass-card overflow-hidden text-right transition-all duration-200 hover:-translate-y-px"
              >
                {/* Image or letter visual */}
                <div className="aspect-[4/3] relative overflow-hidden bg-dark-bg/50">
                  {image ? (
                    <img src={image} alt={letter.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/15">
                      <span className="text-7xl font-light text-accent/30 group-hover:text-accent/50 transition-colors">
                        {letter.character}
                      </span>
                    </div>
                  )}
                  {/* Gematria badge */}
                  <span className="absolute top-2 left-2 text-[10px] text-white/50 bg-black/30 px-1.5 py-0.5 backdrop-blur-sm">
                    {letter.gematria}
                  </span>
                </div>

                {/* Content preview */}
                <div className="p-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-dark-text group-hover:text-accent-light transition-colors">
                      {letter.character}
                    </span>
                    <span className="text-sm text-gray-400">{letter.name}</span>
                  </div>
                  {role ? (
                    <p className="text-xs text-accent-light leading-relaxed line-clamp-1">{role}</p>
                  ) : (
                    <p className="text-xs text-gray-600 leading-relaxed">ממתינה להשלמה</p>
                  )}
                  {oneLiner && (
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 italic leading-relaxed">"{oneLiner}"</p>
                  )}
                </div>

                {/* Data indicator */}
                {letter.hasData && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-1">
          {letters.map(letter => {
            const full = getLetter(letter.id)
            const image = getLetterImage(letter.id, letterImages)
            const role = full.core?.archetypal_role || ''
            const oneLiner = full.synthesis?.one_liner || ''
            const skill = full.skill?.name || ''

            return (
              <button
                key={letter.id}
                onClick={() => onSelectLetter(letter.id)}
                className="w-full flex items-center gap-3 glass-card p-2 text-right hover:-translate-y-px transition-all"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 shrink-0 overflow-hidden bg-dark-bg/50">
                  {image ? (
                    <img src={image} alt={letter.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/15">
                      <span className="text-2xl font-light text-accent/40">{letter.character}</span>
                    </div>
                  )}
                </div>

                {/* Letter + name */}
                <div className="flex items-baseline gap-2 shrink-0 w-20">
                  <span className="text-xl font-bold text-dark-text">{letter.character}</span>
                  <span className="text-xs text-gray-500">{letter.name}</span>
                </div>

                {/* Role */}
                <div className="flex-1 min-w-0">
                  {role ? (
                    <p className="text-xs text-accent-light truncate">{role}</p>
                  ) : (
                    <p className="text-xs text-gray-600">ממתינה להשלמה</p>
                  )}
                  {oneLiner && (
                    <p className="text-[10px] text-gray-500 truncate italic mt-0.5">"{oneLiner}"</p>
                  )}
                </div>

                {/* Skill */}
                {skill && (
                  <span className="text-[10px] text-gray-500 shrink-0 hidden sm:block">{skill}</span>
                )}

                {/* Gematria */}
                <span className="text-[10px] text-gray-600 shrink-0 w-8 text-center">{letter.gematria}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-6 flex items-center gap-6 text-xs text-gray-500">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full inline-block"></span>
          נתונים מלאים ({readyCount})
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-gray-600 rounded-full inline-block"></span>
          ממתין ({22 - readyCount})
        </span>
      </div>
    </div>
  )
}
