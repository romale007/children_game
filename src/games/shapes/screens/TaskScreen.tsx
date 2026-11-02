import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { applause, bloop, ding } from '../../../shared/audio/sfx'
import IconButton from '../../../shared/components/IconButton'
import ParentHint from '../../../shared/components/ParentHint'
import BalloonRow from '../components/BalloonRow'
import Bear, { type Pose } from '../components/Bear'
import FigureImage from '../components/FigureImage'
import House from '../components/House'
import { figureNames, optionFigure, targetsOf, type Level } from '../levels'
import { useLater } from '../useLater'
import { phraseText, praisePhrase, say, sayThen } from '../voice'
import styles from './TaskScreen.module.css'

type Props = {
  level: Level
  index: number
  total: number
  solved: boolean
  mistakes: number
  lastWrong: number | null
  found: number[]
  onAnswer: (option: number, targets: number[]) => void
  onNext: () => void
  onHome: () => void
}

// Pause after the praise before the next task, and the longest we wait for the voice to finish.
const NEXT_DELAY_MS = 700
const VOICE_TIMEOUT_MS = 7000

export default function TaskScreen(props: Props) {
  const { level, index, total, solved, mistakes, lastWrong, found, onAnswer, onNext, onHome } = props
  const later = useLater()
  // Taps are ignored while the reaction to a mistake plays, so the child hears it to the end.
  const [busy, setBusy] = useState(false)
  const attempt = useRef(0)
  const targets = targetsOf(level)
  const showHint = mistakes >= 2 && !solved

  useEffect(() => say(level.prompt), [level])

  useEffect(() => {
    if (!solved) return
    applause()
    let moved = false
    const next = () => {
      if (moved) return
      moved = true
      onNext()
    }
    sayThen([praisePhrase(index), level.success], () => later(next, NEXT_DELAY_MS))
    later(next, VOICE_TIMEOUT_MS)
    return () => {
      moved = true
    }
  }, [solved, level, index, onNext, later])

  const answer = (option: number) => {
    if (busy || solved || found.includes(option)) return
    onAnswer(option, targets)
    if (targets.includes(option)) {
      // One of several: a quiet bell now, the applause when the last one is found.
      if (found.length + 1 < targets.length) ding()
      return
    }

    bloop()
    setBusy(true)
    const current = ++attempt.current
    const release = () => {
      if (attempt.current === current) setBusy(false)
    }
    // Second mistake onwards: the bear points at the answer instead of repeating the task.
    const phrases = mistakes + 1 >= 2 ? [level.hint] : (['retry', level.prompt] as const)
    later(() => sayThen([...phrases], release), 350)
    later(release, VOICE_TIMEOUT_MS)
  }

  const pose: Pose = solved ? 'clap' : mistakes >= 2 ? 'point' : mistakes === 1 ? 'shrug' : 'wave'

  return (
    <div className="screen">
      <header className={styles.top}>
        <IconButton label="Домой" onClick={onHome}>
          🏠
        </IconButton>
        <div className={styles.progress}>
          <BalloonRow total={total} done={index + (solved ? 1 : 0)} />
        </div>
        <IconButton label="Повторить задание" onClick={() => say(level.prompt)}>
          🔊
        </IconButton>
      </header>

      <div className={styles.hintRow}>
        <p className={styles.prompt}>{phraseText(level.prompt)}</p>
        <ParentHint note={level.parentNote} />
      </div>

      <main className={styles.stage}>
        <Bear pose={pose} replay={mistakes} className={styles.bear} />
        <div className={styles.card}>
          {level.sample && (
            <div className={styles.sample} aria-label={`Образец: ${figureNames[level.sample]}`}>
              <FigureImage figure={level.sample} />
            </div>
          )}
          {level.scene === 'house' && <House complete={solved} className={styles.scene} />}

          <div className={styles.options} data-count={level.options.length}>
            {level.options.map((option, i) => {
              const figure = optionFigure(option)
              const look: { size?: number; rotate?: number } = typeof option === 'string' ? {} : option
              const isFound = found.includes(i)
              const isWrong = lastWrong === i && !solved
              const pulse = showHint && targets.includes(i) && !isFound
              return (
                <motion.button
                  // Remount on every new mistake so the wobble replays.
                  key={isWrong ? `${i}-${mistakes}` : i}
                  className={`${styles.option} ${isFound ? styles.right : ''}`}
                  aria-label={figureNames[figure]}
                  onClick={() => answer(i)}
                  // Pop in when the task opens, but not on the remounts that replay a reaction.
                  initial={mistakes === 0 && found.length === 0 ? { scale: 0, opacity: 0 } : false}
                  animate={
                    isFound
                      ? { scale: 1.15, opacity: 1 }
                      : solved
                        ? { scale: 1, opacity: 0.3 }
                        : isWrong
                          ? { scale: 1, rotate: [0, -10, 10, -6, 6, 0], opacity: [1, 0.4, 0.4, 1] }
                          : pulse
                            ? { scale: [1, 1.12, 1], opacity: 1 }
                            : { scale: 1, opacity: 1 }
                  }
                  transition={
                    isWrong
                      ? { duration: 1.4 }
                      : pulse
                        ? { duration: 1, repeat: Infinity }
                        : { type: 'spring', stiffness: 220, damping: 14, delay: solved || isFound ? 0 : 0.2 + i * 0.15 }
                  }
                >
                  <FigureImage figure={figure} size={look.size} rotate={look.rotate} />
                </motion.button>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
