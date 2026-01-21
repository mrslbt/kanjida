import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface KanjiCard {
  kanji: string
  reading: string
  meaning: string
  level: 'N5' | 'N4' | 'N3' | 'N2'
  lastReviewed?: number
  correctCount: number
  incorrectCount: number
  interval: number // days until next review
}

interface GameState {
  score: number
  lives: number
  streak: number
  level: number
  currentKanji: KanjiCard | null
  kanjiDeck: KanjiCard[]
  answeredToday: number
  dailyGoal: number
  totalMastered: number
  mode: 'visual' | 'deep'

  // Actions
  setCurrentKanji: (kanji: KanjiCard | null) => void
  answerCorrect: () => void
  answerIncorrect: () => void
  resetGame: () => void
  initializeDeck: (deck: KanjiCard[]) => void
  getNextKanji: (excludeKanji?: Set<string>) => KanjiCard | null
  setMode: (mode: 'visual' | 'deep') => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      score: 0,
      lives: 3,
      streak: 0,
      level: 1,
      currentKanji: null,
      kanjiDeck: [],
      answeredToday: 0,
      dailyGoal: 100,
      totalMastered: 0,
      mode: 'visual',

      setCurrentKanji: (kanji) => set({ currentKanji: kanji }),

      setMode: (mode) => set({ mode }),

      answerCorrect: () => {
        const state = get()
        const newStreak = state.streak + 1
        const pointsEarned = 10 * Math.min(newStreak, 10) // max 10x multiplier

        set({
          score: state.score + pointsEarned,
          streak: newStreak,
          answeredToday: state.answeredToday + 1,
        })

        // Update kanji card with spaced repetition
        if (state.currentKanji) {
          const updatedKanji = {
            ...state.currentKanji,
            correctCount: state.currentKanji.correctCount + 1,
            lastReviewed: Date.now(),
            interval: Math.min(state.currentKanji.interval * 2, 30), // double interval, max 30 days
          }

          const updatedDeck = state.kanjiDeck.map(k =>
            k.kanji === state.currentKanji?.kanji ? updatedKanji : k
          )

          set({ kanjiDeck: updatedDeck })
        }
      },

      answerIncorrect: () => {
        const state = get()
        const newLives = state.lives - 1

        set({
          lives: newLives,
          streak: 0,
          answeredToday: state.answeredToday + 1,
        })

        // Reset interval for incorrect answer
        if (state.currentKanji) {
          const updatedKanji = {
            ...state.currentKanji,
            incorrectCount: state.currentKanji.incorrectCount + 1,
            lastReviewed: Date.now(),
            interval: 1, // reset to review tomorrow
          }

          const updatedDeck = state.kanjiDeck.map(k =>
            k.kanji === state.currentKanji?.kanji ? updatedKanji : k
          )

          set({ kanjiDeck: updatedDeck })
        }
      },

      resetGame: () => set({
        score: 0,
        lives: 3,
        streak: 0,
        currentKanji: null,
      }),

      initializeDeck: (deck) => set({ kanjiDeck: deck }),

      getNextKanji: (excludeKanji?: Set<string>) => {
        const state = get()
        const now = Date.now()
        const oneDayMs = 24 * 60 * 60 * 1000

        // Filter cards that are due for review and not excluded
        let availableCards = state.kanjiDeck.filter(card => {
          // Exclude if in excludeKanji set
          if (excludeKanji && excludeKanji.has(card.kanji)) return false

          // Include if never reviewed
          if (!card.lastReviewed) return true

          // Check if due for review
          const daysSinceReview = (now - card.lastReviewed) / oneDayMs
          return daysSinceReview >= card.interval
        })

        // If no due cards, just use all cards (excluding the excluded ones)
        if (availableCards.length === 0) {
          availableCards = state.kanjiDeck.filter(card =>
            !excludeKanji || !excludeKanji.has(card.kanji)
          )
        }

        // Prioritize difficult kanji (more incorrect than correct)
        const difficultCards = availableCards.filter(card =>
          card.incorrectCount > card.correctCount
        )

        // 70% chance to show difficult kanji if available
        if (difficultCards.length > 0 && Math.random() < 0.7) {
          const shuffled = difficultCards.sort(() => Math.random() - 0.5)
          return shuffled[0]
        }

        // Otherwise shuffle all available cards
        const shuffled = availableCards.sort(() => Math.random() - 0.5)
        return shuffled[0] || state.kanjiDeck[0] || null
      },
    }),
    {
      name: 'kanjida-storage',
    }
  )
)
