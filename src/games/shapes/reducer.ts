export type State =
  | { screen: 'start' }
  | {
      screen: 'task'
      part: number
      index: number
      solved: boolean
      mistakes: number
      /** Option the child tapped by mistake last time. */
      lastWrong: number | null
      /** Right options tapped so far: a task can ask for several («покажи все круги»). */
      found: number[]
      /** Mistakes made in each finished task, for the adult's summary. */
      log: number[]
    }
  | { screen: 'finish'; part: number; log: number[] }

export type Action =
  | { type: 'START'; part: number }
  | { type: 'ANSWER'; option: number; targets: number[] }
  | { type: 'NEXT'; total: number }
  | { type: 'HOME' }

export const initialState: State = { screen: 'start' }

const task = (part: number, index: number, log: number[]): State => ({
  screen: 'task',
  part,
  index,
  solved: false,
  mistakes: 0,
  lastWrong: null,
  found: [],
  log,
})

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return task(action.part, 0, [])
    case 'HOME':
      return initialState
    case 'ANSWER': {
      if (state.screen !== 'task' || state.solved || state.found.includes(action.option)) return state
      if (!action.targets.includes(action.option)) {
        return { ...state, mistakes: state.mistakes + 1, lastWrong: action.option }
      }
      const found = [...state.found, action.option]
      return { ...state, found, lastWrong: null, solved: found.length === action.targets.length }
    }
    case 'NEXT': {
      if (state.screen !== 'task' || !state.solved) return state
      const log = [...state.log, state.mistakes]
      return state.index + 1 < action.total
        ? task(state.part, state.index + 1, log)
        : { screen: 'finish', part: state.part, log }
    }
  }
}
