import confetti from 'canvas-confetti'

const colors = ['#f6a54a', '#e2552d', '#ffd166', '#8fbf4d', '#b5651d']

export function burst() {
  confetti({ particleCount: 70, spread: 75, origin: { y: 0.7 }, colors, disableForReducedMotion: true })
}

export function celebrate() {
  const end = Date.now() + 1500
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors, disableForReducedMotion: true })
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors, disableForReducedMotion: true })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
