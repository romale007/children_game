import { motion } from 'motion/react'
import { useEffect } from 'react'
import HubLink from '../../../shared/components/HubLink'
import ParentHint from '../../../shared/components/ParentHint'
import { celebrate } from '../../../shared/confetti'
import { img } from '../assets'
import FallingLeaves from '../components/FallingLeaves'
import { finishNote } from '../levels'
import { say } from '../voice'
import styles from './FinishScreen.module.css'

export default function FinishScreen({ onRestart }: { onRestart: () => void }) {
  useEffect(() => {
    celebrate()
    say('finish')
  }, [])

  return (
    <div className={`screen ${styles.finish}`}>
      <FallingLeaves />
      <div className={styles.back}>
        <HubLink />
      </div>
      <div className={styles.corner}>
        <ParentHint note={finishNote} />
      </div>

      <motion.h1
        className={styles.title}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 10 }}
      >
        Молодец!
      </motion.h1>
      <p className={styles.subtitle}>Ты сосчитал до 10!</p>

      <div className={styles.friends}>
        {['hedgehog.webp', 'squirrel.webp'].map((name, i) => (
          <motion.img
            key={name}
            src={img(name)}
            alt=""
            className={styles.friend}
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 0.8, delay: i * 0.4, repeat: Infinity, repeatDelay: 0.4 }}
          />
        ))}
      </div>

      <button className="big-button" onClick={onRestart}>
        Играть ещё раз ↻
      </button>
    </div>
  )
}
