import type { ReactNode } from 'react'
import type { Figure } from '../levels'

// Every geometric figure has the same colour and a similar size, so only the form tells them apart.
const fill = '#5b8def'
const stroke = '#3d6bc4'

const drawings: Record<Figure, ReactNode> = {
  circle: <circle cx="50" cy="50" r="41" fill={fill} stroke={stroke} strokeWidth="4" />,
  square: <rect x="12" y="12" width="76" height="76" rx="3" fill={fill} stroke={stroke} strokeWidth="4" />,
  triangle: (
    <polygon points="50,8 93,88 7,88" fill={fill} stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
  ),
  ball: (
    <>
      <circle cx="50" cy="50" r="41" fill="#ef5b4c" stroke="#c23d30" strokeWidth="4" />
      <path d="M10 50 Q50 32 90 50" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 10 Q32 50 50 90" fill="none" stroke="#ffd166" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="34" cy="30" rx="9" ry="6" fill="#fff" opacity="0.5" transform="rotate(-30 34 30)" />
    </>
  ),
  cube: (
    <g stroke="#b07a12" strokeWidth="3" strokeLinejoin="round">
      <polygon points="12,32 30,14 88,14 70,32" fill="#f9cf6e" />
      <polygon points="70,32 88,14 88,70 70,88" fill="#d99a1f" />
      <rect x="12" y="32" width="58" height="56" fill="#f6b93b" />
      <text x="41" y="73" textAnchor="middle" fontSize="36" fontWeight="900" fill="#fff" stroke="none">
        А
      </text>
    </g>
  ),
}

export default function FigureImage({ figure }: { figure: Figure }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {drawings[figure]}
    </svg>
  )
}
