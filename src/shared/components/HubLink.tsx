import { Link } from 'react-router'
import styles from './HubLink.module.css'

/** Leaves the current game for the list of all games. */
export default function HubLink() {
  return (
    <Link to="/" className={styles.link}>
      ← Все игры
    </Link>
  )
}
