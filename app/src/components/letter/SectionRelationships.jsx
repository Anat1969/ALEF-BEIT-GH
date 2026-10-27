import { RELATIONSHIP_TYPES } from './constants'

export default function SectionRelationships({ letter, letters, onSelectLetter }) {
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
