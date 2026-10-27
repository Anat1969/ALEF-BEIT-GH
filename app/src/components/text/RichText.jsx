// Text distillation standard (Claude-GH docs/ai-text-standard.md):
// **word** = highlighter mark, ==insight== = insight marker, numbers are
// bolded automatically in mono and isolated LTR so they read in RTL text.
// Latin runs (names, commands like --style raw) are isolated LTR so they don't flip in RTL.
const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|\d+(?:[:.,–\-/]\d+)*%?|(?:--)?[A-Za-z][A-Za-z0-9]*(?:[.-][A-Za-z0-9]+)*(?: (?:--)?[A-Za-z][A-Za-z0-9]*(?:[.-][A-Za-z0-9]+)*)*)/g
const LATIN = /^(?:--)?[A-Za-z]/

export default function RichText({ text, as: Tag = 'span', className = '' }) {
  if (!text) return null
  const parts = String(text).split(TOKEN).filter(Boolean)
  return (
    <Tag className={className}>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <mark key={i} className="rt-mark">{p.slice(2, -2)}</mark>
        if (p.startsWith('==') && p.endsWith('==')) return <mark key={i} className="rt-insight">{p.slice(2, -2)}</mark>
        if (/^\d/.test(p)) return <bdi key={i} className="rt-num">{p}</bdi>
        if (LATIN.test(p)) return <bdi key={i} dir="ltr">{p}</bdi>
        return p
      })}
    </Tag>
  )
}

// Meaning colors, the same everywhere: problem red, solution green, insight yellow.
export function MeaningBox({ kind, label, text }) {
  return (
    <div className={`meaning meaning-${kind}`}>
      <span className="meaning-label">{label}</span>
      <RichText text={text} as="p" className="meaning-text" />
    </div>
  )
}
