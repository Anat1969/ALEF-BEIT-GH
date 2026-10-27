import { useState } from 'react'

export default function SectionPrompt({ letter, letterImages }) {
  const [copied, setCopied] = useState(false)
  const archImage = letterImages.getArchImage(letter.id) || ''

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
        letterImages.saveArchImage(letter.id, reader.result)
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
            onClick={() => letterImages.removeArchImage(letter.id)}
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
