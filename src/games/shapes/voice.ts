import { createVoice } from '../../shared/audio/voice'
import { assetDir } from './assets'
import phrases from './phrases.json'

export type PhraseId = keyof typeof phrases

export const { say, sayThen, preload: preloadVoice } = createVoice(`${assetDir}/audio`, phrases)

export const phraseText = (id: PhraseId) => phrases[id]

/** Praise words take turns so the child doesn't hear the same one every time. */
export const praisePhrase = (index: number) => `praise-${(index % 3) + 1}` as PhraseId
