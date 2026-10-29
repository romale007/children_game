import { createVoice } from '../../shared/audio/voice'
import { assetDir } from './assets'
import phrases from './phrases.json'

export type PhraseId = keyof typeof phrases

export const { say, preload: preloadVoice } = createVoice(`${assetDir}/audio`, phrases)

export const countPhrase = (n: number) => `count-${n}` as PhraseId
