import { useState } from 'react'

export default function SectionOverview({ letter }) {
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
