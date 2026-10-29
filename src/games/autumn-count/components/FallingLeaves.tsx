import { motion } from 'motion/react'
import { decoLeaves } from '../levels'
import styles from './FallingLeaves.module.css'

const leaves = [
  { left: '3%', size: 70, delay: 0, duration: 7 },
  { left: '18%', size: 50, delay: 2.5, duration: 9 },
  { left: '78%', size: 64, delay: 1, duration: 8 },
  { left: '92%', size: 46, delay: 4, duration: 10 },
  { left: '55%', size: 40, delay: 6, duration: 11 },
]

export default function FallingLeaves() {
  return (
    <div className={styles.layer} aria-hidden>
      {leaves.map((leaf, i) => (
        <motion.img
          key={i}
          src={decoLeaves[i % decoLeaves.length]}
          className={styles.leaf}
          style={{ left: leaf.left, width: leaf.size }}
          initial={{ y: '-15vh', rotate: 0, opacity: 0 }}
          animate={{ y: '110vh', rotate: 360, x: [0, 30, -20, 15, 0], opacity: [0, 0.9, 0.9, 0.9, 0] }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}
