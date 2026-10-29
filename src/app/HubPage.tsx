import { games } from '../games/registry'
import GameCard from './GameCard'
import styles from './HubPage.module.css'

export default function HubPage() {
  return (
    <div className={styles.hub}>
      <header className={styles.header}>
        <h1 className={styles.title}>Детские игры</h1>
        <p className={styles.subtitle}>Выбери игру</p>
      </header>
      <main className={styles.grid}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </main>
    </div>
  )
}
