import RichText from './text/RichText'

// Distilled intro: an insight line (up to 8 words), one explanation sentence
// (up to 20 words), then how to use, an example and a tip. Text uses RichText.
export default function PageIntro({ title, subtitle, insight, explain, howToUse, example, tip }) {
  return (
    <div className="mb-10">
      <h2 className="page-title">{title}</h2>
      {subtitle && <p className="text-lg text-text-secondary dark:text-gray-400 mb-4">{subtitle}</p>}

      <div className="glass depth p-5 space-y-4">
        {insight && (
          <div>
            <span className="label">למה זה קיים</span>
            <RichText text={insight} as="p" className="insight-line" />
            {explain && <RichText text={explain} as="p" className="explain-line" />}
          </div>
        )}
        {howToUse && (
          <div>
            <span className="label">איך משתמשים</span>
            <RichText text={howToUse} as="p" className="text-base text-text dark:text-dark-text leading-relaxed" />
          </div>
        )}
        {example && (
          <div className="bg-white/60 dark:bg-dark-surface/60 p-3 border border-border/50 dark:border-dark-border/50">
            <span className="label">דוגמה</span>
            <RichText text={example} as="p" className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed" />
          </div>
        )}
        {tip && (
          <div className="meaning meaning-insight">
            <span className="meaning-label">טיפ</span>
            <RichText text={tip} as="p" className="meaning-text" />
          </div>
        )}
      </div>
    </div>
  )
}
