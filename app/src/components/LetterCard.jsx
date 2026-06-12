import { useState, useEffect } from 'react'
import { useLetters } from '../hooks/useLetters'
import ImageUploader from './ImageUploader'
import RELATED_WORDS from '../data/relatedWords'

const DIMENSION_CATEGORIES = [
  {
    id: 'senses',
    title: 'חושים',
    dims: [
      { key: 'sonic', label: 'שמיעה — הקול' },
      { key: 'visual', label: 'ראייה — המראה' },
      { key: 'tactile', label: 'מגע — התחושה' },
    ],
  },
  {
    id: 'sciences',
    title: 'מדעים',
    dims: [
      { key: 'mathematical', label: 'מתמטיקה — המספר' },
      { key: 'physics', label: 'פיזיקה — החוק' },
    ],
  },
  {
    id: 'body_soul',
    title: 'גוף ונפש',
    dims: [
      { key: 'physical', label: 'גוף — התנועה' },
      { key: 'psychological', label: 'נפש — הרגש' },
    ],
  },
  {
    id: 'space_time',
    title: 'מרחב וזמן',
    dims: [
      { key: 'spatial', label: 'מרחב — המקום' },
      { key: 'temporal', label: 'זמן — הרגע' },
    ],
  },
]

const SECTIONS = [
  { id: 'overview', label: 'סקירה' },
  { id: 'dimensions', label: 'מימדים' },
  { id: 'words', label: 'שפה' },
  { id: 'relationships', label: 'קשרים' },
  { id: 'skill', label: 'מיומנות' },
  { id: 'space', label: 'מודל מרחבי' },
  { id: 'prompt', label: 'אדריכלות' },
  { id: 'article', label: 'מאמר' },
]

function Detail({ label, value }) {
  if (!value) return null
  return (
    <p className="text-sm">
      <span className="text-text-tertiary dark:text-gray-500 font-medium">{label}:</span>{' '}
      <span className="text-text-secondary dark:text-gray-400">{value}</span>
    </p>
  )
}

