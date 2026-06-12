import { useLetters } from '../hooks/useLetters'
import PageIntro from './PageIntro'

export default function Matrix({ onSelectLetter }) {
  const { letters } = useLetters()

  const getRelation = (from, to) => {
    if (from.id === to.id) return { type: 'self', label: '' }
    if (!from.hasData || !from.dimensions?.relationships) return { type: 'none', label: '' }

    const rel = from.dimensions.relationships
    if (rel.opposite?.letter === to.character) {
      return { type: 'opposite', label: rel.opposite.quality }
    }
    if (rel.complementary?.letter === to.character) {
      return { type: 'complementary', label: rel.complementary.quality }
    }
    if (rel.sonic_similar?.some(s => s.includes(to.character))) {
      return { type: 'sonic', label: 'דומה קולית' }
    }
    if (rel.reinforces?.some(s => s.includes(to.character))) {
      return { type: 'reinforces', label: 'מחזקת' }
    }
    return { type: 'none', label: '' }
  }

  const cellColor = (type) => {
    switch (type) {
      case 'self': return 'bg-accent/20 dark:bg-accent-light/20'
      case 'opposite': return 'bg-danger/20 hover:bg-danger/30 dark:bg-danger/30 dark:hover:bg-danger/40'
      case 'complementary': return 'bg-info/20 hover:bg-info/30 dark:bg-info/30 dark:hover:bg-info/40'
      case 'sonic': return 'bg-success/20 hover:bg-success/30 dark:bg-success/30 dark:hover:bg-success/40'
      case 'reinforces': return 'bg-warning/20 hover:bg-warning/30 dark:bg-warning/30 dark:hover:bg-warning/40'
      default: return 'hover:bg-surface dark:hover:bg-dark-surface'
    }
  }

  return (
    <div>
      <PageIntro
        title="מטריצת קשרים"
        subtitle="קשרים בין כל זוג אותיות — מנוגדות, משלימות, דומות"
        purpose="המטריצה מציגה מבט-על על כל הקשרים בין 22 האותיות — מי מנוגדת למי, מי משלימה את מי, ומי דומה קולית. זה כלי לזהות דפוסים ולבנות תוכנית תרגול מאוזנת."
        howToUse="חפשי תאים צבעוניים — כל צבע מייצג סוג קשר אחר. העבירי עכבר מעל תא כדי לראות את סוג הקשר בפירוט. לחצי על אות (שורה או עמודה) כדי לעבור לכרטיס שלה."
        example={`לדוגמה: חפשי את השורה של א׳ — תראי ⊗ אדום מול ש׳ (ניגוד שקט/רעש), ◎ כחול מול ב׳ (השלמת אחדות/ריבוי). זה אומר שביום שעובדים עם א׳, כדאי לאזן עם ש׳ ולהעשיר עם ב׳.`}
        tip="השתמשי במטריצה כדי לתכנן שבוע שלם — בחרי 3-4 אותיות שמשלימות זו את זו ותרגלי אותן יחד."
      />

      <div className="overflow-x-auto border border-border dark:border-dark-border">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky right-0 bg-white dark:bg-dark-bg z-10 p-1.5 border border-border dark:border-dark-border w-9"></th>
              {letters.map(l => (
                <th
                  key={l.id}
                  className="p-1.5 border border-border dark:border-dark-border font-medium text-text-secondary dark:text-gray-400 cursor-pointer hover:bg-surface dark:hover:bg-dark-surface w-9 h-9 text-sm"
                  onClick={() => onSelectLetter(l.id)}
                >
                  {l.character}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {letters.map(row => (
              <tr key={row.id}>
                <td
                  className="sticky right-0 bg-white dark:bg-dark-bg z-10 p-1.5 border border-border dark:border-dark-border font-medium text-text-secondary dark:text-gray-400 cursor-pointer hover:bg-surface dark:hover:bg-dark-surface text-center text-sm"
                  onClick={() => onSelectLetter(row.id)}
                >
                  {row.character}
                </td>
                {letters.map(col => {
                  const relation = getRelation(row, col)
                  return (
                    <td
                      key={col.id}
                      className={`p-1.5 border border-border dark:border-dark-border text-center cursor-pointer transition-colors w-9 h-9 ${cellColor(relation.type)}`}
                      title={relation.label}
                      onClick={() => onSelectLetter(col.id)}
                    >
                      {relation.type === 'self' && '●'}
                      {relation.type === 'opposite' && '⊗'}
                      {relation.type === 'complementary' && '◎'}
                      {relation.type === 'sonic' && '♪'}
                      {relation.type === 'reinforces' && '↗'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-text-tertiary dark:text-gray-500">
        <span className="flex items-center gap-2"><span className="w-4 h-4 bg-danger/20 dark:bg-danger/30 inline-block"></span> ⊗ מנוגדות</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 bg-info/20 dark:bg-info/30 inline-block"></span> ◎ משלימות</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 bg-success/20 dark:bg-success/30 inline-block"></span> ♪ דומות קולית</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 bg-warning/20 dark:bg-warning/30 inline-block"></span> ↗ מחזקות</span>
      </div>
    </div>
  )
}
