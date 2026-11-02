import { motion } from 'motion/react'
import { useEffect } from 'react'
import HubLink from '../../../shared/components/HubLink'
import ParentHint from '../../../shared/components/ParentHint'
import Bear from '../components/Bear'
import FigureImage from '../components/FigureImage'
import { parts, startNote } from '../levels'
import { preloadVoice, say } from '../voice'
import styles from './StartScreen.module.css'

export default function StartScreen({ onPlay }: { onPlay: (part: number) => void }) {
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

      <div className={styles.scene}>
        <Bear pose="wave" className={styles.bear} />
        <div className={styles.parts}>
          {parts.map((part, i) => (
            <motion.button
              key={part.title}
              className={styles.part}
              onClick={() => onPlay(i)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 + i * 0.15 }}
            >
              <span className={styles.figures}>
                {part.figures.map((figure, j) => (
                  <motion.span
                    key={figure}
                    className={styles.figure}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.6, delay: j * 0.3, repeat: Infinity }}
                  >
                    <FigureImage figure={figure} />
                  </motion.span>
                ))}
              </span>
              <span className={styles.partTitle}>{part.title} ▶</span>
            </motion.button>
          ))}
        </div>
      </div>

      <p className={styles.howto}>
        Как играть: мишка называет фигуру, ребёнок нажимает на неё. За каждое задание мишка дарит воздушный шарик.
        Вторая часть сложнее первой.
      </p>
    </div>
  )
}
