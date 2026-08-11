import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Keyboard } from '../src/keyboard'

describe('Keyboard', () => {
  it('renders a button for each of the 26 letters', () => {
    render(
      <Keyboard
        activeLetters={[]}
        inactiveLetters={[]}
        addGuessedLetter={vi.fn()}
      />,
    )
    expect(screen.getAllByRole('button')).toHaveLength(26)
  })

  it('calls addGuessedLetter with the clicked letter', async () => {
    const user = userEvent.setup()
    const mockGuess = vi.fn()
    render(
      <Keyboard
        activeLetters={[]}
        inactiveLetters={[]}
        addGuessedLetter={mockGuess}
      />,
    )
    await user.click(screen.getByLabelText('Letter a'))
    expect(mockGuess).toHaveBeenCalledWith('a')
  })

  it('disables active letters', () => {
    render(
      <Keyboard
        activeLetters={['a']}
        inactiveLetters={[]}
        addGuessedLetter={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Letter a')).toBeDisabled()
  })

  it('disables inactive letters', () => {
    render(
      <Keyboard
        activeLetters={[]}
        inactiveLetters={['z']}
        addGuessedLetter={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Letter z')).toBeDisabled()
  })

  it('disables all letters when disabled prop is true', () => {
    render(
      <Keyboard
        activeLetters={[]}
        inactiveLetters={[]}
        addGuessedLetter={vi.fn()}
        disabled
      />,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons.every(b => b.hasAttribute('disabled'))).toBe(true)
  })

  it('applies is-active class to guessed correct letters', () => {
    render(
      <Keyboard
        activeLetters={['e']}
        inactiveLetters={[]}
        addGuessedLetter={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Letter e')).toHaveClass('is-active')
  })

  it('applies is-inactive class to wrong guesses', () => {
    render(
      <Keyboard
        activeLetters={[]}
        inactiveLetters={['x']}
        addGuessedLetter={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Letter x')).toHaveClass('is-inactive')
  })
})
