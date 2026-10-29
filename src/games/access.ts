import type { GameManifest } from './types'

/**
 * The only place that decides whether a game can be opened. Everything is open for now;
 * the subscription check for `access: 'premium'` games goes here.
 */
export function canPlay(_game: GameManifest) {
  return true
}
