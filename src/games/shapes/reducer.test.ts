import { describe, expect, it } from 'vitest'
import { initialState, reducer, type State } from './reducer'

// Option 0 is the right one unless a test says otherwise.
const answer = (state: State, option: number, targets = [0]) => reducer(state, { type: 'ANSWER', option, targets })
const start = (part = 0) => reducer(initialState, { type: 'START', part })

describe('reducer', () => {
  it('starts at the first task of the chosen part', () => {
    expect(start(1)).toEqual({
      screen: 'task',
      part: 1,
      index: 0,
      solved: false,
      mistakes: 0,
      lastWrong: null,
      found: [],
      log: [],
    })
  })

  it('keeps the task open on a wrong answer and counts the mistake', () => {
    const state = answer(answer(start(), 1), 2)
    expect(state).toMatchObject({ screen: 'task', index: 0, solved: false, mistakes: 2, lastWrong: 2 })
  })

  it('marks the task solved on the right answer and ignores further answers', () => {
    const solved = answer(start(), 0)
    expect(solved).toMatchObject({ solved: true, lastWrong: null, found: [0] })
    expect(answer(solved, 1)).toBe(solved)
  })

  it('needs every target when a task has several', () => {
    const one = answer(start(), 3, [0, 3])
    expect(one).toMatchObject({ solved: false, found: [3] })
    expect(answer(one, 3, [0, 3])).toBe(one)
    expect(answer(answer(one, 1, [0, 3]), 0, [0, 3])).toMatchObject({ solved: true, mistakes: 1, found: [3, 0] })
  })

  it('does not advance until the task is solved', () => {
    const state = start()
    expect(reducer(state, { type: 'NEXT', total: 3 })).toBe(state)
  })

  it('logs mistakes per task and finishes the part after its last task', () => {
    let state = reducer(answer(start(1), 0), { type: 'NEXT', total: 3 })
    expect(state).toMatchObject({ screen: 'task', part: 1, index: 1, mistakes: 0, log: [0] })
    state = reducer(answer(answer(answer(state, 1), 2), 0), { type: 'NEXT', total: 3 })
    expect(state).toMatchObject({ index: 2, log: [0, 2] })
    expect(reducer(answer(state, 0), { type: 'NEXT', total: 3 })).toEqual({ screen: 'finish', part: 1, log: [0, 2, 0] })
  })

  it('goes home from anywhere', () => {
    expect(reducer({ screen: 'finish', part: 0, log: [] }, { type: 'HOME' })).toEqual(initialState)
  })
})
