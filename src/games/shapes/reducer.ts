import type { Figure } from './levels'

export type State =
  | { screen: 'start' }
  | {
      screen: 'task'
      index: number
      solved: boolean
      mistakes: number
      lastWrong: Figure | null
      /** Mistakes made in each finished task, for the adult's summary. */
      log: number[]
    }
  | { screen: 'finish'; log: number[] }

export type Action =
  | { type: 'START' }
  | { type: 'ANSWER'; figure: Figure; correct: Figure }
  | { type: 'NEXT'; total: number }
  | { type: 'HOME' }

export const initialState: State = { screen: 'start' }

const task = (index: number, log: number[]): State => ({
  screen: 'task',
  index,
  solved: false,
  mistakes: 0,
  lastWrong: null,
  log,
})

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return task(0, [])
    case 'HOME':
      return initialState
    case 'ANSWER':
      if (state.screen !== 'task' || state.solved) return state
      if (action.figure === action.correct) return { ...state, solved: true, lastWrong: null }
      return { ...state, mistakes: state.mistakes + 1, lastWrong: action.figure }
    case 'NEXT': {
      if (state.screen !== 'task' || !state.solved) return state
      const log = [...state.log, state.mistakes]
      return state.index + 1 < action.total ? task(state.index + 1, log) : { screen: 'finish', log }
    }
  }
}
