import { motion } from 'motion/react'
import { useEffect } from 'react'
import HubLink from '../../../shared/components/HubLink'
import ParentHint from '../../../shared/components/ParentHint'
import { img } from '../assets'
import FallingLeaves from '../components/FallingLeaves'
import { levels, startNote } from '../levels'
import { preloadVoice } from '../voice'
import styles from './StartScreen.module.css'

export default function StartScreen({ onPlay }: { onPlay: () => void }) {
  // Fetch the voice-over while the child is still on the start screen.
  useEffect(preloadVoice, [])

  return (
    <div className={`screen ${styles.start}`}>
      <FallingLeaves />
      <div className={styles.back}>
        <HubLink />
      </div>
      <div className={styles.corner}>
        <ParentHint note={startNote} />
      </div>

      <motion.h1
        className={styles.title}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      >
        Осенний счёт
      </motion.h1>
      <p className={styles.subtitle}>Считаем до 10. Игра для детей 5 лет</p>

      <div className={styles.scene}>
        <motion.img
          src={img('hedgehog.webp')}
          alt="Ёжик"
          className={styles.hero}
          animate={{ rotate: [0, -4, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <div className={styles.items}>
          {levels.map((level, i) => (
            <motion.img
              key={level.itemName}
              src={level.itemImage}
              alt=""
              className={styles.item}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.6, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </div>
        <motion.img
          src={img('squirrel.webp')}
          alt="Белочка"
          className={styles.hero}
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
        />
      </div>

      <motion.button
        className="big-button"
        onClick={onPlay}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        Играть ▶
      </motion.button>

      <p className={styles.howto}>
        Как играть: ребёнок считает предметы и нажимает на цифру. Верный ответ открывает следующее задание.
      </p>
    </div>
  )
}
