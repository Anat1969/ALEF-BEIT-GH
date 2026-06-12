export default function PageIntro({ title, subtitle, purpose, howToUse, example, tip }) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold text-text dark:text-dark-text mb-1">{title}</h2>
      {subtitle && <p className="text-lg text-text-secondary dark:text-gray-400 mb-4">{subtitle}</p>}

      <div className="bg-accent/5 dark:bg-accent-light/10 border border-accent/20 dark:border-accent-light/20 p-5 space-y-4">
        {purpose && (
          <div>
            <h3 className="text-sm font-bold text-accent dark:text-accent-light uppercase tracking-wider mb-1">למה זה קיים?</h3>
            <p className="text-base text-text dark:text-dark-text leading-relaxed">{purpose}</p>
          </div>
        )}
        {howToUse && (
          <div>
            <h3 className="text-sm font-bold text-accent dark:text-accent-light uppercase tracking-wider mb-1">איך להשתמש?</h3>
            <p className="text-base text-text dark:text-dark-text leading-relaxed">{howToUse}</p>
          </div>
        )}
        {example && (
          <div className="bg-white/60 dark:bg-dark-surface/60 p-3 border border-border/50 dark:border-dark-border/50">
            <h3 className="text-xs font-bold text-warning uppercase tracking-wider mb-1">דוגמה מעשית</h3>
            <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">{example}</p>
          </div>
        )}
        {tip && (
          <div className="flex gap-2 items-start bg-success/10 dark:bg-success/20 p-3">
            <span className="text-success text-lg shrink-0">*</span>
            <p className="text-sm text-text dark:text-dark-text leading-relaxed">{tip}</p>
          </div>
        )}
      </div>
    </div>
  )
}
