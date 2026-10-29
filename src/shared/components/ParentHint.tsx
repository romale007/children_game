import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import styles from './ParentHint.module.css'

export default function ParentHint({ note }: { note: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrap}>
      <button className={styles.toggle} onClick={() => setOpen(!open)} aria-expanded={open}>
        Для взрослых
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={() => setOpen(false)}
          >
            {note}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
