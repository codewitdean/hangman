import { useEffect, useState } from "react"

export type WordDefinition = {
  definition: string
  partOfSpeech: string
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { definition: WordDefinition; status: "success" }
  | { status: "error" }

/**
 * Fetches the first definition of `word` from the Free Dictionary API.
 * Only fetches when `enabled` is true (i.e., the round is over).
 */
export function useWordDefinition(word: string, enabled: boolean): FetchState {
  const [state, setState] = useState<FetchState>({ status: "idle" })

  useEffect(() => {
    if (!enabled || !word) return

    let cancelled = false
    setState({ status: "loading" })

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
      .then(res => {
        if (!res.ok) throw new Error("not found")
        return res.json() as Promise<unknown>
      })
      .then(data => {
        if (cancelled) return

        // Safely navigate the API response shape
        const entries = data as Array<{
          meanings?: Array<{
            partOfSpeech?: string
            definitions?: Array<{ definition?: string }>
          }>
        }>

        const firstMeaning = entries[0]?.meanings?.[0]
        const partOfSpeech = firstMeaning?.partOfSpeech ?? ""
        const definition = firstMeaning?.definitions?.[0]?.definition ?? ""

        if (definition) {
          setState({ status: "success", definition: { definition, partOfSpeech } })
        } else {
          setState({ status: "error" })
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" })
      })

    return () => {
      cancelled = true
    }
  }, [word, enabled])

  // Reset to idle whenever the round changes (word changes)
  useEffect(() => {
    setState({ status: "idle" })
  }, [word])

  return state
}
