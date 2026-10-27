import { useLetters } from '../hooks/useLetters'
import SKILLS_DATA from '../data/dailySkills'
import RichText, { MeaningBox } from './text/RichText'
import KNOWLEDGE from '../data/letterKnowledge'

// Gematria tiers: the content map groups letters by order of magnitude,
// and tile size grows with the tier so the structure reads before the labels.
const TIERS = [
  { id: 'units', label: 'אחדות', range: '1 עד 9', test: (g) => g < 10, size: 'tier-1' },
  { id: 'tens', label: 'עשרות', range: '10 עד 90', test: (g) => g >= 10 && g < 100, size: 'tier-2' },
  { id: 'hundreds', label: 'מאות', range: '100 עד 400', test: (g) => g >= 100, size: 'tier-3' },
]

// Distilled: insight up to 8 words, explanation up to 20.
const PILLARS = [
  { n: '01', label: 'חזון', insight: 'האלף-בית כ**מערכת חיה**.', explain: 'לכל אות **אור**, **חומר**, **קול** ותנועה משלה, כמו חדר בבניין.' },
  { n: '02', label: 'מטרה', insight: 'ללמוד אות **בגוף**, לא רק בראש.', explain: 'כל אות מתורגמת ל-**7 מימדים**, למרחב אדריכלי ולמיומנות יומית.' },
  { n: '03', label: 'שיטה', insight: '**ידע, הבנה, יישום** בכל אות.', explain: 'עובדה עם **מקור**, פרשנות שמסומנת כפרשנות, ו**פעולה** שאפשר לעשות היום.' },
]

function readLocalCounts() {
  let articles = 0
  let todayDone = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('article-') && localStorage.getItem(key)?.trim()) articles++
    }
    const todayKey = `workflow-${new Date().toLocaleDateString('en-CA')}`
    todayDone = JSON.parse(localStorage.getItem(todayKey) || '[]').length
  } catch {
    // Storage blocked: the page still renders with zeros.
  }
  return { articles, todayDone }
}

// The day runs 06:00 to 01:00, so minutes after midnight count as the end of the previous day.
function dayMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const t = h * 60 + m
  return t < 6 * 60 ? t + 24 * 60 : t
}

function currentSkill(now = new Date()) {
  const t = dayMinutes(`${now.getHours()}:${now.getMinutes()}`)
  const slots = SKILLS_DATA.map((s) => {
    const [from, to] = s.time.split('–')
    return { ...s, from: dayMinutes(from), to: dayMinutes(to) }
  })
  const active = slots.find((s) => t >= s.from && t < s.to)
  if (active) return { skill: active, state: 'now' }
  return { skill: slots[0], state: 'next' }
}

