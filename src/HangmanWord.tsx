type HangmanWordProps = {
  guessedLetters: string[]
  reveal?: boolean
  wordToGuess: string
}

export function HangmanWord({
  guessedLetters,
  reveal = false,
  wordToGuess,
}: HangmanWordProps) {
  const accessibleWord = wordToGuess
    .split("")
    .map(letter => (guessedLetters.includes(letter) || reveal ? letter : "blank"))
    .join(" ")

  return (
    <div className="word-wrap" aria-label={`Word: ${accessibleWord}`}>
      {wordToGuess.split("").map((letter, index) => {
        const isGuessed = guessedLetters.includes(letter)
        const isRevealed = reveal && !isGuessed

        return (
          <span className="word-slot" key={`${letter}-${index}`}>
            <span
              className={`word-letter ${isGuessed || reveal ? "is-visible" : ""} ${
                isRevealed ? "is-missed" : ""
              }`}
              aria-hidden="true"
            >
              {letter}
            </span>
          </span>
        )
      })}
    </div>
  )
}
