const KEYS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]

type KeyboardProps = {
  activeLetters: string[]
  addGuessedLetter: (letter: string) => void
  disabled?: boolean
  inactiveLetters: string[]
}

export function Keyboard({
  activeLetters,
  addGuessedLetter,
  disabled = false,
  inactiveLetters,
}: KeyboardProps) {
  return (
    <div className="keyboard">
      {KEYS.map(key => {
        const isActive = activeLetters.includes(key)
        const isInactive = inactiveLetters.includes(key)

        return (
          <button
            aria-label={`Letter ${key}`}
            className={`key ${isActive ? "is-active" : ""} ${
              isInactive ? "is-inactive" : ""
            }`}
            disabled={disabled || isActive || isInactive}
            key={key}
            onClick={() => addGuessedLetter(key)}
            type="button"
          >
            {key}
          </button>
        )
      })}
    </div>
  )
}
