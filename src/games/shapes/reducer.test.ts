import { describe, expect, it } from 'vitest'
import type { Figure } from './levels'
import { initialState, reducer, type State } from './reducer'

const answer = (state: State, figure: Figure) => reducer(state, { type: 'ANSWER', figure, correct: 'circle' })
const start = () => reducer(initialState, { type: 'START' })

describe('reducer', () => {
  it('starts at the first task', () => {
    expect(start()).toEqual({ screen: 'task', index: 0, solved: false, mistakes: 0, lastWrong: null, log: [] })
  })

  it('keeps the task open on a wrong answer and counts the mistake', () => {
    const state = answer(answer(start(), 'square'), 'triangle')
    expect(state).toMatchObject({ screen: 'task', index: 0, solved: false, mistakes: 2, lastWrong: 'triangle' })
  })

  it('marks the task solved on the right answer and ignores further answers', () => {
    const solved = answer(start(), 'circle')
    expect(solved).toMatchObject({ solved: true, lastWrong: null })
    expect(answer(solved, 'square')).toBe(solved)
  })

  it('does not advance until the task is solved', () => {
    const state = start()
    expect(reducer(state, { type: 'NEXT', total: 3 })).toBe(state)
  })

  it('logs mistakes per task and finishes after the last one', () => {
    let state = reducer(answer(start(), 'circle'), { type: 'NEXT', total: 3 })
    expect(state).toMatchObject({ screen: 'task', index: 1, mistakes: 0, log: [0] })
    state = reducer(answer(answer(answer(state, 'cube'), 'square'), 'circle'), { type: 'NEXT', total: 3 })
    expect(state).toMatchObject({ index: 2, log: [0, 2] })
    expect(reducer(answer(state, 'circle'), { type: 'NEXT', total: 3 })).toEqual({ screen: 'finish', log: [0, 2, 0] })
  })

  it('goes home from anywhere', () => {
    expect(reducer({ screen: 'finish', log: [] }, { type: 'HOME' })).toEqual(initialState)
  })
})
