import { motion } from 'motion/react'
import { useEffect } from 'react'
import { fanfare } from '../../../shared/audio/sfx'
import HubLink from '../../../shared/components/HubLink'
import ParentHint from '../../../shared/components/ParentHint'
import { celebrate } from '../../../shared/confetti'
import Balloon from '../components/Balloon'
import { balloonColors } from '../components/balloonColors'
import Bear from '../components/Bear'
import { finishNote, type Part } from '../levels'
import { say } from '../voice'
import styles from './FinishScreen.module.css'

/** For the adult: which tasks needed the hint (2+ mistakes) or had one mistake. */
function summary(log: number[]) {
  const tasks = (match: (mistakes: number) => boolean) =>
    log.flatMap((mistakes, i) => (match(mistakes) ? [i + 1] : [])).join(', ')
  const hinted = tasks((m) => m >= 2)
  const slipped = tasks((m) => m === 1)
  if (!hinted && !slipped) return 'Все задания выполнены без ошибок.'
  return [hinted && `Подсказка понадобилась в заданиях: ${hinted}.`, slipped && `Одна ошибка в заданиях: ${slipped}.`]
    .filter(Boolean)
    .join(' ')
}

type Props = {
  part: Part
  log: number[]
  onRestart: () => void
  /** Missing after the last part. */
  onNextPart?: () => void
}

export default function FinishScreen({ part, log, onRestart, onNextPart }: Props) {
  useEffect(() => {
    celebrate()
    fanfare()
    say(part.finishPhrase)
  }, [part])

  return (
    <div className={`screen ${styles.finish}`}>
      <div className={styles.back}>
        <HubLink />
      </div>
      <div className={styles.corner}>
        <ParentHint note={finishNote} />
      </div>

      {/* The balloons collected during the game fly away. */}
      <div className={styles.sky} aria-hidden="true">
        {log.map((_, i) => (
          <motion.div
            key={i}
            className={styles.flying}
            style={{ left: `${8 + (i * 84) / Math.max(log.length - 1, 1)}%` }}
            initial={{ y: 0 }}
            animate={{ y: '-120dvh', x: [0, 14, -14, 0] }}
            transition={{ duration: 5, delay: 0.4 + i * 0.25, ease: 'easeIn' }}
          >
            <Balloon color={balloonColors[i % balloonColors.length]} className={styles.balloon} />
          </motion.div>
        ))}
      </div>

      <motion.h1
        className={styles.title}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 10 }}
      >
        Ура!
      </motion.h1>
      <p className={styles.subtitle}>{part.finishTitle}</p>

      <Bear pose="dance" className={styles.bear} />

      <div className={styles.buttons}>
        <button className={onNextPart ? styles.again : 'big-button'} onClick={onRestart}>
          Играть ещё раз ↻
        </button>
        {onNextPart && (
          <button className="big-button" onClick={onNextPart}>
            Дальше ▶
          </button>
        )}
      </div>

      <p className={styles.summary}>{summary(log)}</p>
    </div>
  )
}
