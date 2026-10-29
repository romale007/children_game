import { motion } from 'motion/react'
import { useEffect } from 'react'
import HubLink from '../../../shared/components/HubLink'
import ParentHint from '../../../shared/components/ParentHint'
import Bear from '../components/Bear'
import FigureImage from '../components/FigureImage'
import { startNote, type Figure } from '../levels'
import { preloadVoice, say } from '../voice'
import styles from './StartScreen.module.css'

const figures: Figure[] = ['circle', 'square', 'triangle']

export default function StartScreen({ onPlay }: { onPlay: () => void }) {
  useEffect(() => {
    preloadVoice()
    say('hello')
  }, [])

  return (
    <div className={`screen ${styles.start}`}>
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
        Фигуры
      </motion.h1>
      <p className={styles.subtitle}>Круг, квадрат, треугольник</p>

      <div className={styles.scene}>
        <Bear pose="wave" className={styles.bear} />
        <div className={styles.figures}>
          {figures.map((figure, i) => (
            <motion.div
              key={figure}
              className={styles.figure}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.6, delay: i * 0.3, repeat: Infinity }}
            >
              <FigureImage figure={figure} />
            </motion.div>
          ))}
        </div>
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
        Как играть: мишка называет фигуру, ребёнок нажимает на неё. За каждое задание мишка дарит воздушный шарик.
      </p>
    </div>
  )
}
