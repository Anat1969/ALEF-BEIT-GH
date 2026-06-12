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
  const letterImages = useLetterImages()

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

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
    <div className="min-h-screen bg-dark-bg bg-texture relative">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-indigo-950/30 pointer-events-none" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 glass h-14 flex items-center justify-between px-6">
          <h1 className="text-xl font-extrabold tracking-tight text-dark-text">
            22 אותיות
            <span className="text-gray-500 font-normal text-sm mr-2 opacity-60">מערכת חיה</span>
          </h1>
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
