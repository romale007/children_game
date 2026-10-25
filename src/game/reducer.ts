export type State =
  | { screen: 'start' }
  | { screen: 'task'; index: number; solved: boolean; mistakes: number; lastWrong: number | null }
  | { screen: 'finish' }

export type Action =
  | { type: 'START' }
  | { type: 'ANSWER'; value: number; correct: number }
  | { type: 'NEXT'; total: number }
  | { type: 'HOME' }

export const initialState: State = { screen: 'start' }

const task = (index: number): State => ({ screen: 'task', index, solved: false, mistakes: 0, lastWrong: null })

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return task(0)
    case 'HOME':
      return initialState
    case 'ANSWER':
      if (state.screen !== 'task' || state.solved) return state
      if (action.value === action.correct) return { ...state, solved: true, lastWrong: null }
      return { ...state, mistakes: state.mistakes + 1, lastWrong: action.value }
    case 'NEXT':
      if (state.screen !== 'task' || !state.solved) return state
      return state.index + 1 < action.total ? task(state.index + 1) : { screen: 'finish' }
  }
}
