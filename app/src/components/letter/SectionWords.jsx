import { useState } from 'react'
import { LANGUAGE_TABS } from './constants'
import RELATED_WORDS from '../../data/relatedWords'

export default function SectionWords({ letterId, character }) {
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
