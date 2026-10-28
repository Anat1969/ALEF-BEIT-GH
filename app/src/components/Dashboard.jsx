import { useState } from 'react'
import { useLetters } from '../hooks/useLetters'
import PageIntro from './PageIntro'
import RichText from './text/RichText'
import KNOWLEDGE from '../data/letterKnowledge'
import POWER from '../data/letterPower'

function getLetterImage(letterId, letterImages) {
  return letterImages?.getAnyImage(letterId) || null
}

export default function Dashboard({ onSelectLetter, letterImages }) {
  const { letters, getLetter } = useLetters()
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('dashboard-view') || 'grid')
  const chooseView = (mode) => { setViewMode(mode); localStorage.setItem('dashboard-view', mode) }

  const readyCount = letters.filter(l => l.hasData).length

  return (
    <div>
      <PageIntro
        title="כל האותיות במבט אחד"
        insight="**מפת הכניסה** לכל 22 האותיות."
        explain="לכל אות **הכוח** שלה ושני הכיוונים שלו. לחיצה פותחת את הכרטיס המלא."
        howToUse="בכרטיס: **הכוח** בשני כיוונים, המקום ב**סדר**, **ידע** עם מקורות ו**מעשה** להיום."
        example={`א׳ היא ==כוח האחד==: אחדות או איבה. איך מטים לחיוב: לשאול מה מחבר אותי לאדם שמולי.`}
        tip={readyCount === 22 ? "כל 22 האותיות מוכנות. אפשר להתחיל מכל אות, ובסדר היום לבחור 3 עד 5 מיומנויות." : `${readyCount} מתוך 22 אותיות מוכנות כרגע. אפשר כבר להתחיל עם המוכנות.`}
      />

      <div className="flex items-center justify-end gap-1 mb-4">
        <button
          onClick={() => chooseView('grid')}
          aria-pressed={viewMode === 'grid'}
          className={`px-2 py-1 text-[10px] transition-all ${viewMode === 'grid' ? 'text-accent bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}
        >
          כרטיסיות
        </button>
        <button
          onClick={() => chooseView('list')}
          aria-pressed={viewMode === 'list'}
          className={`px-2 py-1 text-[10px] transition-all ${viewMode === 'list' ? 'text-accent bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}
        >
          רשימה
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {letters.map(letter => {
            const image = getLetterImage(letter.id, letterImages)
            const role = POWER[letter.character]?.power || KNOWLEDGE[letter.character]?.nameMeaning || ''
            const oneLiner = POWER[letter.character] ? `**${POWER[letter.character].plus.word}** או ${POWER[letter.character].minus.word}` : ''

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
                    <p className="text-xs font-semibold text-accent leading-relaxed line-clamp-1">{role}</p>
                  ) : (
                    <p className="text-xs text-gray-600 leading-relaxed">ממתינה להשלמה</p>
                  )}
                  {oneLiner && (
                    <RichText as="p" className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed" text={oneLiner} />
                  )}
                </div>

                {/* Data indicator */}
                {letter.hasData && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent" />
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
            const role = POWER[letter.character]?.power || KNOWLEDGE[letter.character]?.nameMeaning || ''
            const oneLiner = POWER[letter.character] ? `**${POWER[letter.character].plus.word}** או ${POWER[letter.character].minus.word}` : ''
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
                    <p className="text-xs font-semibold text-accent truncate">{role}</p>
                  ) : (
                    <p className="text-xs text-gray-600">ממתינה להשלמה</p>
                  )}
                  {oneLiner && (
                    <RichText as="p" className="text-xs text-gray-500 truncate mt-0.5" text={oneLiner} />
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
          <span className="w-2 h-2 bg-accent inline-block"></span>
          נתונים מלאים ({readyCount})
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-gray-600 inline-block"></span>
          ממתין ({22 - readyCount})
        </span>
      </div>
    </div>
  )
}
