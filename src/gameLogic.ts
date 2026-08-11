export const MAX_INCORRECT_GUESSES = 6
export const MAX_HINTS = 2

export const DIFFICULTIES = ["easy", "medium", "hard"] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const CATEGORY_IDS = [
  "general",
  "animals",
  "food",
  "places",
  "technology",
] as const
export type CategoryId = (typeof CATEGORY_IDS)[number]

export type GameStatus = "playing" | "won" | "lost"

const WORD_LENGTHS: Record<Difficulty, { max: number; min: number }> = {
  easy: { min: 3, max: 5 },
  medium: { min: 6, max: 8 },
  hard: { min: 9, max: 24 },
}

function isLetter(value: string) {
  return /^[a-z]$/.test(value)
}

export function normalizeWord(word: string) {
  return word.trim().toLowerCase()
}

export function normalizeLetter(letter: string) {
  return letter.trim().toLowerCase().charAt(0)
}

export function cleanWords(words: string[]) {
  return words.map(normalizeWord).filter(word => /^[a-z]+$/.test(word))
}

export function getUniqueLetters(word: string) {
  return Array.from(new Set(normalizeWord(word).split(""))).filter(isLetter)
}

export function getAvailableWords(words: string[], difficulty: Difficulty) {
  const { max, min } = WORD_LENGTHS[difficulty]
  const cleanedWords = cleanWords(words)
  const difficultyWords = cleanedWords.filter(
    word => word.length >= min && word.length <= max,
  )

  return difficultyWords.length ? difficultyWords : cleanedWords
}

export function pickWord(
  words: string[],
  difficulty: Difficulty,
  excludedWord?: string,
  usedWords: string[] = [],
  random: () => number = Math.random,
) {
  const availableWords = getAvailableWords(words, difficulty)
  const normalizedExcludedWord = excludedWord ? normalizeWord(excludedWord) : ""
  const normalizedUsedWords = new Set(usedWords.map(normalizeWord))
  const freshWords = availableWords.filter(
    word => word !== normalizedExcludedWord && !normalizedUsedWords.has(word),
  )
  const repeatableWords = availableWords.filter(word => word !== normalizedExcludedWord)
  const candidateWords = freshWords.length ? freshWords : repeatableWords

  if (candidateWords.length === 0) return availableWords[0] ?? "react"

  const index = Math.floor(random() * candidateWords.length)
  return candidateWords[index]
}

export function getCorrectLetters(guessedLetters: string[], word: string) {
  const normalizedWord = normalizeWord(word)
  return guessedLetters.filter(letter => normalizedWord.includes(letter))
}

export function getIncorrectLetters(guessedLetters: string[], word: string) {
  const normalizedWord = normalizeWord(word)
  return guessedLetters.filter(letter => !normalizedWord.includes(letter))
}

export function addGuessedLetter(guessedLetters: string[], rawLetter: string) {
  const letter = normalizeLetter(rawLetter)

  if (!isLetter(letter) || guessedLetters.includes(letter)) {
    return guessedLetters
  }

  return [...guessedLetters, letter]
}

export function hasWon(word: string, guessedLetters: string[]) {
  return getUniqueLetters(word).every(letter => guessedLetters.includes(letter))
}

export function hasLost(guessedLetters: string[], word: string) {
  return getIncorrectLetters(guessedLetters, word).length >= MAX_INCORRECT_GUESSES
}

export function getGameStatus(word: string, guessedLetters: string[]): GameStatus {
  if (hasWon(word, guessedLetters)) return "won"
  if (hasLost(guessedLetters, word)) return "lost"
  return "playing"
}

export function getHintLetter(
  word: string,
  guessedLetters: string[],
  random: () => number = Math.random,
) {
  const hiddenLetters = getUniqueLetters(word).filter(
    letter => !guessedLetters.includes(letter),
  )

  if (hiddenLetters.length === 0) return null

  const index = Math.floor(random() * hiddenLetters.length)
  return hiddenLetters[index]
}

export function getRevealedPattern(
  word: string,
  guessedLetters: string[],
  reveal = false,
) {
  return normalizeWord(word)
    .split("")
    .map(letter => (guessedLetters.includes(letter) || reveal ? letter : "_"))
    .join("")
}
