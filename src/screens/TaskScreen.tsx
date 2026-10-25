import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import FallingLeaves from '../components/FallingLeaves'
import IconButton from '../components/IconButton'
import ItemsGrid from '../components/ItemsGrid'
import ParentHint from '../components/ParentHint'
import { burst } from '../game/confetti'
import { countPhrase, say } from '../game/audio'
import type { Level } from '../levels'
import styles from './TaskScreen.module.css'

type Props = {
  level: Level
  number: number
  solved: boolean
  mistakes: number
  lastWrong: number | null
  onAnswer: (value: number) => void
  onNext: () => void
  onHome: () => void
}

const NEXT_DELAY_MS = 1800

export default function TaskScreen({ level, number, solved, mistakes, lastWrong, onAnswer, onNext, onHome }: Props) {
  // Item index → the number the child said when tapping it.
  const [marks, setMarks] = useState<Record<number, number>>({})

  useEffect(() => say(level.questionAudio), [level])

  useEffect(() => {
    if (!solved) return
    burst()
    say('right', countPhrase(level.count))
    const timer = setTimeout(onNext, NEXT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [solved, level, onNext])

  const answer = (value: number) => {
    if (value !== level.count) {
      say('try-again')
      setMarks({})
    }
    onAnswer(value)
  }

  const tapItem = (index: number) => {
    if (marks[index]) return
    const next = Object.keys(marks).length + 1
    setMarks({ ...marks, [index]: next })
    say(countPhrase(next))
  }

  return (
    <div className="screen">
      <FallingLeaves />
      <header className={styles.top}>
        <IconButton label="Домой" onClick={onHome}>
          🏠
        </IconButton>
        <div className={styles.title}>
          <div className={styles.badge}>Задание {number}</div>
          <h1 className={styles.question}>{level.question}</h1>
        </div>
        <IconButton label="Прочитать вопрос" onClick={() => say(level.questionAudio)}>
          🔊
        </IconButton>
      </header>

      <div className={styles.hintRow}>
        <p className={styles.hint}>
          {mistakes >= 2 ? 'Давай посчитаем вместе: нажимай на каждый предмет 👆' : 'Считай слева направо и нажми на цифру'}
        </p>
        <ParentHint note={level.parentNote} />
      </div>

      <main className={styles.stage}>
        {level.character && (
          <motion.img
            src={level.character}
            alt=""
            className={styles.character}
            animate={solved ? { y: [0, -40, 0, -25, 0] } : { y: 0 }}
            transition={{ duration: 0.9 }}
          />
        )}
        <div className={styles.card}>
          <ItemsGrid image={level.itemImage} name={level.itemName} count={level.count} marks={marks} onTap={tapItem} />
        </div>
      </main>

      <footer className={styles.answers}>
        {level.options.map((value) => {
          const isWrong = lastWrong === value
          const isRight = solved && value === level.count
          return (
            <motion.button
              // Remount on every new mistake so the shake replays.
              key={isWrong ? `${value}-${mistakes}` : value}
              className={`${styles.answer} ${isWrong ? styles.wrong : ''} ${isRight ? styles.right : ''}`}
              onClick={() => answer(value)}
              disabled={solved}
              animate={isWrong ? { x: [0, -14, 14, -10, 10, 0] } : isRight ? { scale: [1, 1.2, 1.1] } : {}}
              transition={{ duration: 0.45 }}
            >
              {value}
            </motion.button>
          )
        })}
      </footer>

      <AnimatePresence>
        {solved && (
          <motion.div
            className={styles.praise}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          >
            Верно! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
