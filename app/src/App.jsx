import { useState, useEffect } from 'react'
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
  { id: 'workflow', label: 'Workflow' },
]

const HEBREW_LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת'

const COLOR_MODES = [
  { id: 'gold', label: 'זהב' },
  { id: 'blue', label: 'כחול' },
  { id: 'bw', label: 'שחור-לבן' },
]

function LandingPage({ onEnter }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const base = import.meta.env.BASE_URL

  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Video background — fullscreen, no frame, semi-transparent */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
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

        <div className="mt-16 flex items-center justify-center gap-1 text-accent/30">
          {HEBREW_LETTERS.split('').map((ch, i) => (
            <span key={i} className="text-sm font-light">{ch}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedLetterId, setSelectedLetterId] = useState(null)
  const [showLanding, setShowLanding] = useState(true)
  const [colorMode, setColorMode] = useState('gold')
  const letterImages = useLetterImages()

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    const el = document.documentElement
    el.classList.remove('color-gold', 'color-blue', 'color-bw')
    if (colorMode !== 'gold') {
      el.classList.add(`color-${colorMode}`)
    }
  }, [colorMode])

  const handleSelectLetter = (id) => {
    setSelectedLetterId(id)
    setActiveTab('letter')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onSelectLetter={handleSelectLetter} />
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
        return <Dashboard onSelectLetter={handleSelectLetter} />
    }
  }

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />
  }

  return (
    <div className="min-h-screen bg-dark-bg bg-texture relative">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-indigo-950/30 pointer-events-none" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 glass h-14 flex items-center justify-between px-6">
          <button
            onClick={() => setShowLanding(true)}
            className="text-xl font-extrabold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="text-gold">22 אותיות</span>
            <span className="text-gray-500 font-normal text-sm mr-2 opacity-60">מערכת חיה</span>
          </button>

          <div className="flex gap-0.5">
            {COLOR_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setColorMode(mode.id)}
                className={`px-2 py-1 text-[10px] transition-all ${
                  colorMode === mode.id
                    ? 'text-accent bg-white/10'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </header>

        <nav className="glass border-b border-white/10">
          <div className="max-w-[1200px] mx-auto flex gap-0 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-5 py-3 text-sm font-semibold transition-all duration-150 border-b-2 whitespace-nowrap
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

        <main className="max-w-[1200px] mx-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
