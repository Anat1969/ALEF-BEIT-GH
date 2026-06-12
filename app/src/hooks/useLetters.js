import lettersData from '../data/letters.json'

const HEBREW_LETTERS = [
  { id: 1, character: 'א', name: 'אלף', english: 'Aleph', gematria: 1 },
  { id: 2, character: 'ב', name: 'בית', english: 'Bet', gematria: 2 },
  { id: 3, character: 'ג', name: 'גימל', english: 'Gimel', gematria: 3 },
  { id: 4, character: 'ד', name: 'דלת', english: 'Dalet', gematria: 4 },
  { id: 5, character: 'ה', name: 'הא', english: 'He', gematria: 5 },
  { id: 6, character: 'ו', name: 'וו', english: 'Vav', gematria: 6 },
  { id: 7, character: 'ז', name: 'זין', english: 'Zayin', gematria: 7 },
  { id: 8, character: 'ח', name: 'חית', english: 'Chet', gematria: 8 },
  { id: 9, character: 'ט', name: 'טית', english: 'Tet', gematria: 9 },
  { id: 10, character: 'י', name: 'יוד', english: 'Yod', gematria: 10 },
  { id: 11, character: 'כ', name: 'כף', english: 'Kaf', gematria: 20 },
  { id: 12, character: 'ל', name: 'למד', english: 'Lamed', gematria: 30 },
  { id: 13, character: 'מ', name: 'מם', english: 'Mem', gematria: 40 },
  { id: 14, character: 'נ', name: 'נון', english: 'Nun', gematria: 50 },
  { id: 15, character: 'ס', name: 'סמך', english: 'Samekh', gematria: 60 },
  { id: 16, character: 'ע', name: 'עין', english: 'Ayin', gematria: 70 },
  { id: 17, character: 'פ', name: 'פה', english: 'Pe', gematria: 80 },
  { id: 18, character: 'צ', name: 'צדי', english: 'Tsade', gematria: 90 },
  { id: 19, character: 'ק', name: 'קוף', english: 'Qof', gematria: 100 },
  { id: 20, character: 'ר', name: 'ריש', english: 'Resh', gematria: 200 },
  { id: 21, character: 'ש', name: 'שין', english: 'Shin', gematria: 300 },
  { id: 22, character: 'ת', name: 'תו', english: 'Tav', gematria: 400 },
]

export function useLetters() {
  const richLetters = lettersData.letters
  const allLetters = HEBREW_LETTERS.map(letter => {
    const rich = richLetters.find(r => r.id === letter.id)
    return rich ? { ...letter, ...rich, hasData: true } : { ...letter, hasData: false }
  })

  const getLetter = (id) => allLetters.find(l => l.id === id)

  return { letters: allLetters, getLetter }
}
