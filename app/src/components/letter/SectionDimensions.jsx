import { useState } from 'react'
import { DIMENSION_CATEGORIES } from './constants'
import Detail from './Detail'

function DimItem({ dimKey, value, label, isOpen, onToggle }) {
  const fieldMap = {
    sonic: ['articulation', 'texture', 'breath_quality'],
    mathematical: ['function', 'ratio', 'pattern_role'],
    physical: ['body_posture', 'movement_quality', 'tension_state'],
    psychological: ['emotional_state', 'will_expression', 'archetypal_mood'],
    spatial: ['angle', 'line_type', 'color_palette', 'position_in_space', 'light_quality'],
    visual: ['color_experience', 'light_impression', 'visual_metaphor'],
    tactile: ['temperature', 'texture_feel', 'body_sensation'],
    physics: ['principle', 'analogy', 'state'],
    temporal: ['time_quality', 'rhythm', 'cycle_position'],
  }
  const fieldLabels = {
    articulation: 'ארטיקולציה', texture: 'מרקם', breath_quality: 'איכות נשימה',
    function: 'פונקציה', ratio: 'יחס', pattern_role: 'תפקיד בדפוס',
    body_posture: 'תנוחת גוף', movement_quality: 'איכות תנועה', tension_state: 'מצב מתח',
    emotional_state: 'מצב רגשי', will_expression: 'ביטוי רצון', archetypal_mood: 'אווירה ארכיטיפית',
    angle: 'זווית', line_type: 'קו', color_palette: 'פלטת צבעים',
    position_in_space: 'מיקום במרחב', light_quality: 'איכות אור',
    color_experience: 'חוויית צבע', light_impression: 'רושם אור', visual_metaphor: 'מטפורה ויזואלית',
    temperature: 'טמפרטורה', texture_feel: 'מרקם', body_sensation: 'תחושה גופנית',
    principle: 'עיקרון', analogy: 'אנלוגיה', state: 'מצב',
    time_quality: 'איכות זמן', rhythm: 'קצב', cycle_position: 'מיקום במחזור',
    flow_direction: 'כיוון זרימה', expansion_type: 'סוג התרחבות',
  }
  const fields = fieldMap[dimKey] || Object.keys(value).filter(k => k !== 'description')

  return (
    <div className="border border-border/40 dark:border-dark-border/40 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 text-right hover:bg-surface/50 dark:hover:bg-dark-bg/50 transition-colors"
      >
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}>◀</span>
        <div className="flex-1 mr-2">
          <span className="text-sm font-medium text-text dark:text-dark-text">{label}</span>
          <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5 line-clamp-1">{value.description}</p>
        </div>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 space-y-1 bg-surface/30 dark:bg-dark-bg/30 border-t border-border/30 dark:border-dark-border/30 pt-2">
          <p className="text-sm text-text dark:text-dark-text leading-relaxed mb-2">{value.description}</p>
          {fields.map(f => <Detail key={f} label={fieldLabels[f]} value={value[f]} />)}
        </div>
      )}
    </div>
  )
}
export default function SectionDimensions({ letter }) {
  const [openDim, setOpenDim] = useState(null)
  const [openCat, setOpenCat] = useState(null)
  if (!letter.dimensions) return null

  return (
    <div className="space-y-3">
      <div className="meaning meaning-insight">
        <span className="meaning-label">שכבת מחקר</span>
        <p className="meaning-text">תיאורים חושיים מהאפיון המקורי. הם פרשנות ולא עובדה. העובדות והמקורות נמצאים ב"ידע, הבנה, יישום".</p>
      </div>
      {DIMENSION_CATEGORIES.map(cat => {
        const hasDims = cat.dims.some(d => letter.dimensions[d.key])
        if (!hasDims) return null
        const isCatOpen = openCat === cat.id

        return (
          <div key={cat.id} className="border border-border/50 dark:border-dark-border/50 overflow-hidden">
            <button
              onClick={() => setOpenCat(isCatOpen ? null : cat.id)}
              className="w-full flex items-center justify-between p-3 text-right bg-accent/5 dark:bg-accent-light/10 hover:bg-accent/10 dark:hover:bg-accent-light/15 transition-colors"
            >
              <span className={`text-sm transition-transform ${isCatOpen ? 'rotate-90' : ''}`}>◀</span>
              <span className="flex-1 mr-2 text-base font-bold text-accent dark:text-accent-light">{cat.title}</span>
            </button>
            {isCatOpen && (
              <div className="p-3 space-y-2">
                {cat.dims.map(d => {
                  const value = letter.dimensions[d.key]
                  if (!value) return null
                  return (
                    <DimItem
                      key={d.key}
                      dimKey={d.key}
                      value={value}
                      label={d.label}
                      isOpen={openDim === d.key}
                      onToggle={() => setOpenDim(openDim === d.key ? null : d.key)}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
