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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedLetterId, setSelectedLetterId] = useState(null)
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dark-mode')
      if (saved !== null) return saved === 'true'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const letterImages = useLetterImages()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dark-mode', dark)
  }, [dark])

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

  return (
    <div className="min-h-screen bg-primary dark:bg-dark-bg bg-texture transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-primary/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-border dark:border-dark-border h-14 flex items-center justify-between px-6 transition-colors">
        <h1 className="text-xl font-extrabold tracking-tight text-text dark:text-dark-text">
          22 אותיות
          <span className="text-text-tertiary dark:text-gray-500 font-normal text-sm mr-2 opacity-60">מערכת חיה</span>
        </h1>
        <button
          onClick={() => setDark(!dark)}
          className="w-9 h-9 border border-border dark:border-dark-border flex items-center justify-center hover:bg-surface dark:hover:bg-dark-surface hover:-translate-y-px hover:shadow-sm active:translate-y-0 active:shadow-none transition-all text-lg"
          title={dark ? 'מצב בהיר' : 'מצב כהה'}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      <nav className="border-b border-border dark:border-dark-border bg-primary/90 dark:bg-dark-bg/90 backdrop-blur-sm transition-colors">
        <div className="max-w-[1200px] mx-auto flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-5 py-3 text-sm font-semibold transition-all duration-150 border-b-2 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'text-accent dark:text-accent-light border-accent dark:border-accent-light'
                  : 'text-text-secondary dark:text-gray-400 border-transparent hover:text-text dark:hover:text-dark-text hover:bg-surface/60 dark:hover:bg-dark-surface/60 opacity-60 hover:opacity-100'
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
  )
}
