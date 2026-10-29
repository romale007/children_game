import autumnCount from './autumn-count/manifest'
import shapes from './shapes/manifest'
import type { GameManifest } from './types'

/** Order here is the order of cards on the hub. */
export const games: GameManifest[] = [autumnCount, shapes]

export const findGame = (id: string | undefined) => games.find((game) => game.id === id)
