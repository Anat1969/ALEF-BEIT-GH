import { useLetters } from '../hooks/useLetters'

// Gematria tiers: the content map groups letters by order of magnitude,
// and tile size grows with the tier so the structure reads before the labels.
const TIERS = [
  { id: 'units', label: 'אחדות', range: '1 עד 9', test: (g) => g < 10, size: 'tier-1' },
  { id: 'tens', label: 'עשרות', range: '10 עד 90', test: (g) => g >= 10 && g < 100, size: 'tier-2' },
  { id: 'hundreds', label: 'מאות', range: '100 עד 400', test: (g) => g >= 100, size: 'tier-3' },
]

const PILLARS = [
  {
    n: '01',
    title: 'חזון',
    text: 'האלף-בית העברי כמערכת חיה: כל אות היא חדר עם אור, חומר, קול ותנועה משלו.',
  },
  {
    n: '02',
    title: 'מטרה',
    text: 'לתרגם כל אות לשבעה מימדים, למרחב אדריכלי ולמיומנות יומית, כך שאפשר ללמוד אותה, להרגיש אותה ולתרגל אותה.',
  },
  {
    n: '03',
    title: 'שיטה',
    text: 'מקור נתונים אחד לכל 22 האותיות. כל מסך הוא עדשה אחרת על אותו מידע: כרטיס, גלריה, רשת, מטריצה וסדר יום.',
  },
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

  const tools = [
    { tab: 'dashboard', title: 'לוח בקרה', does: 'כל 22 האותיות במבט אחד, עם תפקיד ומשפט מפתח לכל אחת.', gives: 'נקודת כניסה מהירה לאות', stat: `${withData}/22 אותיות` },
    { tab: 'letter', title: 'כרטיס אות', does: 'שמונה מקטעים: סקירה, מימדים, שפה, קשרים, מיומנות, מודל מרחבי, אדריכלות ומאמר.', gives: 'הבנה מלאה של אות אחת', stat: '8 מקטעים' },
    { tab: 'gallery', title: 'גלריה', does: 'הדימוי האדריכלי של כל אות, זו לצד זו.', gives: 'השוואה חזותית בין אותיות', stat: `${withImage} תמונות` },
    { tab: 'network', title: 'קשרים', does: 'רשת של אותיות מנוגדות, משלימות ודומות בקול.', gives: 'מי מושכת את מי', stat: '3 סוגי קשר' },
    { tab: 'matrix', title: 'מטריצה', does: 'כל זוג אותיות בטבלה אחת, לפי סוג הקשר ביניהן.', gives: 'מבנה המערכת כולה', stat: '22 על 22' },
    { tab: 'workflow', title: 'סדר יום', does: 'מיומנות לכל אות, משש בבוקר עד אחת בלילה. מסמנים מה בוצע.', gives: 'תרגול יומי שנשמר', stat: `${todayDone}/22 היום` },
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
        <video
          className="landing-video home-video"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          src={`${import.meta.env.BASE_URL}landing-bg.mp4`}
        />
        <div className="home-hero-text">
          <p className="eyebrow">22 אותיות · 7 מימדים · מערכת חיה אחת</p>
          <h1 className="home-title">
            כל אות
            <br />
            <span className="text-gold">היא חדר</span>
          </h1>
          <p className="home-lead">
            חקירה רב-ממדית של האלף-בית העברי: מרחב, אנרגיה, קול ואדריכלות. בוחרים אות, נכנסים לחדר שלה, ומתרגלים אותה ביום יום.
          </p>
          <div className="home-cta">
            <button className="cta-solid" onClick={() => onSelectLetter(1)}>לפתוח את א׳</button>
            <button className="cta-line" onClick={() => onNavigate('dashboard')}>לכל האותיות</button>
          </div>
          <p className="home-hint">הטבעת מסתובבת לאט. לחיצה על אות פותחת את הכרטיס שלה.</p>
        </div>
        <LetterRing letters={letters} onSelectLetter={onSelectLetter} />
      </section>

      <section className="home-pillars" aria-label="חזון, מטרה ושיטה">
        {PILLARS.map((p) => (
          <div key={p.n} className="pillar">
            <span className="pillar-n">{p.n}</span>
            <h2 className="pillar-title">{p.title}</h2>
            <p className="pillar-text">{p.text}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="tools-h">
        <div className="section-head">
          <span className="eyebrow">כלים</span>
          <h2 id="tools-h" className="section-title">שש עדשות על אותו מידע</h2>
        </div>
        <div className="tools-grid">
          {tools.map((t, i) => (
            <button key={t.tab} className="tool-card" onClick={() => onNavigate(t.tab)}>
              <span className="tool-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="tool-title">{t.title}</span>
              <span className="tool-does">{t.does}</span>
              <span className="tool-foot">
                <span className="tool-gives">{t.gives}</span>
                <span className="tool-stat">{t.stat}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="results-h">
        <div className="section-head">
          <span className="eyebrow">תוצאות</span>
          <h2 id="results-h" className="section-title">מה כבר קיים במערכת</h2>
          <p className="section-note">נספר עכשיו מתוך הנתונים ומהשמירה בדפדפן, לא מספרים קבועים.</p>
        </div>
        <div className="results">
          {results.map((r) => (
            <div key={r.label} className="result">
              <div className="result-row">
                <span className="result-label">{r.label}</span>
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
