/** A party balloon: one is earned for every finished task. */
export default function Balloon({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 40 64" className={className} aria-hidden="true">
      <path d="M20 46 Q16 54 22 64" fill="none" stroke="#8a93a8" strokeWidth="1.5" />
      <ellipse cx="20" cy="22" rx="17" ry="21" fill={color} />
      <polygon points="20,42 16,48 24,48" fill={color} />
      <ellipse cx="13" cy="14" rx="4" ry="6" fill="#fff" opacity="0.45" transform="rotate(20 13 14)" />
    </svg>
  )
}
