import { motion, type TargetAndTransition, type Transition } from 'motion/react'

/** What the host does: greets a new task, claps a right answer, shrugs a mistake, points at the hint. */
export type Pose = 'wave' | 'clap' | 'shrug' | 'point' | 'dance'

type Move = { animate: TargetAndTransition; transition: Transition }
type Parts = { body?: Move; head?: Move; left?: Move; right?: Move }

// Arms turn around the shoulder. Positive rotation swings a hanging arm to the left of the screen.
const poses: Record<Pose, Parts> = {
  wave: {
    right: { animate: { rotate: [0, -150, -115, -150, -115, -150, 0] }, transition: { duration: 2.2, delay: 0.3 } },
  },
  clap: {
    body: { animate: { y: [0, -18, 0, -10, 0] }, transition: { duration: 0.9 } },
    left: { animate: { rotate: [0, -55, -35, -55, -35, -55, -35, -55, 0] }, transition: { duration: 1.8 } },
    right: { animate: { rotate: [0, 55, 35, 55, 35, 55, 35, 55, 0] }, transition: { duration: 1.8 } },
  },
  shrug: {
    head: { animate: { rotate: [0, -10, -10, 0] }, transition: { duration: 1.2, times: [0, 0.25, 0.75, 1] } },
    left: { animate: { rotate: [0, 35, 35, 0] }, transition: { duration: 1.2, times: [0, 0.25, 0.75, 1] } },
    right: { animate: { rotate: [0, -35, -35, 0] }, transition: { duration: 1.2, times: [0, 0.25, 0.75, 1] } },
  },
  point: {
    head: { animate: { rotate: 8 }, transition: { type: 'spring', stiffness: 120 } },
    right: { animate: { rotate: -100 }, transition: { type: 'spring', stiffness: 120, damping: 10 } },
  },
  dance: {
    body: { animate: { y: [0, -24, 0], rotate: [0, -4, 4, 0] }, transition: { duration: 0.8, repeat: Infinity } },
    left: { animate: { rotate: [0, 150, 0] }, transition: { duration: 0.8, repeat: Infinity } },
    right: { animate: { rotate: [0, -150, 0] }, transition: { duration: 0.8, repeat: Infinity, delay: 0.4 } },
  },
}

const idleHead: Move = { animate: { rotate: [-3, 3, -3] }, transition: { duration: 3, repeat: Infinity } }

const fur = '#b07a4f'
const light = '#ecc9a0'
const dark = '#4a2c1a'

type Props = {
  pose: Pose
  /** Changing it replays the pose, e.g. a second shrug. */
  replay?: number
  className?: string
}

/** Тоша the bear cub, drawn from circles and ovals to match the game. */
export default function Bear({ pose, replay = 0, className }: Props) {
  const parts = poses[pose]
  const key = `${pose}-${replay}`
  const head = parts.head ?? idleHead

  return (
    <motion.svg
      key={key}
      viewBox="0 0 200 250"
      className={className}
      role="img"
      aria-label="Мишка Тоша"
      animate={parts.body?.animate}
      transition={parts.body?.transition}
      style={{ overflow: 'visible' }}
    >
      <ellipse cx="70" cy="232" rx="22" ry="14" fill={fur} />
      <ellipse cx="130" cy="232" rx="22" ry="14" fill={fur} />
      <ellipse cx="100" cy="178" rx="56" ry="58" fill={fur} />
      <ellipse cx="100" cy="186" rx="36" ry="40" fill={light} />

      <motion.g style={{ originX: 0.5, originY: 0.1 }} animate={parts.left?.animate} transition={parts.left?.transition}>
        <ellipse cx="50" cy="170" rx="15" ry="34" fill={fur} />
        <circle cx="50" cy="198" r="10" fill={light} />
      </motion.g>
      <motion.g
        style={{ originX: 0.5, originY: 0.1 }}
        animate={parts.right?.animate}
        transition={parts.right?.transition}
      >
        <ellipse cx="150" cy="170" rx="15" ry="34" fill={fur} />
        <circle cx="150" cy="198" r="10" fill={light} />
      </motion.g>

      <motion.g style={{ originX: 0.5, originY: 0.9 }} animate={head.animate} transition={head.transition}>
        <circle cx="56" cy="48" r="20" fill={fur} />
        <circle cx="56" cy="48" r="11" fill={light} />
        <circle cx="144" cy="48" r="20" fill={fur} />
        <circle cx="144" cy="48" r="11" fill={light} />
        <circle cx="100" cy="88" r="52" fill={fur} />
        <ellipse cx="100" cy="106" rx="26" ry="19" fill={light} />
        <ellipse cx="100" cy="97" rx="9" ry="6.5" fill={dark} />
        <path d="M90 112 Q100 120 110 112" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
        <circle cx="80" cy="80" r="6.5" fill={dark} />
        <circle cx="120" cy="80" r="6.5" fill={dark} />
        <circle cx="82" cy="78" r="2" fill="#fff" />
        <circle cx="122" cy="78" r="2" fill="#fff" />
        <circle cx="68" cy="100" r="7" fill="#f29b8f" opacity="0.6" />
        <circle cx="132" cy="100" r="7" fill="#f29b8f" opacity="0.6" />
      </motion.g>
    </motion.svg>
  )
}
