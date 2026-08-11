import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HangmanWord } from '../src/HangmanWord'

describe('HangmanWord', () => {
  it('renders a slot for each letter in the word', () => {
    const { container } = render(
      <HangmanWord wordToGuess="cat" guessedLetters={[]} />,
    )
    expect(container.querySelectorAll('.word-slot')).toHaveLength(3)
  })

  it('makes correctly guessed letters visible', () => {
    const { container } = render(
      <HangmanWord wordToGuess="react" guessedLetters={['r', 'e']} />,
    )
    const visible = container.querySelectorAll('.word-letter.is-visible')
    expect(visible).toHaveLength(2)
  })

  it('reveals all letters when reveal=true', () => {
    const { container } = render(
      <HangmanWord wordToGuess="react" guessedLetters={[]} reveal />,
    )
    const visible = container.querySelectorAll('.word-letter.is-visible')
    expect(visible).toHaveLength(5)
  })

  it('marks unguessed letters as missed when revealed', () => {
    const { container } = render(
      <HangmanWord wordToGuess="cat" guessedLetters={['c']} reveal />,
    )
    const missed = container.querySelectorAll('.word-letter.is-missed')
    // 'a' and 't' were not guessed
    expect(missed).toHaveLength(2)
  })

  it('provides a screen-reader accessible label for the word', () => {
    render(<HangmanWord wordToGuess="cat" guessedLetters={['c']} />)
    // c is guessed, a and t are blank
    expect(screen.getByLabelText(/word:/i)).toBeInTheDocument()
  })
})
