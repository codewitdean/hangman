import { useEffect } from "react"
import type { FeedbackType } from "./useHangmanGame"

type SoundConfig = {
  duration: number
  frequency: number
  wave: OscillatorType
}

const SOUND_MAP: Record<FeedbackType, SoundConfig> = {
  correct: { duration: 0.1, frequency: 660, wave: "sine" },
  hint: { duration: 0.12, frequency: 520, wave: "triangle" },
  loss: { duration: 0.26, frequency: 150, wave: "sawtooth" },
  win: { duration: 0.22, frequency: 880, wave: "triangle" },
  wrong: { duration: 0.12, frequency: 180, wave: "square" },
}

function playSound(type: FeedbackType) {
  if (typeof window === "undefined") return

  const audioWindow = window as Window &
    typeof globalThis & {
      webkitAudioContext?: typeof AudioContext
    }
  const AudioContextClass =
    audioWindow.AudioContext ?? audioWindow.webkitAudioContext

  if (!AudioContextClass) return

  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const sound = SOUND_MAP[type]

  oscillator.type = sound.wave
  oscillator.frequency.setValueAtTime(sound.frequency, context.currentTime)
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + sound.duration,
  )

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + sound.duration)
  oscillator.onended = () => {
    void context.close()
  }
}

type Feedback = { id: number; type: FeedbackType } | null

/**
 * Plays a short synthesized sound whenever `feedback` changes.
 * Pass `muted: true` to suppress all audio.
 */
export function useFeedbackSound(feedback: Feedback, muted: boolean) {
  useEffect(() => {
    if (!feedback || muted) return
    playSound(feedback.type)
  }, [feedback, muted])
}
