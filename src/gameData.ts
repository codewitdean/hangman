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
      "badger", "beetle", "buffalo", "cheetah", "dolphin",
      "falcon", "giraffe", "hamster", "jaguar", "kangaroo",
      "lemur", "octopus", "penguin", "raven", "turtle",
      "walrus", "albatross", "armadillo", "axolotl", "barracuda",
      "capybara", "chameleon", "chimpanzee", "cockatoo", "crocodile",
      "flamingo", "gorilla", "hedgehog", "hippopotamus", "hyena",
      "iguana", "komodo", "manatee", "mongoose", "narwhal",
      "opossum", "orangutan", "porcupine", "rhinoceros", "salamander",
      "scorpion", "seahorse", "tarantula", "wolverine", "wombat",
    ],
  },
  {
    id: "food",
    label: "Food",
    words: [
      "apple", "bagel", "biscuit", "caramel", "dumpling",
      "gnocchi", "lasagna", "muffin", "noodle", "omelette",
      "paella", "pumpkin", "sandwich", "spinach", "tortilla",
      "waffle", "artichoke", "avocado", "blueberry", "broccoli",
      "bruschetta", "burrito", "calzone", "cannoli", "cappuccino",
      "casserole", "chimichanga", "croissant", "empanada", "enchilada",
      "focaccia", "gazpacho", "guacamole", "hummus", "jambalaya",
      "macaroon", "mozzarella", "pancetta", "prosciutto", "quesadilla",
      "ravioli", "risotto", "sourdough", "tiramisu", "tzatziki",
    ],
  },
  {
    id: "places",
    label: "Places",
    words: [
      "airport", "bakery", "campus", "canyon", "capital",
      "harbor", "library", "market", "museum", "palace",
      "prairie", "stadium", "theater", "village", "waterfall",
      "workshop", "amphitheater", "aquarium", "archipelago", "basilica",
      "boardwalk", "bungalow", "cathedral", "cemetery", "chateau",
      "colosseum", "courthouse", "crossroads", "dungeon", "embassy",
      "estuary", "farmhouse", "fjord", "foundry", "greenhouse",
      "gymnasium", "helipad", "lighthouse", "monastery", "observatory",
      "parliament", "peninsula", "planetarium", "quarry", "reservoir",
    ],
  },
  {
    id: "technology",
    label: "Technology",
    words: [
      "browser", "compiler", "database", "debugger", "encryption",
      "function", "interface", "javascript", "keyboard", "network",
      "protocol", "react", "software", "terminal", "typescript",
      "variable", "algorithm", "bandwidth", "blockchain", "bytecode",
      "callback", "capacitor", "checksum", "codebase", "container",
      "coroutine", "dashboard", "datatype", "endpoint", "ethernet",
      "firmware", "framework", "frontend", "gateway", "hashmap",
      "iterator", "latency", "middleware", "mutex", "namespace",
      "pipeline", "recursion", "refactor", "renderer", "runtime",
    ],
  },
]

export function getCategoryById(categoryId: CategoryId) {
  return (
    WORD_CATEGORIES.find(category => category.id === categoryId) ??
    WORD_CATEGORIES[0]
  )
}
