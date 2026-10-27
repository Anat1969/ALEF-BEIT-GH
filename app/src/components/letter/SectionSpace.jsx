import Detail from './Detail'

export default function SectionSpace({ letter }) {
  if (!letter.spatial_model) return <p className="text-base text-text-tertiary dark:text-gray-500 text-center py-8">מודל מרחבי יתווסף בהמשך</p>

  return (
    <div className="space-y-3">
      <div className="bg-surface/50 dark:bg-dark-bg/50 p-4 border border-border/30 dark:border-dark-border/30">
        <p className="text-sm text-text dark:text-dark-text leading-relaxed mb-3">{letter.spatial_model.architectural_principle}</p>
        <div className="space-y-1">
          <Detail label="ביטוי פיזי" value={letter.spatial_model.physical_expression} />
          <Detail label="סוג חדר" value={letter.spatial_model.room_type} />
          <Detail label="מקור אור" value={letter.spatial_model.light_source} />
          <Detail label="חומרים" value={letter.spatial_model.material_palette} />
        </div>
      </div>
      {letter.spatial_model.human_experience && (
        <div className="bg-accent/5 dark:bg-accent-light/10 p-3 border-r-4 border-accent dark:border-accent-light">
          <p className="text-sm text-accent dark:text-accent-light italic leading-relaxed">{letter.spatial_model.human_experience}</p>
        </div>
      )}
      {letter.spatial_model.visual_metaphor && (
        <p className="text-sm text-text-secondary dark:text-gray-400">
          <span className="font-bold">מטפורה:</span> {letter.spatial_model.visual_metaphor}
        </p>
      )}
    </div>
  )
}
