import { useLetters } from '../hooks/useLetters'
import { currentSkill } from '../data/dailySkills'
import RichText, { MeaningBox } from './text/RichText'
import KNOWLEDGE from '../data/letterKnowledge'
import POWER from '../data/letterPower'

// Gematria tiers: the content map groups letters by order of magnitude,
// and tile size grows with the tier so the structure reads before the labels.
const TIERS = [
  { id: 'units', label: 'אחדות', range: '1 עד 9', test: (g) => g < 10, size: 'tier-1' },
  { id: 'tens', label: 'עשרות', range: '10 עד 90', test: (g) => g >= 10 && g < 100, size: 'tier-2' },
  { id: 'hundreds', label: 'מאות', range: '100 עד 400', test: (g) => g >= 100, size: 'tier-3' },
]

// Distilled: insight up to 8 words, explanation up to 20.
const PILLARS = [
  { n: '01', label: 'חזון', insight: 'לכל אות יש **כוח**.', explain: '22 כוחות שבונים יחד עולם אחד, כמו **22 חדרים** בבניין אחד.' },
  { n: '02', label: 'מטרה', insight: 'לזהות את הכוח, ו**להטות אותו לחיוב**.', explain: 'לכל כוח **שני כיוונים**: אחדות או איבה, טהרה או טומאה. הבחירה בידינו.' },
  { n: '03', label: 'שיטה', insight: '**כוח, סדר, יישום** בכל אות.', explain: 'הכוח בשני כיוונים, המקום שלו ב**סדר האותיות**, ומעשה שאפשר לעשות היום.' },
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
    { tab: 'letter', title: 'כרטיס אות', does: 'ה**כוח** בשני כיוונים, ה**ידע** עם מקורות, וה**יישום** להיום.', gives: 'אות מהכוח ועד המעשה', stat: '22 כוחות' },
    { tab: 'sequence', title: 'הסדר', does: 'למה האותיות מסודרות כך: **המסע** של שבת קד, **המדרגות** והסימנים.', gives: 'האות שלפני ושאחרי', stat: '11 צעדים' },
    { tab: 'gallery', title: 'גלריה', does: 'הדימוי **האדריכלי** של כל אות, זה לצד זה.', gives: 'השוואה חזותית', stat: `${withImage} תמונות` },
    { tab: 'relations', title: 'קשרים', does: '**חמש שיטות** מוכרות: א״ת ב״ש, מספר קטן, מוצא בפה, ספר יצירה וצורות סופיות.', gives: 'קשר עם כלל ומקור', stat: '5 שיטות' },
    { tab: 'poetics', title: 'פואטיקה', does: '**שיר** ו**פוסט** לכל אות, מוכנים להעתקה.', gives: 'הכוח במילים', stat: '44 טקסטים' },
    { tab: 'workflow', title: 'סדר יום', does: 'לכל שעה **מחשבה**, **מעשה** ו**רישום**, מ-06:00 עד 01:00.', gives: 'יומן שנשמר', stat: `${todayDone}/22 היום` },
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
            text="לכל אות **כוח**, ולכל כוח **שני כיוונים**: אחדות או איבה, טהרה או טומאה. כאן לומדים לזהות אותו, ולהטות אותו לחיוב."
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
          <h2 id="demo-h" className="section-title">אות אחת: כוח, ידע ומעשה</h2>
          <p className="section-note">כך בנוי כל כרטיס. הדוגמה: א׳.</p>
        </div>
        <div className="power-poles demo-poles">
          <MeaningBox kind="solution" label={`${POWER['א'].power} · לחיוב · ${POWER['א'].plus.word}`} text={POWER['א'].plus.line} />
          <MeaningBox kind="problem" label={`${POWER['א'].power} · לשלילה · ${POWER['א'].minus.word}`} text={POWER['א'].minus.line} />
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
        <MeaningBox kind="problem" label="בעיה" text="אותיות נלמדות כ**סימנים מופשטים**, בלי הכוח שבהן." />
        <MeaningBox kind="solution" label="פתרון" text="לכל אות **כוח**, **מקור** ו**מעשה** בשעה קבועה ביום." />
        <MeaningBox kind="insight" label="תובנה" text="**אותו כוח** בונה או הורס. הכיוון הוא בחירה." />
      </section>

      <section aria-labelledby="tools-h">
        <div className="section-head">
          <span className="eyebrow">כלים</span>
          <h2 id="tools-h" className="section-title">שבע עדשות על אותו מידע</h2>
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
