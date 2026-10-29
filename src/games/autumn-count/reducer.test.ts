import { describe, expect, it } from 'vitest'
import { initialState, reducer, type State } from './reducer'

const answer = (state: State, value: number) => reducer(state, { type: 'ANSWER', value, correct: 5 })

describe('reducer', () => {
  it('starts at the first task', () => {
    expect(reducer(initialState, { type: 'START' })).toEqual({
      screen: 'task',
      index: 0,
      solved: false,
      mistakes: 0,
      lastWrong: null,
    })
  })

  it('keeps the task open on a wrong answer and counts the mistake', () => {
    const state = answer(answer(reducer(initialState, { type: 'START' }), 4), 6)
    expect(state).toMatchObject({ screen: 'task', index: 0, solved: false, mistakes: 2, lastWrong: 6 })
  })

  it('marks the task solved on the right answer and ignores further answers', () => {
    const solved = answer(reducer(initialState, { type: 'START' }), 5)
    expect(solved).toMatchObject({ solved: true, lastWrong: null })
    expect(answer(solved, 4)).toBe(solved)
  })

  it('does not advance until the task is solved', () => {
    const state = reducer(initialState, { type: 'START' })
    expect(reducer(state, { type: 'NEXT', total: 4 })).toBe(state)
  })

  it('moves to the next task, then to the finish screen', () => {
    let state = reducer(initialState, { type: 'START' })
    for (let i = 0; i < 3; i++) {
      state = reducer(answer(state, 5), { type: 'NEXT', total: 4 })
      expect(state).toMatchObject({ screen: 'task', index: i + 1, solved: false, mistakes: 0 })
    }
    expect(reducer(answer(state, 5), { type: 'NEXT', total: 4 })).toEqual({ screen: 'finish' })
  })

  it('goes home from anywhere', () => {
    expect(reducer({ screen: 'finish' }, { type: 'HOME' })).toEqual(initialState)
  })
})
