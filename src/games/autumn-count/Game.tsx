import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useReducer } from 'react'
import { stopAudio } from '../../shared/audio/voice'
import { initialState, reducer } from './reducer'
import { levels } from './levels'
import FinishScreen from './screens/FinishScreen'
import StartScreen from './screens/StartScreen'
import TaskScreen from './screens/TaskScreen'

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState)
  // Don't keep talking after the player leaves the game.
  useEffect(() => stopAudio, [])
  // Stable so TaskScreen's auto-advance timer isn't reset by re-renders.
  const next = useCallback(() => dispatch({ type: 'NEXT', total: levels.length }), [])
  const key = state.screen === 'task' ? `task-${state.index}` : state.screen

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -60 }}
        transition={{ duration: 0.3 }}
      >
        {state.screen === 'start' && <StartScreen onPlay={() => dispatch({ type: 'START' })} />}
        {state.screen === 'task' && (
          <TaskScreen
            level={levels[state.index]}
            number={state.index + 1}
            solved={state.solved}
            mistakes={state.mistakes}
            lastWrong={state.lastWrong}
            onAnswer={(value) => dispatch({ type: 'ANSWER', value, correct: levels[state.index].count })}
            onNext={next}
            onHome={() => dispatch({ type: 'HOME' })}
          />
        )}
        {state.screen === 'finish' && <FinishScreen onRestart={() => dispatch({ type: 'START' })} />}
      </motion.div>
    </AnimatePresence>
  )
}
