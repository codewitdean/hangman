import { useEffect, useState } from "react"

type SetStateAction<T> = T | ((currentValue: T) => T)

function readStoredValue<T>(key: string, fallbackValue: T) {
  if (typeof window === "undefined") return fallbackValue

  try {
    const storedValue = window.localStorage.getItem(key)
    if (!storedValue) return fallbackValue

    const parsed = JSON.parse(storedValue) as T

    // If both values are plain objects, merge so any newly added fields
    // in the fallback are present even when loading older stored data.
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      fallbackValue !== null &&
      typeof fallbackValue === "object" &&
      !Array.isArray(fallbackValue)
    ) {
      return { ...fallbackValue, ...parsed } as T
    }

    return parsed
  } catch {
    return fallbackValue
  }
}

export function useLocalStorageState<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallbackValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Local storage can be unavailable in private or restricted browsing modes.
    }
  }, [key, value])

  const setStoredValue = (nextValue: SetStateAction<T>) => {
    setValue(currentValue =>
      typeof nextValue === "function"
        ? (nextValue as (currentValue: T) => T)(currentValue)
        : nextValue,
    )
  }

  return [value, setStoredValue] as const
}
