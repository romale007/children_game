import styles from './Loading.module.css'

export default function Loading() {
  return (
    <div className={styles.wrap} role="status">
      <div className={styles.spinner} />
      Загружаем игру…
    </div>
  )
}
