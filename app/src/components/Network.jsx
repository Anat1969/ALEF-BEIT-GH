import { useState } from 'react'
import { useLetters } from '../hooks/useLetters'
import PageIntro from './PageIntro'

const FILTERS = [
  { id: 'all', label: 'הכל' },
  { id: 'opposite', label: 'מנוגדות' },
  { id: 'complementary', label: 'משלימות' },
]

export default function Network({ onSelectLetter }) {
  const { letters } = useLetters()
  const [filter, setFilter] = useState('all')
  const [hoveredId, setHoveredId] = useState(null)

  const richLetters = letters.filter(l => l.hasData)

  const getEdges = () => {
    const edges = []
    richLetters.forEach(letter => {
      if (!letter.dimensions?.relationships) return
      const rel = letter.dimensions.relationships

      if (rel.opposite && (filter === 'all' || filter === 'opposite')) {
        const target = letters.find(l => l.character === rel.opposite.letter)
        if (target) {
          edges.push({
            from: letter.id,
            to: target.id,
            type: 'opposite',
            label: rel.opposite.quality,
          })
        }
      }

      if (rel.complementary && (filter === 'all' || filter === 'complementary')) {
        const target = letters.find(l => l.character === rel.complementary.letter)
        if (target) {
          edges.push({
            from: letter.id,
            to: target.id,
            type: 'complementary',
            label: rel.complementary.quality,
          })
        }
      }
    })
    return edges
  }

  const edges = getEdges()
  const cx = 350
  const cy = 250
  const radius = 200

  const getPos = (index, total) => {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  const isConnected = (id) => {
    if (!hoveredId) return false
    return edges.some(e => (e.from === hoveredId && e.to === id) || (e.to === hoveredId && e.from === id))
  }

  return (
    <div>
      <PageIntro
        title="קשרים בין אותיות"
        subtitle="רשת הקשרים: מנוגדות, משלימות, דומות קולית"
        purpose="כל אות לא עומדת לבדה — יש לה קשרים עם אותיות אחרות. אות מנוגדת מאזנת אותה, אות משלימה מעשירה אותה. רשת הקשרים מראה לך את המבנה הזה בצורה ויזואלית."
        howToUse="העבירי עכבר מעל אות כדי לראות את הקשרים שלה — קווים אדומים = ניגודיות, כחולים = השלמה. לחצי על אות לפתוח את הכרטיס שלה. השתמשי בכפתורי הסינון למעלה להתמקד בסוג קשר מסוים."
        example={`לדוגמה: א׳ (שקט) מנוגדת לש׳ (רעש) — אם תרגלת שקט בבוקר, אולי בערב הגיע הזמן לביטוי קולי חופשי.`}
        tip="נסי ללחוץ על 'מנוגדות' בלבד — תגלי איזה זוגות מאזנים זה את זה. זה עוזר לבנות תוכנית תרגול יומית שמכילה גם שקט וגם פעולה."
      />

      <div className="flex gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`
              px-5 py-2.5 text-base rounded-lg border transition-colors
              ${filter === f.id
                ? 'bg-accent dark:bg-accent-light text-white border-accent dark:border-accent-light'
                : 'border-border dark:border-dark-border text-text-secondary dark:text-gray-400 hover:bg-surface dark:hover:bg-dark-surface'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="border border-border dark:border-dark-border rounded-xl p-4 bg-white dark:bg-dark-surface overflow-x-auto transition-colors">
        <svg viewBox="0 0 700 500" className="w-full max-w-[700px] mx-auto">
          {edges.map((edge, i) => {
            const fromPos = getPos(edge.from - 1, 22)
            const toPos = getPos(edge.to - 1, 22)
            const color = edge.type === 'opposite' ? '#E24B4A' : '#378ADD'
            const isHighlighted = hoveredId && (edge.from === hoveredId || edge.to === hoveredId)
            return (
              <line
                key={i}
                x1={fromPos.x} y1={fromPos.y}
                x2={toPos.x} y2={toPos.y}
                stroke={color}
                strokeWidth={isHighlighted ? 3 : 1.5}
                strokeOpacity={hoveredId ? (isHighlighted ? 0.9 : 0.15) : 0.5}
                style={{ transition: 'stroke-width 0.2s, stroke-opacity 0.2s' }}
              />
            )
          })}

          {letters.map((letter, i) => {
            const pos = getPos(i, 22)
            const isRich = letter.hasData
            const isHovered = hoveredId === letter.id
            const connected = isConnected(letter.id)
            const dimmed = hoveredId && !isHovered && !connected
            return (
              <g
                key={letter.id}
                className="cursor-pointer"
                onClick={() => onSelectLetter(letter.id)}
                onMouseEnter={() => setHoveredId(letter.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ opacity: dimmed ? 0.3 : 1, transition: 'opacity 0.2s' }}
              >
                <circle
                  cx={pos.x} cy={pos.y}
                  r={isHovered ? 28 : (isRich ? 24 : 18)}
                  fill={isRich ? '#2A5F5F' : 'var(--color-surface, #F5F5F5)'}
                  stroke={isHovered ? '#4DBBA0' : (isRich ? '#2A5F5F' : 'var(--color-border, #E0E0E0)')}
                  strokeWidth={isHovered ? 2.5 : 1}
                  style={{ transition: 'r 0.2s, stroke-width 0.2s' }}
                />
                <text
                  x={pos.x} y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isRich ? 'white' : 'var(--color-text-tertiary, #999)'}
                  fontSize={isHovered ? 16 : 14}
                  fontFamily="Rubik, sans-serif"
                  style={{ transition: 'font-size 0.2s' }}
                >
                  {letter.character}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm text-text-tertiary dark:text-gray-500">
        <span className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-danger inline-block"></span>
          מנוגדות
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-info inline-block"></span>
          משלימות
        </span>
      </div>
    </div>
  )
}
