import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { applause, bloop } from '../../../shared/audio/sfx'
import IconButton from '../../../shared/components/IconButton'
import ParentHint from '../../../shared/components/ParentHint'
import BalloonRow from '../components/BalloonRow'
import Bear, { type Pose } from '../components/Bear'
import FigureImage from '../components/FigureImage'
import { figureNames, type Figure, type Level } from '../levels'
import { useLater } from '../useLater'
import { phraseText, praisePhrase, say, sayThen } from '../voice'
import styles from './TaskScreen.module.css'

type Props = {
  level: Level
  index: number
  total: number
  solved: boolean
  mistakes: number
  lastWrong: Figure | null
  onAnswer: (figure: Figure) => void
  onNext: () => void
  onHome: () => void
}

// Pause after the praise before the next task, and the longest we wait for the voice to finish.
const NEXT_DELAY_MS = 700
const VOICE_TIMEOUT_MS = 7000

export default function TaskScreen({ level, index, total, solved, mistakes, lastWrong, onAnswer, onNext, onHome }: Props) {
  const later = useLater()
  // Taps are ignored while the reaction to a mistake plays, so the child hears it to the end.
  const [busy, setBusy] = useState(false)
  const attempt = useRef(0)
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

  const answer = (figure: Figure) => {
    if (busy || solved) return
    onAnswer(figure)
    if (figure === level.answer) return

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
          {level.options.map((figure, i) => {
            const isRight = solved && figure === level.answer
            const isWrong = lastWrong === figure && !solved
            const pulse = showHint && figure === level.answer
            return (
              <motion.button
                // Remount on every new mistake so the wobble replays.
                key={isWrong ? `${figure}-${mistakes}` : figure}
                className={`${styles.option} ${isRight ? styles.right : ''}`}
                aria-label={figureNames[figure]}
                onClick={() => answer(figure)}
                // Pop in when the task opens, but not on the remounts that replay a reaction.
                initial={mistakes === 0 ? { scale: 0, opacity: 0 } : false}
                animate={
                  isRight
                    ? { scale: 1.18, opacity: 1 }
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
                      : { type: 'spring', stiffness: 220, damping: 14, delay: solved ? 0 : 0.2 + i * 0.15 }
                }
              >
                <FigureImage figure={figure} />
              </motion.button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
