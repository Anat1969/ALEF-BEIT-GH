import { useState, useEffect, useRef } from 'react'
import Dashboard from './components/Dashboard'
import LetterCard from './components/LetterCard'
import Gallery from './components/Gallery'
import Network from './components/Network'
import Matrix from './components/Matrix'
import Workflow from './components/Workflow'
import { useLetterImages } from './hooks/useLetterImages'

const TABS = [
  { id: 'dashboard', label: 'לוח בקרה' },
  { id: 'letter', label: 'אות בודדת' },
  { id: 'gallery', label: 'גלריה' },
  { id: 'network', label: 'קשרים' },
  { id: 'matrix', label: 'מטריצה' },
  { id: 'workflow', label: 'סדר יום' },
]

const TAB_IDS = TABS.map(t => t.id)
const CHAT_URL = 'https://claude.ai/code/session_018qeN1AtEFMg9QwTCerHjo5'

// State lives in the URL hash (#tab or #letter/5) so "העתקת קישור" shares the exact view.
function readHash() {
  const [tab, letter] = window.location.hash.replace(/^#\/?/, '').split('/')
  return {
    tab: TAB_IDS.includes(tab) ? tab : null,
    letter: letter && Number(letter) >= 1 && Number(letter) <= 22 ? Number(letter) : null,
  }
}

const HEBREW_LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת'

const COLOR_MODES = [
  { id: 'gold', label: 'זהב' },
  { id: 'blue', label: 'כחול' },
  { id: 'bw', label: 'שחור-לבן' },
  { id: 'wb', label: 'לבן-שחור' },
]

function LandingPage({ onEnter }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const base = import.meta.env.BASE_URL

  return (
    <div className="relative min-h-[calc(100svh-3.5rem)] bg-dark-bg flex items-center justify-center overflow-hidden py-16" dir="rtl">
      {/* Video background — fullscreen, no frame, semi-transparent */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="landing-video absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
        src={`${base}landing-bg.mp4`}
      />
      <div className="absolute inset-0 bg-dark-bg/40 pointer-events-none" />

      <div className={`relative z-10 text-center px-6 transition-all duration-1500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mb-6">
          <span className="text-[120px] leading-none font-extralight text-gold">א</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-3">
          <span className="text-gold">22 אותיות</span>
        </h1>
        <p className="text-xl text-gray-400 mb-2">מערכת חיה</p>
        <p className="text-base text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
          חקירה רב-ממדית של האלף-בית העברי — מרחב, אנרגיה, קול, ואדריכלות.
          כל אות היא עולם שלם.
        </p>

        <button
          onClick={onEnter}
          className="px-10 py-4 bg-accent text-dark-bg font-bold text-lg tracking-wide hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 glow-gold"
        >
          כניסה למערכת
        </button>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-1 text-accent/30" aria-hidden="true">
          {HEBREW_LETTERS.split('').map((ch, i) => (
            <span key={i} className="text-sm font-light">{ch}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const initial = readHash()
  const [activeTab, setActiveTab] = useState(() => initial.tab || localStorage.getItem('app-tab') || 'dashboard')
  const [selectedLetterId, setSelectedLetterId] = useState(() => {
    if (initial.letter) return initial.letter
    const saved = localStorage.getItem('app-letter')
    return saved ? Number(saved) : null
  })
  const [showLanding, setShowLanding] = useState(() => !initial.tab && !localStorage.getItem('app-entered'))
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('app-color') || 'gold')
  const letterImages = useLetterImages()
  const menuRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    localStorage.setItem('app-color', colorMode)
    const el = document.documentElement
    el.classList.remove('color-gold', 'color-blue', 'color-bw', 'color-wb')
    if (colorMode !== 'gold') {
      el.classList.add(`color-${colorMode}`)
    }
  }, [colorMode])

  useEffect(() => {
    localStorage.setItem('app-tab', activeTab)
    const hash = activeTab === 'letter' ? `#letter/${selectedLetterId || 1}` : `#${activeTab}`
    if (window.location.hash !== hash) history.replaceState(null, '', hash)
    const label = TABS.find(t => t.id === activeTab)?.label
    document.title = label ? `${label} | 22 אותיות` : '22 אותיות'
    window.scrollTo({ top: 0 })
  }, [activeTab, selectedLetterId, showLanding])

  useEffect(() => {
    const onHash = () => {
      const { tab, letter } = readHash()
      if (letter) setSelectedLetterId(letter)
      if (tab) setActiveTab(tab)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Display settings live inside the A&I logo button, not as loose buttons in the bar.
  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    menu.items = [
      ...COLOR_MODES.map(mode => ({
        label: `תצוגה: ${mode.label}`,
        pressed: colorMode === mode.id,
        onSelect: () => setColorMode(mode.id),
      })),
      { label: 'מסך הפתיחה', onSelect: () => setShowLanding(true) },
    ]
  }, [colorMode, showLanding])

  const handleSelectLetter = (id) => {
    setSelectedLetterId(id)
    localStorage.setItem('app-letter', String(id))
    setActiveTab('letter')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onSelectLetter={handleSelectLetter} letterImages={letterImages} />
      case 'letter':
        return (
          <LetterCard
            letterId={selectedLetterId || 1}
            onSelectLetter={handleSelectLetter}
            letterImages={letterImages}
          />
        )
      case 'gallery':
        return <Gallery onSelectLetter={handleSelectLetter} letterImages={letterImages} />
      case 'network':
        return <Network onSelectLetter={handleSelectLetter} />
      case 'matrix':
        return <Matrix onSelectLetter={handleSelectLetter} />
      case 'workflow':
        return <Workflow />
      default:
        return <Dashboard onSelectLetter={handleSelectLetter} letterImages={letterImages} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg bg-texture relative">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-indigo-950/30 pointer-events-none" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 glass bar h-14 flex items-center justify-between gap-3 px-4 sm:px-6">
          <a
            href="#dashboard"
            onClick={(e) => { e.preventDefault(); setShowLanding(false); setActiveTab('dashboard') }}
            className="flex items-center gap-2 min-w-0 text-xl font-extrabold tracking-tight hover:opacity-80 transition-opacity"
            aria-label="22 אותיות, דף הבית"
          >
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="w-8 h-8 shrink-0" />
            <span className="text-gold whitespace-nowrap">22 אותיות</span>
            <span className="hidden sm:inline text-gray-500 font-normal text-sm opacity-60">מערכת חיה</span>
          </a>

          <ai-menu ref={menuRef} chat={CHAT_URL} />
        </header>

        <nav className="glass bar border-b border-white/10 sticky top-14 z-40" aria-label="ניווט תוכן">
          <div className="max-w-[1200px] mx-auto flex flex-wrap justify-center sm:justify-start gap-0 min-w-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setShowLanding(false); setActiveTab(tab.id) }}
                aria-current={!showLanding && activeTab === tab.id ? 'page' : undefined}
                className={`tab-btn
                  px-3 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold transition-all duration-150 border-b-2 whitespace-nowrap
                  ${!showLanding && activeTab === tab.id
                    ? 'text-accent border-accent'
                    : 'text-gray-400 border-transparent hover:text-dark-text hover:bg-white/5 opacity-60 hover:opacity-100'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {showLanding ? (
          <LandingPage onEnter={() => { localStorage.setItem('app-entered', '1'); setShowLanding(false) }} />
        ) : (
          <main className="max-w-[1200px] mx-auto p-4 sm:p-6 min-w-0">
            {renderContent()}
          </main>
        )}
      </div>
    </div>
  )
}
