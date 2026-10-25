import { Howl } from 'howler'
import phrases from './phrases.json'
import { speak, stopSpeech } from './speech'

export type PhraseId = keyof typeof phrases

const sounds = new Map<PhraseId, Howl>()
// Howler keeps a failed sound in the 'loading' state, so failures are tracked here.
const failed = new Set<PhraseId>()
// The sound the current sequence is waiting on, and what to do if it fails to load.
let waiting: { id: PhraseId; fallback: () => void } | undefined
// Bumped on every say() so callbacks from an interrupted sequence do nothing.
let generation = 0

function sound(id: PhraseId) {
  let howl = sounds.get(id)
  if (!howl) {
    howl = new Howl({
      src: [`${import.meta.env.BASE_URL}audio/${id}.mp3`],
      onloaderror: () => {
        failed.add(id)
        if (waiting?.id === id) waiting.fallback()
      },
    })
    sounds.set(id, howl)
  }
  return howl
}

export function preloadAudio() {
  for (const id of Object.keys(phrases) as PhraseId[]) sound(id)
}

export const countPhrase = (n: number) => `count-${n}` as PhraseId

function stopAll() {
  waiting = undefined
  for (const howl of sounds.values()) {
    howl.off('end')
    howl.stop()
  }
  stopSpeech()
}

/** Plays the phrases one after another, interrupting whatever is playing now. */
export function say(...ids: PhraseId[]) {
  const current = ++generation
  stopAll()

  const step = (i: number) => {
    if (current !== generation || i >= ids.length) return
    const id = ids[i]
    // Speak the rest of the sequence with the browser voice if this file is unavailable.
    const fallback = () => {
      if (current === generation) speak(ids.slice(i).map((rest) => phrases[rest]).join(' '))
    }
    if (failed.has(id)) return fallback()
    waiting = { id, fallback }
    const howl = sound(id)
    howl.once('end', () => step(i + 1))
    howl.play()
  }
  step(0)
}
