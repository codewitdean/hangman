import words from "./wordList.json"
import type { CategoryId } from "./gameLogic"

export type WordCategory = {
  id: CategoryId
  label: string
  words: string[]
}

export const WORD_CATEGORIES: WordCategory[] = [
  {
    id: "general",
    label: "General",
    words: words as string[],
  },
  {
    id: "animals",
    label: "Animals",
    words: [
      "badger",
      "beetle",
      "buffalo",
      "cheetah",
      "dolphin",
      "falcon",
      "giraffe",
      "hamster",
      "jaguar",
      "kangaroo",
      "lemur",
      "octopus",
      "penguin",
      "raven",
      "turtle",
      "walrus",
    ],
  },
  {
    id: "food",
    label: "Food",
    words: [
      "apple",
      "bagel",
      "biscuit",
      "caramel",
      "dumpling",
      "gnocchi",
      "lasagna",
      "muffin",
      "noodle",
      "omelette",
      "paella",
      "pumpkin",
      "sandwich",
      "spinach",
      "tortilla",
      "waffle",
    ],
  },
  {
    id: "places",
    label: "Places",
    words: [
      "airport",
      "bakery",
      "campus",
      "canyon",
      "capital",
      "harbor",
      "library",
      "market",
      "museum",
      "palace",
      "prairie",
      "stadium",
      "theater",
      "village",
      "waterfall",
      "workshop",
    ],
  },
  {
    id: "technology",
    label: "Technology",
    words: [
      "browser",
      "compiler",
      "database",
      "debugger",
      "encryption",
      "function",
      "interface",
      "javascript",
      "keyboard",
      "network",
      "protocol",
      "react",
      "software",
      "terminal",
      "typescript",
      "variable",
    ],
  },
]

export function getCategoryById(categoryId: CategoryId) {
  return (
    WORD_CATEGORIES.find(category => category.id === categoryId) ??
    WORD_CATEGORIES[0]
  )
}