function SectionOverview({ letter }) {
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const generateImagePrompt = () => {
    if (letter.visual_prompt?.english) {
      setGeneratedPrompt(letter.visual_prompt.english)
      return
    }
    const prompt = `Create an evocative image for the Hebrew letter ${letter.character} (${letter.english_name}), letter number ${letter.id} of the Hebrew alphabet. Gematria value: ${letter.gematria}. This letter represents the archetype of ${letter.english_name.toLowerCase()} — a pure visual essence. Style: Fine art photography, Mediterranean minimalism, cinematic light, 16:9, no text, no Hebrew characters. Professional architecture photography. Documentary realism.`
    setGeneratedPrompt(prompt)
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pasteToFrame = () => {
    if (generatedPrompt) {
      const key = `overview-prompt-${letter.id}`
      localStorage.setItem(key, generatedPrompt)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <span className="text-[100px] leading-none font-medium text-text dark:text-dark-text">{letter.character}</span>
        <h2 className="text-2xl font-bold text-text dark:text-dark-text">{letter.name}</h2>
        {letter.hasData && letter.core?.archetypal_role && (
          <span className="inline-block mt-2 text-base font-medium text-accent dark:text-accent-light bg-accent/10 dark:bg-accent-light/15 px-4 py-1.5">
            {letter.core.archetypal_role}
          </span>
        )}
      </div>

      {letter.synthesis && (
        <div className="bg-accent/5 dark:bg-accent-light/10 p-4 border border-accent/20 dark:border-accent-light/20">
          <p className="text-lg text-accent dark:text-accent-light italic leading-relaxed">
            "{letter.synthesis.one_liner}"
          </p>
          {letter.synthesis.poetic_phrase && (
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">{letter.synthesis.poetic_phrase}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-surface/50 dark:bg-dark-bg/50 p-3">
          <span className="text-text-tertiary dark:text-gray-500 text-xs">גימטריה</span>
          <p className="text-2xl font-bold text-text dark:text-dark-text">{letter.gematria}</p>
        </div>
        <div className="bg-surface/50 dark:bg-dark-bg/50 p-3">
          <span className="text-text-tertiary dark:text-gray-500 text-xs">סדר</span>
          <p className="text-2xl font-bold text-text dark:text-dark-text">#{letter.id}</p>
        </div>
      </div>

      {letter.hasData && (
        <div className="border border-border/50 dark:border-dark-border/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-tertiary dark:text-gray-500">יצירת פרומפט לתמונה (אנגלית)</p>
            <button
              onClick={generateImagePrompt}
              className="px-3 py-1.5 text-xs font-semibold bg-accent dark:bg-accent-light text-white hover:-translate-y-px hover:shadow-sm active:translate-y-0 transition-all"
            >
              צור פרומפט
            </button>
          </div>

          {generatedPrompt && (
            <>
              <p className="text-[11px] text-accent dark:text-accent-light italic">
                פרומפט ליצירת תמונה אמנותית המזקקת את מהות האות {letter.character}׳
              </p>
              <div className="bg-white dark:bg-dark-bg p-3 text-xs leading-relaxed text-text dark:text-dark-text font-mono border border-border dark:border-dark-border max-h-[120px] overflow-y-auto" dir="ltr">
                {generatedPrompt}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyPrompt}
                  className="flex-1 py-1.5 text-xs font-medium bg-accent/10 dark:bg-accent-light/15 text-accent dark:text-accent-light hover:bg-accent/20 dark:hover:bg-accent-light/25 transition-colors"
                >
                  {copied ? 'הועתק!' : 'העתק'}
                </button>
                <button
                  onClick={pasteToFrame}
                  className="flex-1 py-1.5 text-xs font-medium bg-accent/10 dark:bg-accent-light/15 text-accent dark:text-accent-light hover:bg-accent/20 dark:hover:bg-accent-light/25 transition-colors"
                >
                  {saved ? 'נשמר!' : 'שמור למסגרת'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function DimItem({ dimKey, value, label, isOpen, onToggle }) {
  const fieldMap = {
    sonic: ['articulation', 'texture', 'breath_quality'],
    mathematical: ['function', 'ratio', 'pattern_role'],
    physical: ['body_posture', 'movement_quality', 'tension_state'],
    psychological: ['emotional_state', 'will_expression', 'archetypal_mood'],
    spatial: ['angle', 'line_type', 'color_palette', 'position_in_space', 'light_quality'],
    visual: ['color_experience', 'light_impression', 'visual_metaphor'],
    tactile: ['temperature', 'texture_feel', 'body_sensation'],
    physics: ['principle', 'analogy', 'state'],
    temporal: ['time_quality', 'rhythm', 'cycle_position'],
  }
  const fieldLabels = {
    articulation: 'ארטיקולציה', texture: 'מרקם', breath_quality: 'איכות נשימה',
    function: 'פונקציה', ratio: 'יחס', pattern_role: 'תפקיד בדפוס',
    body_posture: 'תנוחת גוף', movement_quality: 'איכות תנועה', tension_state: 'מצב מתח',
    emotional_state: 'מצב רגשי', will_expression: 'ביטוי רצון', archetypal_mood: 'אווירה ארכיטיפית',
    angle: 'זווית', line_type: 'קו', color_palette: 'פלטת צבעים',
    position_in_space: 'מיקום במרחב', light_quality: 'איכות אור',
    color_experience: 'חוויית צבע', light_impression: 'רושם אור', visual_metaphor: 'מטפורה ויזואלית',
    temperature: 'טמפרטורה', texture_feel: 'מרקם', body_sensation: 'תחושה גופנית',
    principle: 'עיקרון', analogy: 'אנלוגיה', state: 'מצב',
    time_quality: 'איכות זמן', rhythm: 'קצב', cycle_position: 'מיקום במחזור',
    flow_direction: 'כיוון זרימה', expansion_type: 'סוג התרחבות',
  }
  const fields = fieldMap[dimKey] || Object.keys(value).filter(k => k !== 'description')

  return (
    <div className="border border-border/40 dark:border-dark-border/40 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 text-right hover:bg-surface/50 dark:hover:bg-dark-bg/50 transition-colors"
      >
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}>◀</span>
        <div className="flex-1 mr-2">
          <span className="text-sm font-medium text-text dark:text-dark-text">{label}</span>
          <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5 line-clamp-1">{value.description}</p>
        </div>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 space-y-1 bg-surface/30 dark:bg-dark-bg/30 border-t border-border/30 dark:border-dark-border/30 pt-2">
          <p className="text-sm text-text dark:text-dark-text leading-relaxed mb-2">{value.description}</p>
          {fields.map(f => <Detail key={f} label={fieldLabels[f]} value={value[f]} />)}
        </div>
      )}
    </div>
  )
}

function SectionDimensions({ letter }) {
  const [openDim, setOpenDim] = useState(null)
  const [openCat, setOpenCat] = useState(null)
  if (!letter.dimensions) return null

  return (
    <div className="space-y-3">
      {DIMENSION_CATEGORIES.map(cat => {
        const hasDims = cat.dims.some(d => letter.dimensions[d.key])
        if (!hasDims) return null
        const isCatOpen = openCat === cat.id

        return (
          <div key={cat.id} className="border border-border/50 dark:border-dark-border/50 overflow-hidden">
            <button
              onClick={() => setOpenCat(isCatOpen ? null : cat.id)}
              className="w-full flex items-center justify-between p-3 text-right bg-accent/5 dark:bg-accent-light/10 hover:bg-accent/10 dark:hover:bg-accent-light/15 transition-colors"
            >
              <span className={`text-sm transition-transform ${isCatOpen ? 'rotate-90' : ''}`}>◀</span>
              <span className="flex-1 mr-2 text-base font-bold text-accent dark:text-accent-light">{cat.title}</span>
            </button>
            {isCatOpen && (
              <div className="p-3 space-y-2">
                {cat.dims.map(d => {
                  const value = letter.dimensions[d.key]
                  if (!value) return null
                  return (
                    <DimItem
                      key={d.key}
                      dimKey={d.key}
                      value={value}
                      label={d.label}
                      isOpen={openDim === d.key}
                      onToggle={() => setOpenDim(openDim === d.key ? null : d.key)}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const LANGUAGE_TABS = [
  { id: 'roots', label: 'שורשים' },
  { id: 'actions', label: 'פעולות' },
  { id: 'objects', label: 'חפצים ומושגים' },
]

function SectionWords({ letterId, character }) {
  const [langTab, setLangTab] = useState('roots')
  const data = RELATED_WORDS[letterId]
  if (!data) return (
    <p className="text-base text-text-tertiary dark:text-gray-500 text-center py-8">נתוני שפה יתווספו בהמשך</p>
  )

  const items = langTab === 'roots' ? (data.roots || [])
    : langTab === 'actions' ? (data.actions || [])
    : (data.objects || [])

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {LANGUAGE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setLangTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium transition-all ${
              langTab === tab.id
                ? 'bg-accent dark:bg-accent-light text-white'
                : 'bg-surface dark:bg-dark-surface text-text-secondary dark:text-gray-400 hover:bg-accent/10 dark:hover:bg-accent-light/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-text-secondary dark:text-gray-400 mb-3">
        {langTab === 'roots' && `שורשים של ${character}׳ — יחידות משמעות בסיסיות (פ.ע.ל)`}
        {langTab === 'actions' && `פעולות הקשורות ל-${character}׳ — ביטויי עשייה (להפעיל)`}
        {langTab === 'objects' && `חפצים ומושגים הקשורים ל-${character}׳ — עצמים ורעיונות`}
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-text-tertiary dark:text-gray-500 text-center py-4">אין פריטים בקטגוריה זו עדיין</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 items-start p-2.5 bg-surface/50 dark:bg-dark-bg/50 border border-border/30 dark:border-dark-border/30">
              <span className="text-lg font-bold text-accent dark:text-accent-light shrink-0 w-20 text-center">
                {item.word}
              </span>
              <p className="text-xs text-text-secondary dark:text-gray-400 leading-relaxed pt-0.5">
                {item.meaning}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const RELATIONSHIP_TYPES = [
  { type: 'opposite', label: 'מנוגדת', color: 'danger', desc: 'אותיות בקוטב הנגדי — כוחות מאזנים' },
  { type: 'complementary', label: 'משלימה', color: 'info', desc: 'אותיות שמשלימות זו את זו — חיבור הדדי' },
  { type: 'reinforces', label: 'מחזקת', color: 'warning', desc: 'אותיות שמגבירות את הכוח — תהודה' },
  { type: 'sequential', label: 'רצף', color: 'accent', desc: 'אותיות שכנות באלף-בית — זרימה טבעית' },
  { type: 'mirror', label: 'מראה', color: 'info', desc: 'אותיות שמשקפות זו את זו — היפוך צורני או משמעותי' },
]

function SectionRelationships({ letter, letters, onSelectLetter }) {
  const rel = letter.dimensions?.relationships

  return (
    <div className="space-y-4">
      <div className="bg-surface/50 dark:bg-dark-bg/50 p-3 border border-border/30 dark:border-dark-border/30">
        <h4 className="text-sm font-bold text-text dark:text-dark-text mb-2">סוגי קשרים אפשריים</h4>
        <div className="space-y-1.5">
          {RELATIONSHIP_TYPES.map(rt => (
            <div key={rt.type} className="flex gap-2 items-start text-xs">
              <span className={`font-bold shrink-0 w-16 text-${rt.color} dark:text-${rt.color}`}>{rt.label}</span>
              <span className="text-text-secondary dark:text-gray-400">{rt.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {!rel && <p className="text-sm text-text-tertiary dark:text-gray-500 text-center py-4">נתוני קשרים ספציפיים יתווספו בהמשך</p>}

      {rel && (
        <div className="space-y-3">
          {rel.opposite && (
            <button
              onClick={() => {
                const t = letters.find(l => l.character === rel.opposite.letter)
                if (t) onSelectLetter(t.id)
              }}
              className="w-full text-right px-4 py-3 bg-danger/10 dark:bg-danger/20 border border-danger/20 dark:border-danger/30 hover:bg-danger/20 dark:hover:bg-danger/30 transition-colors"
            >
              <span className="font-bold text-base text-text dark:text-dark-text">מנוגדת: {rel.opposite.letter}׳</span>
              <span className="block text-sm text-text-secondary dark:text-gray-400 mt-1">{rel.opposite.quality}</span>
            </button>
          )}
          {rel.complementary && (
            <button
              onClick={() => {
                const t = letters.find(l => l.character === rel.complementary.letter)
                if (t) onSelectLetter(t.id)
              }}
              className="w-full text-right px-4 py-3 bg-info/10 dark:bg-info/20 border border-info/20 dark:border-info/30 hover:bg-info/20 dark:hover:bg-info/30 transition-colors"
            >
              <span className="font-bold text-base text-text dark:text-dark-text">משלימה: {rel.complementary.letter}׳</span>
              <span className="block text-sm text-text-secondary dark:text-gray-400 mt-1">{rel.complementary.quality}</span>
            </button>
          )}
          {rel.reinforces?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {rel.reinforces.map((r, i) => (
                <span key={i} className="px-3 py-2 bg-warning/10 dark:bg-warning/20 border border-warning/20 text-sm text-text-secondary dark:text-gray-400">
                  מחזקת: {r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SectionSkill({ letter }) {
  if (!letter.skill) return <p className="text-base text-text-tertiary dark:text-gray-500 text-center py-8">מיומנות תתווסף בהמשך</p>

  return (
    <div className="bg-accent/5 dark:bg-accent-light/10 p-4 border border-accent/20 dark:border-accent-light/20">
      <h3 className="text-base font-bold text-accent dark:text-accent-light mb-1">
        מיומנות #{letter.skill.number}: {letter.skill.name}
      </h3>
      {letter.skill.hebrew_title && (
        <p className="text-lg font-bold text-text dark:text-dark-text">{letter.skill.hebrew_title}</p>
      )}
      {letter.skill.description && (
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1 leading-relaxed">{letter.skill.description}</p>
      )}
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex gap-2 items-start bg-white/60 dark:bg-dark-surface/60 p-2.5">
          <span className="font-bold text-text dark:text-dark-text shrink-0 w-14">זמן:</span>
          <span className="text-text-secondary dark:text-gray-400">{letter.skill.trigger_time}</span>
        </div>
        <div className="flex gap-2 items-start bg-white/60 dark:bg-dark-surface/60 p-2.5">
          <span className="font-bold text-text dark:text-dark-text shrink-0 w-14">פעולה:</span>
          <span className="text-text-secondary dark:text-gray-400">{letter.skill.action}</span>
        </div>
        <div className="flex gap-2 items-start bg-white/60 dark:bg-dark-surface/60 p-2.5">
          <span className="font-bold text-text dark:text-dark-text shrink-0 w-14">תוצאה:</span>
          <span className="text-text-secondary dark:text-gray-400">{letter.skill.outcome}</span>
        </div>
        {letter.skill.duration_minutes && (
          <div className="flex gap-2 items-start bg-white/60 dark:bg-dark-surface/60 p-2.5">
            <span className="font-bold text-text dark:text-dark-text shrink-0 w-14">משך:</span>
            <span className="text-text-secondary dark:text-gray-400">{letter.skill.duration_minutes} דקות</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionSpace({ letter }) {
  if (!letter.spatial_model) return <p className="text-base text-text-tertiary dark:text-gray-500 text-center py-8">מודל מרחבי יתווסף בהמשך</p>

  return (
    <div className="space-y-3">
      <div className="bg-surface/50 dark:bg-dark-bg/50 p-4 border border-border/30 dark:border-dark-border/30">
        <p className="text-sm text-text dark:text-dark-text leading-relaxed mb-3">{letter.spatial_model.architectural_principle}</p>
        <div className="space-y-1">
          <Detail label="ביטוי פיזי" value={letter.spatial_model.physical_expression} />
          <Detail label="סוג חדר" value={letter.spatial_model.room_type} />
          <Detail label="מקור אור" value={letter.spatial_model.light_source} />
          <Detail label="חומרים" value={letter.spatial_model.material_palette} />
        </div>
      </div>
      {letter.spatial_model.human_experience && (
        <div className="bg-accent/5 dark:bg-accent-light/10 p-3 border-r-4 border-accent dark:border-accent-light">
          <p className="text-sm text-accent dark:text-accent-light italic leading-relaxed">{letter.spatial_model.human_experience}</p>
        </div>
      )}
      {letter.spatial_model.visual_metaphor && (
        <p className="text-sm text-text-secondary dark:text-gray-400">
          <span className="font-bold">מטפורה:</span> {letter.spatial_model.visual_metaphor}
        </p>
      )}
    </div>
  )
}

function SectionPrompt({ letter, letterImages }) {
  const [copied, setCopied] = useState(false)
  const [archImage, setArchImage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`arch-image-${letter.id}`) || ''
    }
    return ''
  })

  useEffect(() => {
    setArchImage(localStorage.getItem(`arch-image-${letter.id}`) || '')
    setCopied(false)
  }, [letter.id])

  const LETTER_ARCH_DATA = {
    1: { role: 'The Beginning — unity, origin of all code', principle: 'Entry point with maximum height, direct light, freedom of movement', space: 'Minimalist entrance hall, white, open', light: 'Mediterranean morning light, northern or eastern', materials: 'White stone, sandstone, light wood', experience: 'A person standing at the threshold, open-faced, waiting', metaphor: 'The sea at dawn — infinite possibilities' },
    2: { role: 'Duality — container, choice, home', principle: 'Central division creating two equal spaces', space: 'Domestic room with central partition', light: 'Symmetrical lighting from both sides', materials: 'Gray and white in tension, smooth plaster', experience: 'Standing between two doors of equal size', metaphor: 'A crossroads with two equal paths' },
    3: { role: 'Reward of effort — movement, growth, bridge', principle: 'Descending water channel, earned comfort', space: 'Descent chamber with deep seating', light: 'Warm, contained, amber light', materials: 'Warm stone, flowing water, soft textiles', experience: 'Sitting in deep repose after effort', metaphor: 'A spring flowing downward into a quiet pool' },
  }

  const data = LETTER_ARCH_DATA[letter.id]
  const archPrompt = data
    ? `Design a minimalist architectural structure distilling the essence of the Hebrew letter ${letter.character} (${letter.english_name}). Archetypal role: ${data.role}. Architectural principle: ${data.principle}. Space type: ${data.space}. Light: ${data.light}. Materials: ${data.materials}. Human experience: ${data.experience}. Visual metaphor: ${data.metaphor}. Style: Mediterranean minimalism | Clean lines | Natural light | Pure architectural inspiration | Professional architecture photography | 16:9 | No text | No Hebrew characters.`
    : `Design a minimalist architectural structure distilling the essence of the Hebrew letter ${letter.character} (${letter.english_name}), letter number ${letter.id} of the Hebrew alphabet. This letter embodies a unique archetypal force expressed through space, light, and material. Style: Mediterranean minimalism | Clean lines | Natural light | Pure architectural inspiration | Professional architecture photography | 16:9 | No text | No Hebrew characters.`

  const role = letter.core?.archetypal_role || ''
  const oneLiner = letter.synthesis?.one_liner || ''
  const spatialPrinciple = letter.spatial_model?.architectural_principle || ''
  const humanExp = letter.spatial_model?.human_experience || ''

  const postText = `האות ${letter.character}׳ (${letter.hebrew_name}) — ${role || 'מהות'}. ${oneLiner ? `"${oneLiner}"` : ''} ${spatialPrinciple ? `העיקרון האדריכלי: ${spatialPrinciple}.` : ''} ${humanExp ? `החוויה: ${humanExp}.` : ''} מבנה מינימליסטי שמזקק את רוח האות למרחב מחייה.`

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleArchImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        setArchImage(dataUrl)
        localStorage.setItem(`arch-image-${letter.id}`, dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!letter.hasData) return <p className="text-base text-text-tertiary dark:text-gray-500 text-center py-8">פרומפט אדריכלי יתווסף בהמשך</p>

  return (
    <div className="space-y-3">
      {archImage && (
        <div className="relative -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-3">
          <img src={archImage} alt={`אדריכלות ${letter.hebrew_name}`} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-dark-surface/80 to-transparent" />
          <div className="absolute bottom-3 right-4">
            <h3 className="text-lg font-bold text-text dark:text-dark-text">{letter.character}׳ — השראה אדריכלית</h3>
          </div>
          <button
            onClick={() => { setArchImage(''); localStorage.removeItem(`arch-image-${letter.id}`) }}
            className="absolute top-2 left-2 px-2 py-1 bg-black/40 text-white/70 text-[10px] opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-black/60 transition-opacity backdrop-blur-sm"
          >
            הסר
          </button>
        </div>
      )}

      <div>
        <p className="text-xs text-text-secondary dark:text-gray-400 mb-2">פרומפט למבנה מינימליסטי המזקק את משמעות האות כהשראה אדריכלית</p>
        <div className="bg-white dark:bg-dark-bg p-4 text-sm leading-relaxed text-text dark:text-dark-text font-mono border border-border dark:border-dark-border max-h-[160px] overflow-y-auto" dir="ltr">
          {archPrompt}
        </div>
      </div>

      <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
        <button
          onClick={() => copy(archPrompt)}
          className="flex-1 py-1.5 text-xs text-gray-400 hover:text-accent-light hover:bg-white/5 transition-colors"
        >
          {copied ? 'הועתק!' : 'העתק פרומפט'}
        </button>
        <label className="flex-1 py-1.5 text-xs text-gray-400 hover:text-accent-light hover:bg-white/5 text-center cursor-pointer transition-colors">
          העלה תמונה
          <input type="file" accept="image/*" className="hidden" onChange={handleArchImageUpload} />
        </label>
      </div>

      <div className="border-t border-border/50 dark:border-dark-border/50 pt-3">
        <h4 className="text-sm font-bold text-text dark:text-dark-text mb-1">פוסט מסכם</h4>
        <div className="bg-accent/5 dark:bg-accent-light/10 p-3 text-sm text-text dark:text-dark-text leading-relaxed border border-accent/20 dark:border-accent-light/20" dir="rtl">
          {postText}
        </div>
        <button
          onClick={() => copy(postText)}
          className="mt-1 w-full py-1 text-[10px] text-gray-500 hover:text-accent-light hover:bg-white/5 transition-colors"
        >
          העתק פוסט
        </button>
      </div>
    </div>
  )
}

function SectionArticle({ letter }) {
  const [heroImage, setHeroImage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`article-hero-${letter.id}`) || localStorage.getItem(`arch-image-${letter.id}`) || ''
    }
    return ''
  })
  const [articleText, setArticleText] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`article-${letter.id}`) || ''
    }
    return ''
  })
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    setHeroImage(localStorage.getItem(`article-hero-${letter.id}`) || localStorage.getItem(`arch-image-${letter.id}`) || '')
    setArticleText(localStorage.getItem(`article-${letter.id}`) || '')
    setCopied(false)
    setIsEditing(false)
    setShowText(false)
  }, [letter.id])

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
      reader.onload = () => {
        setHeroImage(reader.result)
        localStorage.setItem(`article-hero-${letter.id}`, reader.result)
      }
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
        reader.onload = () => {
          setHeroImage(reader.result)
          localStorage.setItem(`article-hero-${letter.id}`, reader.result)
        }
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
            onClick={() => { setHeroImage(''); localStorage.removeItem(`article-hero-${letter.id}`) }}
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

export default function LetterCard({ letterId, onSelectLetter, letterImages }) {
  const { letters, getLetter } = useLetters()
  const letter = getLetter(letterId)
  const [activeSection, setActiveSection] = useState('overview')

  if (!letter) return <p className="text-text-secondary text-lg">אות לא נמצאה</p>

  const prevId = letterId > 1 ? letterId - 1 : 22
  const nextId = letterId < 22 ? letterId + 1 : 1
  const currentImage = letterImages.getImage(letter.id)

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
      case 'prompt': return <SectionPrompt letter={letter} letterImages={letterImages} />
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
          <SectionArticle letter={letter} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[500px]">
            {/* Image + Energetic below */}
            <div className="p-4 md:p-5 flex flex-col border-l border-border/50 dark:border-dark-border/50 bg-surface/20 dark:bg-dark-bg/20">
              {(() => {
                const anyImage = currentImage
                  || (typeof window !== 'undefined' && (localStorage.getItem(`article-hero-${letter.id}`) || localStorage.getItem(`arch-image-${letter.id}`)))
                  || null

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
