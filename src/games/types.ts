import type { ComponentType } from 'react'

export type GameAccess = 'free' | 'premium'

/** Everything the hub and the router need to know about a game without loading its code. */
export type GameManifest = {
  /** Used in the URL: #/<id> */
  id: string
  title: string
  description: string
  age: string
  cover: string
  /** Card background. */
  color: string
  access: GameAccess
  /** Loads the game's code (a separate chunk) only when it's opened. */
  load: () => Promise<{ default: ComponentType }>
}
