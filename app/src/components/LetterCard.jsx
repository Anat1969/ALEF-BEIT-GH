import { useState } from 'react'
import { useLetters } from '../hooks/useLetters'
import { SECTIONS } from './letter/constants'
import SectionOverview from './letter/SectionOverview'
import SectionDimensions from './letter/SectionDimensions'
import SectionWords from './letter/SectionWords'
import SectionRelationships from './letter/SectionRelationships'
import SectionSkill from './letter/SectionSkill'
import SectionSpace from './letter/SectionSpace'
import SectionPrompt from './letter/SectionPrompt'
import SectionArticle from './letter/SectionArticle'

export default function LetterCard({ letterId, onSelectLetter, letterImages }) {
  const { letters, getLetter } = useLetters()
  const letter = getLetter(letterId)
  const [activeSection, setActiveSection] = useState('overview')

  if (!letter) return <p className="text-text-secondary text-lg">אות לא נמצאה</p>

  const prevId = letterId > 1 ? letterId - 1 : 22
  const nextId = letterId < 22 ? letterId + 1 : 1

  const availableSections = SECTIONS.filter(s => {
    if (!letter.hasData && s.id !== 'overview' && s.id !== 'article') return false
    return true
  })

  const renderSection = () => {
    if (!letter.hasData && activeSection !== 'overview' && activeSection !== 'article') return null
    switch (activeSection) {
      case 'overview': return <SectionOverview letter={letter} />
      case 'dimensions': return <SectionDimensions letter={letter} />
      case 'words': return <SectionWords letterId={letter.id} character={letter.character} />
      case 'relationships': return <SectionRelationships letter={letter} letters={letters} onSelectLetter={onSelectLetter} />
      case 'skill': return <SectionSkill letter={letter} />
      case 'space': return <SectionSpace letter={letter} />
      case 'prompt': return <SectionPrompt key={letter.id} letter={letter} letterImages={letterImages} />
      case 'article': return null
      default: return null
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Letter navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onSelectLetter(prevId)}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-dark-text hover:bg-white/5 transition-all"
        >
          הקודמת →
        </button>
        <div className="flex gap-0.5">
          {letters.map(l => (
            <button
              key={l.id}
              onClick={() => onSelectLetter(l.id)}
              className={`w-8 h-8 text-sm font-medium transition-all ${
                l.id === letter.id
                  ? 'bg-accent dark:bg-accent-light text-white scale-110'
                  : l.hasData
                    ? 'bg-surface dark:bg-dark-surface text-text dark:text-dark-text hover:bg-accent/20 dark:hover:bg-accent-light/20'
                    : 'bg-transparent text-text-tertiary dark:text-gray-600 hover:bg-surface dark:hover:bg-dark-surface'
              }`}
            >
              {l.character}
            </button>
          ))}
        </div>
        <button
          onClick={() => onSelectLetter(nextId)}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-dark-text hover:bg-white/5 transition-all"
        >
          ← הבאה
        </button>
      </div>

      {/* Main card */}
      <div className="glass overflow-hidden">
        {/* Section buttons bar */}
        <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2.5">
          <div className="flex gap-1.5 overflow-x-auto">
            {availableSections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`
                  px-4 py-2 text-sm font-medium whitespace-nowrap transition-all
                  ${activeSection === s.id
                    ? 'bg-accent dark:bg-accent-light text-white shadow-sm'
                    : 'bg-white dark:bg-dark-surface text-text-secondary dark:text-gray-400 hover:bg-accent/10 dark:hover:bg-accent-light/10 border border-border/50 dark:border-dark-border/50'
                  }
                `}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'article' ? (
          <SectionArticle key={letter.id} letter={letter} letterImages={letterImages} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[500px]">
            {/* Image + Energetic below */}
            <div className="p-4 md:p-5 flex flex-col border-l border-border/50 dark:border-dark-border/50 bg-surface/20 dark:bg-dark-bg/20">
              {(() => {
                const anyImage = letterImages.getAnyImage(letter.id)

                if (anyImage) return (
                  <div className="relative w-full group">
                    <img
                      src={anyImage}
                      alt={`תמונת ${letter.name}`}
                      className="w-full object-contain"
                    />
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity">
                      <label className="px-2 py-1 bg-black/40 text-white/70 text-[10px] hover:bg-black/60 cursor-pointer backdrop-blur-sm">
                        החלף
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = () => letterImages.saveImage(letter.id, reader.result)
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                      <button
                        onClick={() => letterImages.removeImage(letter.id)}
                        className="px-2 py-1 bg-black/40 text-white/70 text-[10px] hover:bg-black/60 backdrop-blur-sm"
                      >
                        הסר
                      </button>
                    </div>
                  </div>
                )

                return (
                  <div className="relative w-full flex flex-col items-center justify-center py-10 bg-gradient-to-br from-accent/5 to-accent/15 group">
                    <span className="text-[100px] leading-none font-extralight text-accent/20">{letter.character}</span>
                    <h3 className="text-lg font-bold text-dark-text mt-2">{letter.name}</h3>
                    {letter.core?.archetypal_role && (
                      <p className="text-sm text-accent-light mt-1">{letter.core.archetypal_role}</p>
                    )}
                    {letter.synthesis?.one_liner && (
                      <p className="text-xs text-gray-500 italic mt-2 px-4 text-center leading-relaxed">"{letter.synthesis.one_liner}"</p>
                    )}
                    <label className="mt-4 px-3 py-1.5 text-[10px] text-gray-500 hover:text-accent-light cursor-pointer hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
                      העלה תמונה
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = () => letterImages.saveImage(letter.id, reader.result)
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </div>
                )
              })()}

              {letter.hasData && letter.dimensions?.energetic && (
                <div className="mt-4 bg-warning/5 dark:bg-warning/10 border border-warning/20 dark:border-warning/30 p-4">
                  <h4 className="text-sm font-bold text-warning uppercase tracking-wider mb-1">הכוח של האות</h4>
                  <p className="text-sm text-text dark:text-dark-text leading-relaxed">{letter.dimensions.energetic.description}</p>
                  {letter.dimensions.energetic.flow_direction && (
                    <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">כיוון: {letter.dimensions.energetic.flow_direction}</p>
                  )}
                  {letter.dimensions.energetic.expansion_type && (
                    <p className="text-xs text-text-secondary dark:text-gray-400">התרחבות: {letter.dimensions.energetic.expansion_type}</p>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 md:p-5 overflow-y-auto max-h-[600px]">
              {renderSection()}

              {!letter.hasData && activeSection === 'overview' && (
                <div className="text-center py-8 text-text-tertiary dark:text-gray-500 mt-4">
                  <p className="text-xl mb-2">נתונים מלאים יתווספו בהמשך</p>
                  <p className="text-base">אות זו ממתינה להשלמה ב-COWORK</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
