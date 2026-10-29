import { Link } from 'react-router'
import { canPlay } from '../games/access'
import type { GameManifest } from '../games/types'
import styles from './GameCard.module.css'

export default function GameCard({ game }: { game: GameManifest }) {
  const open = canPlay(game)
  const content = (
    <>
      <div className={styles.cover} style={{ background: game.color }}>
        <img src={game.cover} alt="" className={styles.image} />
        {!open && <span className={styles.lock}>🔒 По подписке</span>}
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{game.title}</h2>
        <p className={styles.description}>{game.description}</p>
        <span className={styles.age}>{game.age}</span>
      </div>
    </>
  )

  if (!open) return <div className={`${styles.card} ${styles.locked}`}>{content}</div>

  return (
    <Link
      to={`/${game.id}`}
      className={`${styles.card} ${styles.open}`}
      // Start fetching the game's code as soon as the child reaches for the card.
      onPointerEnter={game.load}
      onFocus={game.load}
    >
      {content}
    </Link>
  )
}
