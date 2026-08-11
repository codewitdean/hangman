import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HangmanDrawing from '../src/HangmanDrawing'

describe('HangmanDrawing', () => {
  it('renders with accessible label showing guess count', () => {
    render(<HangmanDrawing numberOfGuesses={3} />)
    expect(
      screen.getByRole('img', { name: /3 of 6 incorrect guesses/i }),
    ).toBeInTheDocument()
  })

  it('shows no body parts when numberOfGuesses is 0', () => {
    const { container } = render(<HangmanDrawing numberOfGuesses={0} />)
    expect(container.querySelector('.hangman-head')).toBeNull()
    expect(container.querySelector('.hangman-body')).toBeNull()
  })

  it('shows head only when numberOfGuesses is 1', () => {
    const { container } = render(<HangmanDrawing numberOfGuesses={1} />)
    expect(container.querySelector('.hangman-head')).toBeInTheDocument()
    expect(container.querySelector('.hangman-body')).toBeNull()
  })

  it('shows all 6 body parts when numberOfGuesses is 6', () => {
    const { container } = render(<HangmanDrawing numberOfGuesses={6} />)
    const parts = [
      '.hangman-head',
      '.hangman-body',
      '.hangman-right-arm',
      '.hangman-left-arm',
      '.hangman-right-leg',
      '.hangman-left-leg',
    ]
    for (const selector of parts) {
      expect(container.querySelector(selector)).toBeInTheDocument()
    }
  })

  it('applies is-shaking class when isShaking is true', () => {
    const { container } = render(
      <HangmanDrawing numberOfGuesses={2} isShaking />,
    )
    expect(container.querySelector('.hangman-drawing')).toHaveClass('is-shaking')
  })

  it('does not apply is-shaking class by default', () => {
    const { container } = render(<HangmanDrawing numberOfGuesses={2} />)
    expect(container.querySelector('.hangman-drawing')).not.toHaveClass('is-shaking')
  })
})
