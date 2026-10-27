export default function SectionSkill({ letter }) {
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
