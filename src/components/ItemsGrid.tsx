import { motion } from 'motion/react'
import styles from './ItemsGrid.module.css'

type Props = {
  image: string
  name: string
  count: number
  marks: Record<number, number>
  onTap: (index: number) => void
}

export default function ItemsGrid({ image, name, count, marks, onTap }: Props) {
  const columns = count <= 5 ? count : Math.ceil(count / 2)

  return (
    <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: count }, (_, i) => {
        const mark = marks[i]
        return (
          <motion.button
            key={i}
            className={styles.item}
            onClick={() => onTap(i)}
            aria-label={mark ? `${name}, ${mark}` : name}
            initial={{ scale: 0, rotate: -20 }}
            animate={mark ? { scale: [1, 1.25, 1], rotate: 0 } : { scale: 1, rotate: 0 }}
            transition={{ delay: mark ? 0 : 0.15 + i * 0.08, type: 'spring', stiffness: 300, damping: 15 }}
          >
            <img src={image} alt="" className={styles.image} draggable={false} />
            {mark && (
              <motion.span className={styles.mark} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                {mark}
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
