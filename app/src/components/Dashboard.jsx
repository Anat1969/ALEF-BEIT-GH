import { useLetters } from '../hooks/useLetters'
import PageIntro from './PageIntro'

export default function Dashboard({ onSelectLetter }) {
  const { letters } = useLetters()

  const readyCount = letters.filter(l => l.hasData).length

  return (
    <div>
      <PageIntro
        title="לוח בקרה"
        subtitle={`22 אותיות, 7 מימדים, מערכת חיה אחת`}
        purpose="זהו מפת הכניסה שלך למערכת. כל ריבוע מייצג אות עברית אחת — מערכת שלמה של ידע, תרגול ויצירה. מכאן את בוחרת לאיזו אות לצלול."
        howToUse="לחצי על אות כלשהי כדי לראות את הכרטיס המלא שלה — כולל 7 מימדים, מיומנות יומית, קשרים, ונתוני יצירה. אותיות עם רקע לבן כבר מכילות נתונים מלאים, אפורות ממתינות להשלמה."
        example={`לדוגמה: לחצי על א׳ כדי לגלות שהיא מייצגת "נשימה ראשונה" — הצליל הכי שקט שקיים, עם תרגול יומי של 5 דקות נשימה ב-06:00.`}
        tip={`${readyCount} מתוך 22 אותיות מוכנות כרגע. גם עם 3 אותיות אפשר כבר להתחיל את התרגול היומי.`}
      />

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3">
        {letters.map(letter => (
          <button
            key={letter.id}
            onClick={() => onSelectLetter(letter.id)}
            className={`
              group aspect-square border
              flex flex-col items-center justify-center gap-1
              transition-all duration-200
              hover:border-accent dark:hover:border-accent-light hover:-translate-y-px hover:shadow-sm
              ${letter.hasData
                ? 'glass-card'
                : 'bg-white/3 border border-white/5'
              }
            `}
          >
            <span className="text-4xl font-medium text-text dark:text-dark-text group-hover:text-accent dark:group-hover:text-accent-light transition-colors">
              {letter.character}
            </span>
            <span className="text-xs text-text-tertiary dark:text-gray-500">{letter.name}</span>
            <span className="text-[11px] text-muted dark:text-gray-600">{letter.gematria}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-6 text-sm text-text-tertiary dark:text-gray-500">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-white dark:bg-dark-surface border border-border dark:border-dark-border inline-block"></span>
          נתונים מלאים ({readyCount})
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-surface dark:bg-dark-bg border border-border dark:border-dark-border inline-block"></span>
          ממתין להשלמה ({22 - readyCount})
        </span>
      </div>
    </div>
  )
}
