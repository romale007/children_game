import type { ReactNode } from 'react'
import styles from './IconButton.module.css'

type Props = { label: string; onClick: () => void; children: ReactNode }

export default function IconButton({ label, onClick, children }: Props) {
  return (
    <button className={styles.button} onClick={onClick} aria-label={label} title={label}>
      {children}
    </button>
  )
}
