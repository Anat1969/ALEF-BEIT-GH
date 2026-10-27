import { useState, useEffect, useRef } from 'react'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import LetterCard from './components/LetterCard'
import Gallery from './components/Gallery'
import Relations from './components/Relations'
import Workflow from './components/Workflow'
import { useLetterImages } from './hooks/useLetterImages'

const TABS = [
  { id: 'home', label: 'בית' },
  { id: 'dashboard', label: 'לוח בקרה' },
  { id: 'letter', label: 'אות בודדת' },
  { id: 'gallery', label: 'גלריה' },
  { id: 'relations', label: 'קשרים' },
  { id: 'workflow', label: 'סדר יום' },
]

const TAB_IDS = TABS.map(t => t.id)
const LETTER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400]
const CHAT_URL = 'https://claude.ai/code/session_018qeN1AtEFMg9QwTCerHjo5'

// State lives in the URL hash (#tab or #letter/5) so "העתקת קישור" shares the exact view.
function readHash() {
  const [rawTab, letter] = window.location.hash.replace(/^#\/?/, '').split('/')
  // Old links to the two relationship screens open the merged one
  const tab = rawTab === 'network' || rawTab === 'matrix' ? 'relations' : rawTab
  return {
    tab: TAB_IDS.includes(tab) ? tab : null,
    // Letter ids are gematria values (1..10, 20..90, 100..400)
    letter: LETTER_IDS.includes(Number(letter)) ? Number(letter) : null,
  }
}

// Light is the default; night is the earlier dark look.
const COLOR_MODES = [
  { id: 'day', label: 'בהיר' },
  { id: 'night', label: 'כהה' },
]

export default function App() {
  const initial = readHash()
  const [activeTab, setActiveTab] = useState(() => initial.tab || localStorage.getItem('app-tab') || 'home')
  const [selectedLetterId, setSelectedLetterId] = useState(() => {
    if (initial.letter) return initial.letter
    const saved = localStorage.getItem('app-letter')
    return saved ? Number(saved) : null
  })
  const [colorMode, setColorMode] = useState(() => (localStorage.getItem('app-color') === 'night' ? 'night' : 'day'))
  const letterImages = useLetterImages()
  const menuRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    localStorage.setItem('app-color', colorMode)
    const el = document.documentElement
    el.classList.toggle('theme-night', colorMode === 'night')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colorMode === 'night' ? '#0A0E1A' : '#F4F0E8')
  }, [colorMode])

  useEffect(() => {
    localStorage.setItem('app-tab', activeTab)
    const hash = activeTab === 'letter' ? `#letter/${selectedLetterId || 1}` : `#${activeTab}`
    if (window.location.hash !== hash) history.replaceState(null, '', hash)
    const label = TABS.find(t => t.id === activeTab)?.label
    document.title = label ? `${label} | 22 אותיות` : '22 אותיות'
    window.scrollTo({ top: 0 })
  }, [activeTab, selectedLetterId])

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
    ]
  }, [colorMode])

  const handleSelectLetter = (id) => {
    setSelectedLetterId(id)
    localStorage.setItem('app-letter', String(id))
    setActiveTab('letter')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onSelectLetter={handleSelectLetter} onNavigate={setActiveTab} letterImages={letterImages} />
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
      case 'relations':
        return <Relations onSelectLetter={handleSelectLetter} />
      case 'workflow':
        return <Workflow />
      default:
        return <Home onSelectLetter={handleSelectLetter} onNavigate={setActiveTab} letterImages={letterImages} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg bg-texture relative">
      <div className="page-wash fixed inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-indigo-950/30 pointer-events-none" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 glass bar h-14 flex items-center justify-between gap-3 px-4 sm:px-6">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); setActiveTab('home') }}
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
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                className={`tab-btn
                  px-3 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold transition-all duration-150 border-b-2 whitespace-nowrap
                  ${activeTab === tab.id
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

        <main className="max-w-[1200px] mx-auto p-4 sm:p-6 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
