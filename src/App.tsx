import { useEffect, useRef } from "react"
import HangmanDrawing from "./HangmanDrawing"
import { Keyboard } from "./keyboard"
import { HangmanWord } from "./HangmanWord"
import { Confetti } from "./Confetti"
import {
  type CategoryId,
  DIFFICULTIES,
  MAX_INCORRECT_GUESSES,
} from "./gameLogic"
import { useHangmanGame } from "./useHangmanGame"
import { useFeedbackSound } from "./useFeedbackSound"
import { useWordDefinition } from "./useWordDefinition"
import "./App.css"

function App() {
  const {
    activeLetters,
    announcement,
    canUseHint,
    categories,
    chooseCategory,
    chooseDifficulty,
    feedback,
    guessedLetters,
    guessesRemaining,
    guessLetter,
    hintsRemaining,
    hintsUsedThisRound,
    incorrectLetters,
    resetGame,
    resetStats,
    revealHint,
    settings,
    stats,
    status,
    toggleMuted,
    wordToGuess,
  } = useHangmanGame()
  const playAgainButtonRef = useRef<HTMLButtonElement>(null)
  const gameOver = status !== "playing"

  useFeedbackSound(feedback, settings.muted)
  const definition = useWordDefinition(wordToGuess, gameOver)

  useEffect(() => {
    if (gameOver) {
      playAgainButtonRef.current?.focus()
    }
  }, [gameOver])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (event.key === "Enter" && gameOver) {
        event.preventDefault()
        resetGame()
        return
      }

      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (!key.match(/^[a-z]$/)) return

      event.preventDefault()
      guessLetter(key)
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [gameOver, guessLetter, resetGame])

  const statusMessage =
    status === "won"
      ? "You won"
      : status === "lost"
        ? "You lost"
        : `${guessesRemaining} guesses left`

  return (
    <main className="game-shell">
      <Confetti active={status === "won"} />
      <header className="game-header">
        <div>
          <p className="eyebrow">React Hangman</p>
          <h1>Hangman</h1>
        </div>
        <div
          className={`game-status ${status === "won" ? "is-win" : ""} ${
            status === "lost" ? "is-loss" : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      </header>

      <section className="game-options" aria-label="Game options">
        <label className="select-field">
          <span>Category</span>
          <select
            onChange={event => chooseCategory(event.target.value as CategoryId)}
            value={settings.categoryId}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <div className="segmented-control" role="group" aria-label="Difficulty">
          {DIFFICULTIES.map(difficulty => (
            <button
              aria-pressed={settings.difficulty === difficulty}
              className={settings.difficulty === difficulty ? "is-selected" : ""}
              key={difficulty}
              onClick={() => chooseDifficulty(difficulty)}
              type="button"
            >
              {difficulty}
            </button>
          ))}
        </div>

        <button
          aria-pressed={settings.muted}
          className="secondary-button"
          onClick={toggleMuted}
          type="button"
        >
          {settings.muted ? "Sound off" : "Sound on"}
        </button>
      </section>

      <section className="stats-grid" aria-label="Game stats">
        <div>
          <span>{stats.wins}</span>
          <p>Wins</p>
        </div>
        <div>
          <span>{stats.losses}</span>
          <p>Losses</p>
        </div>
        <div>
          <span>{stats.currentStreak}</span>
          <p>Streak</p>
        </div>
        <div>
          <span>{stats.bestStreak}</span>
          <p>Best</p>
        </div>
        <div>
          <span>
            {stats.gamesPlayed > 0
              ? `${Math.round((stats.wins / stats.gamesPlayed) * 100)}%`
              : "—"}
          </span>
          <p>Win rate</p>
        </div>
        <div>
          <span>
            {stats.wins > 0 && stats.totalGuesses > 0
              ? (stats.totalGuesses / stats.wins).toFixed(1)
              : "—"}
          </span>
          <p>Avg guesses</p>
        </div>
        <div>
          <span>{hintsUsedThisRound}</span>
          <p>Hints this round</p>
        </div>
        <button className="secondary-button" onClick={resetStats} type="button">
          Reset stats
        </button>
      </section>

      <p className="sr-only" role="status" aria-live="assertive">
        {announcement}
      </p>

      <section className="game-board" aria-label="Hangman game">
        <HangmanDrawing
          isShaking={feedback?.type === "wrong"}
          numberOfGuesses={Math.min(
            incorrectLetters.length,
            MAX_INCORRECT_GUESSES,
          )}
          shakeKey={feedback?.type === "wrong" ? feedback.id : "steady"}
        />
        <HangmanWord
          guessedLetters={guessedLetters}
          reveal={status === "lost"}
          wordToGuess={wordToGuess}
        />
      </section>

      {gameOver ? (
        <section className={`round-summary is-${status}`} aria-live="polite">
          <div>
            <p>{status === "won" ? "Clean solve" : "Round over"}</p>
            <strong>{wordToGuess}</strong>
            {definition.status === "loading" && (
              <p className="word-definition">Looking up definition…</p>
            )}
            {definition.status === "success" && (
              <p className="word-definition">
                <em>{definition.definition.partOfSpeech}</em>{" "}
                {definition.definition.definition}
              </p>
            )}
          </div>
          <button
            className="new-game-button"
            onClick={() => resetGame()}
            ref={playAgainButtonRef}
            type="button"
          >
            Play again
          </button>
        </section>
      ) : null}

      <section className="game-controls" aria-label="Letter choices">
        <div
          className="guesses-bar"
          aria-label={`${guessesRemaining} of ${MAX_INCORRECT_GUESSES} guesses remaining`}
          role="meter"
          aria-valuenow={guessesRemaining}
          aria-valuemin={0}
          aria-valuemax={MAX_INCORRECT_GUESSES}
        >
          {Array.from({ length: MAX_INCORRECT_GUESSES }, (_, i) => (
            <div
              key={i}
              className={`guesses-bar-segment ${
                i < guessesRemaining ? "is-remaining" : "is-used"
              } ${
                guessesRemaining === 1 && i < guessesRemaining ? "is-danger" : ""
              } ${
                guessesRemaining === 2 && i < guessesRemaining ? "is-warning" : ""
              }`}
            />
          ))}
        </div>
        <Keyboard
          activeLetters={activeLetters}
          addGuessedLetter={guessLetter}
          disabled={status !== "playing"}
          inactiveLetters={incorrectLetters}
        />
      </section>

      <footer className="game-footer">
        <div>
          <p>
            Wrong letters:{" "}
            <span>
              {incorrectLetters.length ? incorrectLetters.join(" ") : "None"}
            </span>
          </p>
          <p>
            Hints left: <span>{hintsRemaining}</span>
          </p>
        </div>
        <div className="footer-actions">
          <button
            className="secondary-button"
            disabled={!canUseHint}
            onClick={revealHint}
            type="button"
          >
            Hint
          </button>
          <button
            className="new-game-button"
            onClick={() => resetGame()}
            type="button"
          >
            New word
          </button>
        </div>
      </footer>
    </main>
  )
}
export default App
