import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useReducer } from 'react'
import { stopAudio } from '../../shared/audio/voice'
import styles from './Game.module.css'
import { parts } from './levels'
import { initialState, reducer } from './reducer'
import FinishScreen from './screens/FinishScreen'
import StartScreen from './screens/StartScreen'
import TaskScreen from './screens/TaskScreen'

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState)
  // Don't keep talking after the player leaves the game.
  useEffect(() => stopAudio, [])
  const levels = state.screen === 'start' ? [] : parts[state.part].levels
  // Stable so TaskScreen's auto-advance isn't restarted by re-renders.
  const next = useCallback(() => dispatch({ type: 'NEXT', total: levels.length }), [levels.length])
  const start = (part: number) => dispatch({ type: 'START', part })
  const key = state.screen === 'start' ? 'start' : `${state.screen}-${state.part}-${state.screen === 'task' ? state.index : ''}`

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
          {state.screen === 'start' && <StartScreen onPlay={start} />}
          {state.screen === 'task' && (
            <TaskScreen
              level={levels[state.index]}
              index={state.index}
              total={levels.length}
              solved={state.solved}
              mistakes={state.mistakes}
              lastWrong={state.lastWrong}
              found={state.found}
              onAnswer={(option, targets) => dispatch({ type: 'ANSWER', option, targets })}
              onNext={next}
              onHome={() => dispatch({ type: 'HOME' })}
            />
          )}
          {state.screen === 'finish' && (
            <FinishScreen
              part={parts[state.part]}
              log={state.log}
              onRestart={() => start(state.part)}
              onNextPart={state.part + 1 < parts.length ? () => start(state.part + 1) : undefined}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