function LetterRing({ letters, onSelectLetter }) {
  const step = 360 / letters.length
  return (
    <div className="ring-stage" aria-label="22 האותיות, לחיצה פותחת את כרטיס האות">
      <div className="ring-floor" aria-hidden="true" />
      <div className="letter-ring">
        {letters.map((l, i) => (
          <button
            key={l.id}
            className="ring-tile"
            style={{ '--a': `${i * step}deg` }}
            onClick={() => onSelectLetter(l.id)}
            aria-label={`${l.name}, ${l.core?.archetypal_role || ''}`}
          >
            <span className="ring-glyph">{l.character}</span>
            <span className="ring-num">{l.gematria}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Home({ onSelectLetter, onNavigate, letterImages }) {
  const { letters } = useLetters()
  const withData = letters.filter((l) => l.hasData).length
  const withImage = letters.filter((l) => letterImages?.getAnyImage(l.id)).length
  const { articles, todayDone } = readLocalCounts()
  const { skill, state } = currentSkill()
  const skillLetter = letters.find((l) => l.character === skill.char)

  const tools = [
    { tab: 'dashboard', title: 'לוח בקרה', does: 'כל **22 האותיות** במבט אחד, עם תפקיד ומשפט מפתח.', gives: 'נקודת כניסה מהירה', stat: `${withData}/22 אותיות` },
    { tab: 'letter', title: 'כרטיס אות', does: '**ידע** עם מקורות, **הבנה** ו**יישום**, ואחריהם שפה, מרחב ומאמר.', gives: 'אות מהעובדה ועד הפעולה', stat: '3 שכבות' },
    { tab: 'gallery', title: 'גלריה', does: 'הדימוי **האדריכלי** של כל אות, זה לצד זה.', gives: 'השוואה חזותית', stat: `${withImage} תמונות` },
    { tab: 'relations', title: 'קשרים', does: '**חמש שיטות** מוכרות: א״ת ב״ש, מספר קטן, מוצא בפה, ספר יצירה וצורות סופיות.', gives: 'קשר עם כלל ומקור', stat: '5 שיטות' },
    { tab: 'workflow', title: 'סדר יום', does: 'מיומנות לכל אות, מ-**06:00** עד **01:00**.', gives: 'תרגול יומי שנשמר', stat: `${todayDone}/22 היום` },
  ]

  const results = [
    { label: 'אותיות עם נתונים מלאים', value: withData, max: 22 },
    { label: 'אותיות עם דימוי אדריכלי', value: withImage, max: 22 },
    { label: 'מאמרים שכתבת בדפדפן הזה', value: articles, max: 22 },
    { label: 'מיומנויות שבוצעו היום', value: todayDone, max: 22 },
  ]

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-text">
          <p className="eyebrow">22 אותיות · 7 מימדים · מערכת חיה אחת</p>
          <h1 className="home-title">
            כל אות
            <br />
            <span className="text-gold">היא חדר</span>
          </h1>
          <RichText
            as="p"
            className="home-lead"
            text="לכל אות: **מה ידוע** עליה ומאיפה, **מה זה אומר**, ו**מה עושים** עם זה היום."
          />
          <div className="home-cta">
            <button className="cta-solid" onClick={() => onSelectLetter(1)}>לפתוח את א׳</button>
            <button className="cta-line" onClick={() => onNavigate('dashboard')}>לכל האותיות</button>
          </div>
          <p className="home-hint">הטבעת מסתובבת לאט. לחיצה על אות פותחת את הכרטיס שלה.</p>
          <p className="home-source">
            <span className="label">מקור השראה</span>
            ספר יצירה (Sefer Yetzirah): "עשרים ושתים אותיות יסוד".
          </p>
        </div>
        <LetterRing letters={letters} onSelectLetter={onSelectLetter} />
      </section>

      <section className="now-card" aria-label="עכשיו בסדר היום">
        <span className="now-glyph" aria-hidden="true">{skill.char}</span>
        <div className="now-body">
          <span className="label">{state === 'now' ? 'עכשיו בסדר היום' : 'הבא בסדר היום'}</span>
          <p className="now-title">{skill.name}</p>
          <RichText as="p" className="now-action" text={`${skill.action}. **${skill.duration} דקות**, ${skill.time}.`} />
        </div>
        <div className="now-actions">
          <button className="cta-solid" onClick={() => onNavigate('workflow')}>לסדר היום</button>
          {skillLetter && <button className="cta-line" onClick={() => onSelectLetter(skillLetter.id)}>לכרטיס של {skill.char}׳</button>}
        </div>
      </section>

      <section className="demo" aria-labelledby="demo-h">
        <div className="section-head">
          <span className="eyebrow">איך זה עובד</span>
          <h2 id="demo-h" className="section-title">אות אחת, שלוש שכבות</h2>
          <p className="section-note">כך בנוי כל כרטיס. הדוגמה: א׳.</p>
        </div>
        <div className="layers">
          <div className="layer layer-fact">
            <span className="layer-label">1 · ידע · עובדה</span>
            <p className="layer-text">שם האות: {KNOWLEDGE['א'].nameMeaning}. {KNOWLEDGE['א'].sound}.</p>
            <p className="layer-source">מקור: {KNOWLEDGE['א'].nameSource}</p>
          </div>
          <div className="layer layer-read">
            <span className="layer-label">2 · הבנה · פרשנות</span>
            <RichText as="p" className="insight-line" text={KNOWLEDGE['א'].insight} />
            <RichText as="p" className="explain-line" text={KNOWLEDGE['א'].explain} />
          </div>
          <div className="layer layer-do">
            <span className="layer-label">3 · יישום · פעולה</span>
            <RichText as="p" className="layer-text" text={KNOWLEDGE['א'].action} />
          </div>
        </div>
        <button className="cta-solid demo-cta" onClick={() => onSelectLetter(1)}>לכרטיס המלא של א׳</button>
      </section>

      <section className="home-pillars" aria-label="חזון, מטרה ושיטה">
        {PILLARS.map((p) => (
          <div key={p.n} className="pillar">
            <span className="pillar-n">{p.n} · {p.label}</span>
            <RichText as="p" className="pillar-title" text={p.insight} />
            <RichText as="p" className="pillar-text" text={p.explain} />
          </div>
        ))}
      </section>

      <section className="meaning-row" aria-label="בעיה, פתרון ותובנה">
        <MeaningBox kind="problem" label="בעיה" text="אותיות נלמדות כ**סימנים מופשטים**, מנותקות מהגוף ומהמרחב." />
        <MeaningBox kind="solution" label="פתרון" text="כל אות מקבלת **חדר**, **מיומנות** ו**שעה** ביום." />
        <MeaningBox kind="insight" label="תובנה" text="**אות היא מקום**, לא רק סימן על דף." />
      </section>

      <section aria-labelledby="tools-h">
        <div className="section-head">
          <span className="eyebrow">כלים</span>
          <h2 id="tools-h" className="section-title">חמש עדשות על אותו מידע</h2>
        </div>
        <div className="tools-grid">
          {tools.map((t, i) => (
            <button key={t.tab} className="tool-card" onClick={() => onNavigate(t.tab)}>
              <span className="tool-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="tool-title">{t.title}</span>
              <RichText className="tool-does" text={t.does} />
              <span className="tool-foot">
                <span className="tool-gives">{t.gives}</span>
                <span className="tool-stat">{t.stat}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="city" aria-labelledby="city-h">
        <span className="eyebrow">מהעיר</span>
        <h2 id="city-h" className="section-title">א׳ היא היציאה אל הים</h2>
        <RichText
          as="p"
          className="city-text"
          text="בעיר זה הרגע שבו רחוב צפוף נפתח אל **הטיילת של אשדוד (Ashdod)** ואל **אופק פתוח**. כך נראית פתיחה בקנה מידה עירוני."
        />
        <button className="cta-line" onClick={() => onSelectLetter(1)}>לחדר של א׳</button>
      </section>

      <section aria-labelledby="results-h">
        <div className="section-head">
          <span className="eyebrow">תוצאות</span>
          <h2 id="results-h" className="section-title">מה כבר קיים במערכת</h2>
          <p className="section-note">נספר עכשיו מהנתונים ומהשמירה בדפדפן, לא מספרים קבועים.</p>
        </div>
        <div className="results">
          {results.map((r) => (
            <div key={r.label} className="result">
              <span className="label">{r.label}</span>
              <div className="result-row">
                <span className="result-value">{r.value}<small>/{r.max}</small></span>
              </div>
              <div className="result-bar" role="progressbar" aria-valuemin={0} aria-valuemax={r.max} aria-valuenow={r.value} aria-label={r.label}>
                <span style={{ width: `${Math.round((r.value / r.max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="map-h">
        <div className="section-head">
          <span className="eyebrow">מפת התוכן</span>
          <h2 id="map-h" className="section-title">22 האותיות לפי ערך</h2>
          <p className="section-note">גודל האות גדל עם סדר הגודל של הגימטריה: אחדות, עשרות ומאות.</p>
        </div>
        <div className="tiers">
          {TIERS.map((tier) => (
            <div key={tier.id} className="tier">
              <div className="tier-head">
                <span className="tier-label">{tier.label}</span>
                <span className="tier-range">{tier.range}</span>
              </div>
              <div className="tier-row">
                {letters.filter((l) => tier.test(l.gematria)).map((l) => (
                  <button key={l.id} className={`map-tile ${tier.size}`} onClick={() => onSelectLetter(l.id)}>
                    <span className="map-glyph">{l.character}</span>
                    <span className="map-name">{l.name}</span>
                    <span className="map-role">{l.core?.archetypal_role}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
