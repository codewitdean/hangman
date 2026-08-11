import { useCallback, useMemo, useRef, useState } from "react"
import { getCategoryById, WORD_CATEGORIES } from "./gameData"
import {
  addGuessedLetter,
  type CategoryId,
  type Difficulty,
  getCorrectLetters,
  getGameStatus,
  getHintLetter,
  getIncorrectLetters,
  MAX_HINTS,
  MAX_INCORRECT_GUESSES,
  pickWord,
} from "./gameLogic"
import { useLocalStorageState } from "./useLocalStorageState"

export type FeedbackType = "correct" | "wrong" | "hint" | "win" | "loss"

export type GameStats = {
  bestStreak: number
  currentStreak: number
  gamesPlayed: number
  hintsUsed: number
  losses: number
  totalGuesses: number
  wins: number
}

type GameSettings = {
  categoryId: CategoryId
  difficulty: Difficulty
  muted: boolean
}

const DEFAULT_SETTINGS: GameSettings = {
  categoryId: "general",
  difficulty: "medium",
  muted: false,
}

const DEFAULT_STATS: GameStats = {
  bestStreak: 0,
  currentStreak: 0,
  gamesPlayed: 0,
  hintsUsed: 0,
  losses: 0,
  totalGuesses: 0,
  wins: 0,
}

const MAX_REMEMBERED_WORDS = 40

function rememberWord(currentWords: string[], word: string) {
  if (currentWords.includes(word)) return currentWords
  return [...currentWords, word].slice(-MAX_REMEMBERED_WORDS)
}

function updateStatsForResult(stats: GameStats, won: boolean, guessCount: number) {
  const currentStreak = won ? stats.currentStreak + 1 : 0

  return {
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    currentStreak,
    gamesPlayed: stats.gamesPlayed + 1,
    hintsUsed: stats.hintsUsed,
    losses: stats.losses + (won ? 0 : 1),
    totalGuesses: stats.totalGuesses + guessCount,
    wins: stats.wins + (won ? 1 : 0),
  }
}

