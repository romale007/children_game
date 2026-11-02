import { motion } from 'motion/react'

/** «Чего не хватает домику?»: walls without a roof; the roof drops in once the child finds the triangle. */
export default function House({ complete, className }: { complete: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 200 170" className={className} role="img" aria-label="Домик">
      <line x1="10" y1="164" x2="190" y2="164" stroke="#7fbf7a" strokeWidth="6" strokeLinecap="round" />
      <rect x="50" y="80" width="100" height="84" fill="#f4d7a6" stroke="#c99a5b" strokeWidth="4" />
      <rect x="64" y="96" width="28" height="28" rx="2" fill="#bfe0ff" stroke="#c99a5b" strokeWidth="3" />
      <rect x="106" y="110" width="28" height="54" rx="2" fill="#c98a5b" stroke="#a06a3d" strokeWidth="3" />
      {complete && (
        <motion.polygon
          points="100,8 166,78 34,78"
          fill="#5b8def"
          stroke="#3d6bc4"
          strokeWidth="4"
          strokeLinejoin="round"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        />
      )}
    </svg>
  )
}
