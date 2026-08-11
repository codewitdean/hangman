# React Hangman

A React and TypeScript Hangman game built with Vite. The game includes category selection, difficulty levels, hints, saved stats, keyboard input, sound feedback, and a responsive layout.

## Scripts

```bash
npm run dev
npm test
npm run lint
npm run build
```

## Gameplay

- Choose a category and difficulty before or during play.
- Guess letters with the on-screen keyboard or your physical keyboard.
- Use up to two hints per round.
- Press Enter after a win or loss to start a new round.
- Wins, losses, streaks, and hint usage are saved in local storage.

## Project Structure

- `src/useHangmanGame.ts` owns the game state and round flow.
- `src/gameLogic.ts` contains pure, tested Hangman rules.
- `src/gameData.ts` defines word categories.
- `tests/gameLogic.test.ts` covers the core game rules.
