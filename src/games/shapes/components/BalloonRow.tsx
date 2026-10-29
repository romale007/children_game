import { motion } from 'motion/react'
import Balloon from './Balloon'
import { balloonColors } from './balloonColors'
import styles from './BalloonRow.module.css'

/** Progress the child can read without numbers: a balloon per finished task, empty slots for the rest. */
export default function BalloonRow({ total, done }: { total: number; done: number }) {
  return (
    <div className={styles.row} aria-label={`Выполнено ${done} из ${total}`}>
      {Array.from({ length: total }, (_, i) =>
        i < done ? (
          <motion.div
            key={i}
            className={styles.slot}
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 12 }}
          >
            <Balloon color={balloonColors[i % balloonColors.length]} className={styles.balloon} />
          </motion.div>
        ) : (
          <div key={i} className={`${styles.slot} ${styles.empty}`} />
        ),
      )}
    </div>
  )
}
