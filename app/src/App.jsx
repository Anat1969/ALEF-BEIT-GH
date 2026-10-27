import { useState, useEffect, useRef } from 'react'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import LetterCard from './components/LetterCard'
import Gallery from './components/Gallery'
import Network from './components/Network'
import Matrix from './components/Matrix'
import Workflow from './components/Workflow'
import { useLetterImages } from './hooks/useLetterImages'

const TABS = [
  { id: 'home', label: 'בית' },
  { id: 'dashboard', label: 'לוח בקרה' },
  { id: 'letter', label: 'אות בודדת' },
  { id: 'gallery', label: 'גלריה' },
  { id: 'network', label: 'קשרים' },
  { id: 'matrix', label: 'מטריצה' },
  { id: 'workflow', label: 'סדר יום' },
]

const TAB_IDS = TABS.map(t => t.id)
const LETTER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400]
const CHAT_URL = 'https://claude.ai/code/session_018qeN1AtEFMg9QwTCerHjo5'

// State lives in the URL hash (#tab or #letter/5) so "העתקת קישור" shares the exact view.
function readHash() {
  const [tab, letter] = window.location.hash.replace(/^#\/?/, '').split('/')
  return {
    tab: TAB_IDS.includes(tab) ? tab : null,
    // Letter ids are gematria values (1..10, 20..90, 100..400)
    letter: LETTER_IDS.includes(Number(letter)) ? Number(letter) : null,
  }
}

const COLOR_MODES = [
  { id: 'gold', label: 'זהב' },
  { id: 'blue', label: 'כחול' },
  { id: 'bw', label: 'שחור-לבן' },
  { id: 'wb', label: 'לבן-שחור' },
]

export default function App() {
  const initial = readHash()
  const [activeTab, setActiveTab] = useState(() => initial.tab || localStorage.getItem('app-tab') || 'home')
  const [selectedLetterId, setSelectedLetterId] = useState(() => {
    if (initial.letter) return initial.letter
    const saved = localStorage.getItem('app-letter')
    return saved ? Number(saved) : null
  })
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
      case 'network':
        return <Network onSelectLetter={handleSelectLetter} />
      case 'matrix':
        return <Matrix onSelectLetter={handleSelectLetter} />
      case 'workflow':
        return <Workflow />
      default:
        return <Home onSelectLetter={handleSelectLetter} onNavigate={setActiveTab} letterImages={letterImages} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg bg-texture relative">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-indigo-950/30 pointer-events-none" />

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
