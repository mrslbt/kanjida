'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/lib/store'
import { initializeKanjiDeck, generateChoices, getKanjiCountByLevel } from '@/lib/kanjiData'
import type { KanjiCard } from '@/lib/store'

const QUESTIONS_PER_SESSION = 10

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState<{
    kanji: KanjiCard
    choices: string[]
    correctAnswer: string
    mode: 'reading' | 'meaning'
  } | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isActive, setIsActive] = useState(false)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [askedKanjiInSession, setAskedKanjiInSession] = useState<Set<string>>(new Set())
  const [fadeIn, setFadeIn] = useState(false)
  const [showResultsPopup, setShowResultsPopup] = useState(false)
  const [correctAnswersInSession, setCorrectAnswersInSession] = useState(0)
  const [idleQuestionCount, setIdleQuestionCount] = useState(0)

  const {
    score,
    streak,
    kanjiDeck,
    answeredToday,
    dailyGoal,
    mode,
    initializeDeck,
    getNextKanji,
    setCurrentKanji,
    answerCorrect,
    answerIncorrect,
    setMode,
  } = useGameStore()

  const kanjiStats = getKanjiCountByLevel()

  // Initialize deck on mount
  useEffect(() => {
    if (kanjiDeck.length === 0) {
      initializeDeck(initializeKanjiDeck())
    }
  }, [kanjiDeck.length, initializeDeck])

  // Fade in effect
  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, showResult])

  const getFishData = (correctAnswers: number) => {
    const fishMap = [
      { name: 'anchovy', emoji: '🐟', minScore: 1 },
      { name: 'pufferfish', emoji: '🐡', minScore: 4 },
      { name: 'tuna', emoji: '🐟', minScore: 5 },
      { name: 'swordfish', emoji: '🗡️🐟', minScore: 6 },
      { name: 'great white shark', emoji: '🦈', minScore: 7 },
      { name: 'basking shark', emoji: '🦈', minScore: 8 },
      { name: 'whale shark', emoji: '🦈', minScore: 9 },
      { name: 'blue whale', emoji: '🐋', minScore: 10 },
    ]

    for (let i = fishMap.length - 1; i >= 0; i--) {
      if (correctAnswers >= fishMap[i].minScore) {
        return fishMap[i]
      }
    }
    return { name: 'anchovy', emoji: '🐟', minScore: 1 }
  }

  const loadNextQuestion = () => {
    const nextKanji = getNextKanji(askedKanjiInSession)
    if (!nextKanji) return

    setAskedKanjiInSession(prev => new Set(prev).add(nextKanji.kanji))
    setCurrentKanji(nextKanji)

    const { mode: userMode } = useGameStore.getState()
    const questionMode = userMode === 'visual' ? 'meaning' : (Math.random() > 0.5 ? 'reading' : 'meaning')
    const choices = generateChoices(nextKanji, kanjiDeck, questionMode)
    const correctAnswer = questionMode === 'reading' ? nextKanji.reading : nextKanji.meaning

    setCurrentQuestion({
      kanji: nextKanji,
      choices,
      correctAnswer,
      mode: questionMode,
    })

    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(10)
    setIsActive(true)
    setFadeIn(false)
    setTimeout(() => setFadeIn(true), 50)
  }

  const handleAnswerClick = (index: number) => {
    if (showResult || selectedAnswer !== null) return

    setSelectedAnswer(index)
    setIsActive(false)
    setIdleQuestionCount(0) // Reset idle count when user answers

    const isCorrect = currentQuestion!.choices[index] === currentQuestion!.correctAnswer

    if (isCorrect) {
      answerCorrect()
      setCorrectAnswersInSession(prev => prev + 1)
    } else {
      answerIncorrect()
    }

    setShowResult(true)

    const newQuestionsAnswered = questionsAnswered + 1
    setQuestionsAnswered(newQuestionsAnswered)

    setTimeout(() => {
      if (newQuestionsAnswered >= QUESTIONS_PER_SESSION) {
        endSession()
      } else {
        loadNextQuestion()
      }
    }, 1500)
  }

  const handleTimeout = () => {
    setIsActive(false)
    answerIncorrect()
    setShowResult(true)
    setSelectedAnswer(-1)

    const newIdleCount = idleQuestionCount + 1
    setIdleQuestionCount(newIdleCount)

    // If idle for 5 questions, return to main page
    if (newIdleCount >= 5) {
      setTimeout(() => {
        endSession()
        closeResultsAndReset()
      }, 1500)
      return
    }

    const newQuestionsAnswered = questionsAnswered + 1
    setQuestionsAnswered(newQuestionsAnswered)

    setTimeout(() => {
      if (newQuestionsAnswered >= QUESTIONS_PER_SESSION) {
        endSession()
      } else {
        loadNextQuestion()
      }
    }, 1500)
  }

  const startSession = () => {
    setSessionActive(true)
    setQuestionsAnswered(0)
    setCorrectAnswersInSession(0)
    setIdleQuestionCount(0)
    setAskedKanjiInSession(new Set())
    setShowResultsPopup(false)
    loadNextQuestion()
  }

  const endSession = () => {
    setSessionActive(false)
    setCurrentQuestion(null)
    setIsActive(false)
    setShowResultsPopup(true)
  }

  const closeResultsAndReset = () => {
    setShowResultsPopup(false)
    setAskedKanjiInSession(new Set())
  }

  // Get difficult kanji stats
  const getDifficultKanji = () => {
    return kanjiDeck
      .filter(card => card.incorrectCount > card.correctCount && card.incorrectCount > 0)
      .sort((a, b) => (b.incorrectCount - b.correctCount) - (a.incorrectCount - a.correctCount))
      .slice(0, 5)
  }

  const getLevelProgress = () => {
    const levelCounts = {
      N5: { mastered: 0, total: kanjiStats.N5 },
      N4: { mastered: 0, total: kanjiStats.N4 },
      N3: { mastered: 0, total: kanjiStats.N3 },
      N2: { mastered: 0, total: kanjiStats.N2 },
    }

    kanjiDeck.forEach((card) => {
      if (card.correctCount >= 3 && card.interval >= 7) {
        levelCounts[card.level].mastered++
      }
    })

    return levelCounts
  }

  const levelProgress = getLevelProgress()
  const difficultKanji = getDifficultKanji()

  // Results Popup
  if (showResultsPopup) {
    const fishData = getFishData(correctAnswersInSession)

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all animate-slideIn">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {correctAnswersInSession}/{QUESTIONS_PER_SESSION}
              </h2>
              <div className="text-9xl mb-4 animate-bounce">
                {fishData.emoji}
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-6">
                You caught a {fishData.name}!
              </p>

              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                    <div className="text-xs text-gray-600">Total Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{streak}</div>
                    <div className="text-xs text-gray-600">Current Streak</div>
                  </div>
                </div>
              </div>

              <button
                onClick={closeResultsAndReset}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transform transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!sessionActive || !currentQuestion) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
          <h1 className="text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-gradient">
            Kanjida
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            Master N2 Kanji with Spaced Repetition
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg transition-all hover:shadow-md">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg transition-all hover:shadow-md">
              <div className="text-2xl font-bold text-green-600">{streak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg transition-all hover:shadow-md">
              <div className="text-2xl font-bold text-purple-600">
                {answeredToday}/{dailyGoal}
              </div>
              <div className="text-sm text-gray-600">Today's Progress</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg transition-all hover:shadow-md">
              <div className="text-2xl font-bold text-orange-600">{kanjiStats.total}</div>
              <div className="text-sm text-gray-600">Total Kanji</div>
            </div>
          </div>

          {/* Difficult Kanji Section */}
          {difficultKanji.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-semibold mb-3 text-red-700 flex items-center">
                <span className="mr-2">⚠️</span> Focus on These (Your Difficult Kanji)
              </h3>
              <div className="flex flex-wrap gap-3">
                {difficultKanji.map((card) => (
                  <div
                    key={card.kanji}
                    className="bg-white px-3 py-2 rounded-md shadow-sm border border-red-100 hover:shadow-md transition-all"
                  >
                    <span className="text-xl font-bold text-gray-800">{card.kanji}</span>
                    <span className="text-xs text-red-600 ml-2">
                      ✗{card.incorrectCount}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                These kanji will appear more frequently to help you master them
              </p>
            </div>
          )}

          {/* Level Progress */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4 text-gray-700">Progress by Level</h3>
            {(['N5', 'N4', 'N3', 'N2'] as const).map((level) => (
              <div key={level} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{level}</span>
                  <span className="text-gray-600">
                    {levelProgress[level].mastered}/{levelProgress[level].total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${
                      level === 'N5' ? 'bg-green-500' :
                      level === 'N4' ? 'bg-blue-500' :
                      level === 'N3' ? 'bg-purple-500' :
                      'bg-pink-500'
                    }`}
                    style={{
                      width: `${(levelProgress[level].mastered / levelProgress[level].total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mode Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700 text-center">Difficulty Mode</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('visual')}
                className={`p-4 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                  mode === 'visual'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">👁️</div>
                <div className="text-sm font-bold">Visual Mode</div>
                <div className="text-xs opacity-75 mt-1">Kanji + English</div>
              </button>
              <button
                onClick={() => setMode('deep')}
                className={`p-4 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                  mode === 'deep'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">🧠</div>
                <div className="text-sm font-bold">Deep Mode</div>
                <div className="text-xs opacity-75 mt-1">+ Reading Practice</div>
              </button>
            </div>
          </div>

          <button
            onClick={startSession}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold py-4 px-8 rounded-lg transform transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Start New Session ({QUESTIONS_PER_SESSION} Questions)
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            Each session = {QUESTIONS_PER_SESSION} unique kanji questions
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full transition-all duration-300 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Top Stats Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-4 flex justify-between items-center text-white shadow-lg">
          <div className="flex gap-6">
            <div className="transition-all hover:scale-110">
              <div className="text-xs opacity-75">Score</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
            <div className="transition-all hover:scale-110">
              <div className="text-xs opacity-75">Streak</div>
              <div className="text-2xl font-bold">{streak}🔥</div>
            </div>
            <div className="transition-all hover:scale-110">
              <div className="text-xs opacity-75">Questions</div>
              <div className="text-2xl font-bold">{questionsAnswered}/{QUESTIONS_PER_SESSION}</div>
            </div>
          </div>

          {/* Timer */}
          <div className="relative w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-white/20"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - timeLeft / 10)}`}
                className={`transition-all duration-1000 ${timeLeft <= 3 ? 'text-red-400' : 'text-white'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold transition-all ${timeLeft <= 3 ? 'scale-125 text-red-200' : ''}`}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:shadow-3xl">
          {/* Level Badge and Mode Badge */}
          <div className="mb-4 flex items-center justify-between">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold transition-all hover:scale-110 ${
                currentQuestion.kanji.level === 'N5' ? 'bg-green-100 text-green-700' :
                currentQuestion.kanji.level === 'N4' ? 'bg-blue-100 text-blue-700' :
                currentQuestion.kanji.level === 'N3' ? 'bg-purple-100 text-purple-700' :
                'bg-pink-100 text-pink-700'
              }`}
            >
              {currentQuestion.kanji.level}
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                mode === 'visual'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {mode === 'visual' ? '👁️ Visual' : '🧠 Deep'}
            </span>
          </div>

          {/* Kanji Display */}
          <div className="text-center mb-8">
            <div className="text-9xl font-bold mb-4 text-gray-800 transition-all duration-300 hover:scale-110">
              {currentQuestion.kanji.kanji}
            </div>
            <div className="text-gray-500 text-lg">
              {currentQuestion.mode === 'reading' ? 'Choose the reading' : 'Choose the meaning'}
            </div>
          </div>

          {/* Answer Choices */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={showResult}
                className={`p-4 text-lg font-semibold rounded-xl transition-all duration-300 transform ${
                  showResult
                    ? choice === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white scale-105 shadow-lg'
                      : selectedAnswer === index
                      ? 'bg-red-500 text-white scale-95'
                      : 'bg-gray-200 text-gray-400'
                    : 'bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-gray-800 hover:scale-105 hover:shadow-md active:scale-95'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {choice}
              </button>
            ))}
          </div>

          {/* Timeout Message */}
          {selectedAnswer === -1 && showResult && (
            <div className="mt-4 text-center text-red-600 font-semibold animate-bounce">
              Time's up! ⏱️
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
