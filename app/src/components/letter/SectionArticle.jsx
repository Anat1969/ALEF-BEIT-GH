import { useState } from 'react'

export default function SectionArticle({ letter, letterImages }) {
  const heroImage = letterImages.getHeroImage(letter.id) || letterImages.getArchImage(letter.id) || ''
  const [articleText, setArticleText] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`article-${letter.id}`) || ''
    }
    return ''
  })
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showText, setShowText] = useState(false)

  const role = letter.core?.archetypal_role || ''
  const oneLiner = letter.synthesis?.one_liner || ''
  const poetic = letter.synthesis?.poetic_phrase || ''
  const spatialPrinciple = letter.spatial_model?.architectural_principle || ''
  const roomType = letter.spatial_model?.room_type || ''
  const lightSource = letter.spatial_model?.light_source || ''
  const materials = letter.spatial_model?.material_palette || ''
  const humanExp = letter.spatial_model?.human_experience || ''
  const visualMetaphor = letter.spatial_model?.visual_metaphor || ''
  const energeticDesc = letter.dimensions?.energetic?.description || ''
  const spatialDesc = letter.dimensions?.spatial?.description || ''
  const sonicDesc = letter.dimensions?.sonic?.description || ''
  const psychDesc = letter.dimensions?.psychological?.description || ''

  const defaultArticle = [
    oneLiner && `"${oneLiner}"`,
    '',
    role && `${letter.character}׳ — ${role}.`,
    poetic && `${poetic}.`,
    '',
    sonicDesc && `הקול: ${sonicDesc}`,
    psychDesc && `הנפש: ${psychDesc}`,
    energeticDesc && `האנרגיה: ${energeticDesc}`,
    '',
    '— מרחב ואדריכלות —',
    '',
    spatialPrinciple && `עיקרון אדריכלי: ${spatialPrinciple}.`,
    roomType && `סוג החלל: ${roomType}.`,
    lightSource && `אור: ${lightSource}.`,
    materials && `חומרים: ${materials}.`,
    spatialDesc && `המרחב: ${spatialDesc}`,
    '',
    humanExp && `החוויה האנושית: ${humanExp}.`,
    visualMetaphor && `המטפורה: ${visualMetaphor}.`,
    '',
    `מבנה מינימליסטי שמזקק את רוח האות ${letter.character}׳ למרחב מחייה — מההשראה הראשונית ועד לתכנון אדריכלי שאפשר לחיות בתוכו.`,
  ].filter(Boolean).join('\n')

  const currentText = articleText || defaultArticle

  const save = (text) => {
    setArticleText(text)
    localStorage.setItem(`article-${letter.id}`, text)
  }

  const handleHeroUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => letterImages.saveHeroImage(letter.id, reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        const reader = new FileReader()
        reader.onload = () => letterImages.saveHeroImage(letter.id, reader.result)
        reader.readAsDataURL(file)
        return
      }
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(currentText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[600px] relative group" dir="rtl" onPaste={handlePaste}>
      {/* Full background image — CLEAR, full opacity */}
      {heroImage && (
        <img
          src={heroImage}
          alt={`${letter.hebrew_name} — אדריכלות`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Image controls — subtle, hover only */}
      {heroImage && (
        <div className="absolute top-2 left-2 z-20 flex gap-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity">
          <label className="px-2 py-1 bg-black/40 text-white/70 text-[10px] cursor-pointer hover:bg-black/60 backdrop-blur-sm">
            החלף
            <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
          </label>
          <button
            onClick={() => letterImages.removeHeroImage(letter.id)}
            className="px-2 py-1 bg-black/40 text-white/70 text-[10px] hover:bg-black/60"
          >
            הסר
          </button>
        </div>
      )}

      {/* Upload prompt when no image */}
      {!heroImage && (
        <div className="w-full py-10 flex flex-col items-center justify-center gap-3 border-b border-white/10">
          <span className="text-[72px] leading-none text-accent-light/30">{letter.character}</span>
          <label className="px-4 py-2 bg-white/10 text-gray-400 text-xs cursor-pointer hover:bg-white/15 transition-all">
            העלה תמונה
            <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
          </label>
          <p className="text-xs text-gray-600">Ctrl+V</p>
        </div>
      )}

      {/* Minimal title bar at bottom of image */}
      {heroImage && !showText && (
        <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-16 pb-4 px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{letter.hebrew_name}</h2>
              {role && <p className="text-sm text-white/70 mt-0.5">{role}</p>}
            </div>
            <button
              onClick={() => setShowText(true)}
              className="px-3 py-1.5 bg-white/10 text-white/80 text-xs backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              קרא עוד
            </button>
          </div>
        </div>
      )}

      {/* Text overlay — shown on click, only when image exists */}
      {heroImage && showText && (
        <div className="absolute inset-0 z-10 bg-gray-200/75 backdrop-blur-md overflow-y-auto">
          <div className="max-w-[700px] mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowText(false)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
              >
                ← חזרה לתמונה
              </button>
              <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-2 py-1 text-[10px] transition-colors ${
                    isEditing ? 'bg-gray-400/30 text-gray-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isEditing ? 'תצוגה' : 'עריכה'}
                </button>
                <button
                  onClick={copy}
                  className="px-2 py-1 text-[10px] text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {copied ? 'הועתק!' : 'העתק'}
                </button>
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-[60px] leading-none font-light text-accent">{letter.character}</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{letter.hebrew_name}</h2>
              {role && <p className="text-base text-gray-600 mt-1">{role}</p>}
            </div>

            {oneLiner && (
              <blockquote className="text-lg font-light italic leading-relaxed text-center my-6 px-4 border-r-4 text-accent border-accent/40">
                "{oneLiner}"
              </blockquote>
            )}

            {isEditing ? (
              <textarea
                value={currentText}
                onChange={(e) => save(e.target.value)}
                className="w-full min-h-[400px] p-4 border border-gray-400 bg-white/80 text-base text-gray-900 leading-[1.9] resize-y focus:outline-none focus:ring-2 focus:ring-accent/30"
                dir="rtl"
              />
            ) : (
              <article>
                {currentText.split('\n').map((line, i) => {
                  if (!line.trim()) return <div key={i} className="h-4" />
                  if (line.startsWith('—') && line.endsWith('—'))
                    return <h3 key={i} className="text-center text-sm font-bold text-accent tracking-widest uppercase my-6">{line.replace(/—/g, '').trim()}</h3>
                  if (line.startsWith('"') && line.endsWith('"'))
                    return <p key={i} className="text-lg italic text-accent text-center leading-relaxed">{line}</p>
                  return <p key={i} className="text-base leading-[1.9] mb-1 text-gray-800">{line}</p>
                })}
              </article>
            )}

            <div className="mt-8 pt-6 border-t border-gray-400/30 flex items-center justify-between text-xs text-gray-500">
              <span>22 אותיות — מערכת חיה</span>
              <span>אות #{letter.id} מתוך 22</span>
            </div>
          </div>
        </div>
      )}

      {/* No-image fallback content */}
      {!heroImage && (
        <div className="relative z-10 max-w-[700px] mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-text">{letter.hebrew_name}</h2>
            {role && <p className="text-lg mt-1 text-accent-light">{role}</p>}
          </div>

          {oneLiner && (
            <blockquote className="text-xl font-light italic leading-relaxed text-center my-6 px-4 border-r-4 text-accent-light border-accent-light/30">
              "{oneLiner}"
            </blockquote>
          )}

          <div className="flex items-center justify-end gap-1 mb-4 opacity-40 hover:opacity-80 transition-opacity">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-2 py-1 text-[10px] transition-colors ${
                isEditing ? 'bg-white/15 text-gray-300' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isEditing ? 'תצוגה' : 'עריכה'}
            </button>
            <button onClick={copy} className="px-2 py-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors">
              {copied ? 'הועתק!' : 'העתק'}
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={currentText}
              onChange={(e) => save(e.target.value)}
              className="w-full min-h-[400px] p-4 border border-white/20 bg-black/50 backdrop-blur-sm text-base text-white leading-[1.9] resize-y focus:outline-none focus:ring-2 focus:ring-accent-light/30"
              dir="rtl"
            />
          ) : (
            <article>
              {currentText.split('\n').map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-4" />
                if (line.startsWith('—') && line.endsWith('—'))
                  return <h3 key={i} className="text-center text-sm font-bold text-accent-light tracking-widest uppercase my-6">{line.replace(/—/g, '').trim()}</h3>
                if (line.startsWith('"') && line.endsWith('"'))
                  return <p key={i} className="text-lg italic text-accent-light text-center leading-relaxed">{line}</p>
                return <p key={i} className="text-base leading-[1.9] mb-1 text-dark-text">{line}</p>
              })}
            </article>
          )}

          <div className="mt-8 pt-6 border-t border-dark-border/30 flex items-center justify-between text-xs text-gray-500">
            <span>22 אותיות — מערכת חיה</span>
            <span>אות #{letter.id} מתוך 22</span>
          </div>
        </div>
      )}
    </div>
  )
}
