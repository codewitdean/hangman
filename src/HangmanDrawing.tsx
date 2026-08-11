const BODY_PARTS = [
  "hangman-head",
  "hangman-body",
  "hangman-right-arm",
  "hangman-left-arm",
  "hangman-right-leg",
  "hangman-left-leg",
] as const

type HangmanDrawingProps = {
  isShaking?: boolean
  numberOfGuesses: number
  shakeKey?: number | string
}

function HangmanDrawing({
  isShaking = false,
  numberOfGuesses,
  shakeKey = "steady",
}: HangmanDrawingProps) {
  return (
    <div
      className={`hangman-drawing ${isShaking ? "is-shaking" : ""}`}
      aria-label={`Hangman drawing with ${numberOfGuesses} of 6 incorrect guesses`}
      key={shakeKey}
      role="img"
    >
      {BODY_PARTS.slice(0, numberOfGuesses).map(part => (
        <div className={part} key={part} />
      ))}
      <div className="hangman-rope" />
      <div className="hangman-top" />
      <div className="hangman-post" />
      <div className="hangman-base" />
    </div>
  )
}

export default HangmanDrawing