export function useHangmanGame() {
  const feedbackId = useRef(0)
  const usedWords = useRef<string[]>([])
  const roundComplete = useRef(false)
  const hintsUsedThisRound = useRef(0)
  const [settings, setSettings] = useLocalStorageState(
    "hangman:settings",
    DEFAULT_SETTINGS,
  )
  const [stats, setStats] = useLocalStorageState("hangman:stats", DEFAULT_STATS)
  const [wordToGuess, setWordToGuess] = useState(() => {
    const category = getCategoryById(settings.categoryId)
    return pickWord(category.words, settings.difficulty)
  })
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS)
  const [announcement, setAnnouncement] = useState("New word ready.")
  const [feedback, setFeedback] = useState<{
    id: number
    type: FeedbackType
  } | null>(null)

  const incorrectLetters = useMemo(
    () => getIncorrectLetters(guessedLetters, wordToGuess),
    [guessedLetters, wordToGuess],
  )
  const activeLetters = useMemo(
    () => getCorrectLetters(guessedLetters, wordToGuess),
    [guessedLetters, wordToGuess],
  )
  const status = useMemo(
    () => getGameStatus(wordToGuess, guessedLetters),
    [guessedLetters, wordToGuess],
  )
  const guessesRemaining = Math.max(
    0,
    MAX_INCORRECT_GUESSES - incorrectLetters.length,
  )
  const canUseHint = status === "playing" && hintsRemaining > 0

  const pushFeedback = useCallback((type: FeedbackType) => {
    feedbackId.current += 1
    setFeedback({ id: feedbackId.current, type })
  }, [])

  const completeRoundIfNeeded = useCallback(
    (nextGuessedLetters: string[]) => {
      if (roundComplete.current) return true

      const nextStatus = getGameStatus(wordToGuess, nextGuessedLetters)
      if (nextStatus === "playing") return false

      const won = nextStatus === "won"
      roundComplete.current = true
      setStats(currentStats => {
        const updated = updateStatsForResult(currentStats, won, nextGuessedLetters.length)
        return {
          ...updated,
          hintsUsed: currentStats.hintsUsed + hintsUsedThisRound.current,
        }
      })
      setAnnouncement(
        won
          ? `You won. The word was ${wordToGuess}.`
          : `You lost. The word was ${wordToGuess}.`,
      )
      pushFeedback(won ? "win" : "loss")
      return true
    },
    [pushFeedback, setStats, wordToGuess],
  )

  const startNewRound = useCallback(
    (nextSettings = settings) => {
      const category = getCategoryById(nextSettings.categoryId)

      setWordToGuess(currentWord => {
        const nextWord = pickWord(
          category.words,
          nextSettings.difficulty,
          currentWord,
          usedWords.current,
        )

        usedWords.current = rememberWord(usedWords.current, nextWord)
        return nextWord
      })
      setGuessedLetters([])
      setHintsRemaining(MAX_HINTS)
      roundComplete.current = false
      hintsUsedThisRound.current = 0
      setAnnouncement("New word ready.")
    },
    [settings],
  )

  const guessLetter = useCallback(
    (rawLetter: string) => {
      if (status !== "playing") return

      const nextGuessedLetters = addGuessedLetter(guessedLetters, rawLetter)
      if (nextGuessedLetters === guessedLetters) return

      const guessedLetter = nextGuessedLetters[nextGuessedLetters.length - 1]
      const isCorrect = wordToGuess.includes(guessedLetter)

      setGuessedLetters(nextGuessedLetters)
      if (!completeRoundIfNeeded(nextGuessedLetters)) {
        const newIncorrectCount = nextGuessedLetters.filter(
          l => !wordToGuess.includes(l),
        ).length
        const bodyPartNames = [
          "head",
          "body",
          "right arm",
          "left arm",
          "right leg",
          "left leg",
        ]
        const bodyPartAdded = !isCorrect ? bodyPartNames[newIncorrectCount - 1] : null
        const guessesLeft = MAX_INCORRECT_GUESSES - newIncorrectCount

        setAnnouncement(
          isCorrect
            ? `${guessedLetter.toUpperCase()} is in the word.`
            : bodyPartAdded
              ? `${guessedLetter.toUpperCase()} is not in the word. ${bodyPartAdded} added. ${guessesLeft} ${guessesLeft === 1 ? "guess" : "guesses"} remaining.`
              : `${guessedLetter.toUpperCase()} is not in the word.`,
        )
        pushFeedback(isCorrect ? "correct" : "wrong")
      }
    },
    [completeRoundIfNeeded, guessedLetters, pushFeedback, status, wordToGuess],
  )

  const revealHint = useCallback(() => {
    if (!canUseHint) return

    const hintLetter = getHintLetter(wordToGuess, guessedLetters)
    if (!hintLetter) return

    const nextGuessedLetters = addGuessedLetter(guessedLetters, hintLetter)

    setGuessedLetters(nextGuessedLetters)
    setHintsRemaining(currentHints => Math.max(0, currentHints - 1))
    hintsUsedThisRound.current += 1
    if (!completeRoundIfNeeded(nextGuessedLetters)) {
      setAnnouncement(`Hint revealed ${hintLetter.toUpperCase()}.`)
      pushFeedback("hint")
    }
  }, [
    canUseHint,
    completeRoundIfNeeded,
    guessedLetters,
    pushFeedback,
    wordToGuess,
  ])

  const chooseCategory = useCallback(
    (categoryId: CategoryId) => {
      const nextSettings = { ...settings, categoryId }
      setSettings(nextSettings)
      startNewRound(nextSettings)
    },
    [setSettings, settings, startNewRound],
  )

  const chooseDifficulty = useCallback(
    (difficulty: Difficulty) => {
      const nextSettings = { ...settings, difficulty }
      setSettings(nextSettings)
      startNewRound(nextSettings)
    },
    [setSettings, settings, startNewRound],
  )

  const toggleMuted = useCallback(() => {
    setSettings(currentSettings => ({
      ...currentSettings,
      muted: !currentSettings.muted,
    }))
  }, [setSettings])

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS)
  }, [setStats])

  return {
    activeLetters,
    announcement,
    canUseHint,
    categories: WORD_CATEGORIES,
    chooseCategory,
    chooseDifficulty,
    feedback,
    guessedLetters,
    guessesRemaining,
    guessLetter,
    hintsRemaining,
    hintsUsedThisRound: hintsUsedThisRound.current,
    incorrectLetters,
    resetGame: startNewRound,
    resetStats,
    revealHint,
    settings,
    stats,
    status,
    toggleMuted,
    wordToGuess,
  }
}
