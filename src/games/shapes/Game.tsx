import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useReducer } from 'react'
import { stopAudio } from '../../shared/audio/voice'
import styles from './Game.module.css'
import { levels } from './levels'
import { initialState, reducer } from './reducer'
import FinishScreen from './screens/FinishScreen'
import StartScreen from './screens/StartScreen'
import TaskScreen from './screens/TaskScreen'

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState)
  // Don't keep talking after the player leaves the game.
  useEffect(() => stopAudio, [])
  // Stable so TaskScreen's auto-advance isn't restarted by re-renders.
  const next = useCallback(() => dispatch({ type: 'NEXT', total: levels.length }), [])
  const key = state.screen === 'task' ? `task-${state.index}` : state.screen

  return (
    <div className={styles.theme}>
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
              index={state.index}
              total={levels.length}
              solved={state.solved}
              mistakes={state.mistakes}
              lastWrong={state.lastWrong}
              onAnswer={(figure) => dispatch({ type: 'ANSWER', figure, correct: levels[state.index].answer })}
              onNext={next}
              onHome={() => dispatch({ type: 'HOME' })}
            />
          )}
          {state.screen === 'finish' && (
            <FinishScreen log={state.log} onRestart={() => dispatch({ type: 'START' })} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
