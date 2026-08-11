import { useEffect, useRef } from "react"
import HangmanDrawing from "./HangmanDrawing"
import { Keyboard } from "./keyboard"
import { HangmanWord } from "./HangmanWord"
import {
  type CategoryId,
  DIFFICULTIES,
  MAX_INCORRECT_GUESSES,
} from "./gameLogic"
import { type FeedbackType, useHangmanGame } from "./useHangmanGame"
import "./App.css"

const SOUND_MAP: Record<
  FeedbackType,
  { duration: number; frequency: number; wave: OscillatorType }
> = {
  correct: { duration: 0.1, frequency: 660, wave: "sine" },
  hint: { duration: 0.12, frequency: 520, wave: "triangle" },
  loss: { duration: 0.26, frequency: 150, wave: "sawtooth" },
  win: { duration: 0.22, frequency: 880, wave: "triangle" },
  wrong: { duration: 0.12, frequency: 180, wave: "square" },
}

function playFeedbackSound(type: FeedbackType, muted: boolean) {
  if (muted || typeof window === "undefined") return

  const audioWindow = window as Window &
    typeof globalThis & {
      webkitAudioContext?: typeof AudioContext
    }
  const AudioContextClass =
    audioWindow.AudioContext ?? audioWindow.webkitAudioContext

  if (!AudioContextClass) return

  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const sound = SOUND_MAP[type]

  oscillator.type = sound.wave
  oscillator.frequency.setValueAtTime(sound.frequency, context.currentTime)
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + sound.duration,
  )

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + sound.duration)
  oscillator.onended = () => {
    void context.close()
  }
}

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

  useEffect(() => {
    if (feedback) {
      playFeedbackSound(feedback.type, settings.muted)
    }
  }, [feedback, settings.muted])

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
