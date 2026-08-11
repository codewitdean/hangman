import assert from "node:assert/strict"
import test from "node:test"
import {
  addGuessedLetter,
  getAvailableWords,
  getGameStatus,
  getHintLetter,
  getIncorrectLetters,
  getRevealedPattern,
  hasLost,
  hasWon,
  pickWord,
} from "../src/gameLogic.js"

test("filters words by selected difficulty", () => {
  const words = ["cat", "planet", "encyclopedia"]

  assert.deepEqual(getAvailableWords(words, "easy"), ["cat"])
  assert.deepEqual(getAvailableWords(words, "medium"), ["planet"])
  assert.deepEqual(getAvailableWords(words, "hard"), ["encyclopedia"])
})

test("picks a fresh word before repeating used words", () => {
  const words = ["apple", "grape", "peach"]
  const pickedWord = pickWord(words, "easy", "apple", ["grape"], () => 0)

  assert.equal(pickedWord, "peach")
})

test("tracks correct and incorrect guesses", () => {
  let guessedLetters: string[] = []

  guessedLetters = addGuessedLetter(guessedLetters, "r")
  guessedLetters = addGuessedLetter(guessedLetters, "e")
  guessedLetters = addGuessedLetter(guessedLetters, "x")

  assert.deepEqual(getIncorrectLetters(guessedLetters, "react"), ["x"])
  assert.equal(hasWon("react", guessedLetters), false)
  assert.equal(getGameStatus("react", guessedLetters), "playing")
})

test("detects a win when every unique letter is guessed", () => {
  const guessedLetters = ["r", "e", "a", "c", "t"]

  assert.equal(hasWon("react", guessedLetters), true)
  assert.equal(getGameStatus("react", guessedLetters), "won")
})

test("detects a loss at the maximum wrong guesses", () => {
  const guessedLetters = ["b", "d", "f", "g", "h", "j"]

  assert.equal(hasLost(guessedLetters, "react"), true)
  assert.equal(getGameStatus("react", guessedLetters), "lost")
})

test("ignores duplicate and invalid guesses", () => {
  const guessedLetters = ["a"]

  assert.equal(addGuessedLetter(guessedLetters, "a"), guessedLetters)
  assert.equal(addGuessedLetter(guessedLetters, "1"), guessedLetters)
})

test("reveals only hidden letters through hints", () => {
  const hintLetter = getHintLetter("react", ["r", "e"], () => 0)

  assert.equal(hintLetter, "a")
})

test("builds masked and revealed word patterns", () => {
  assert.equal(getRevealedPattern("react", ["r", "e"]), "re___")
  assert.equal(getRevealedPattern("react", ["r", "e"], true), "react")
})
