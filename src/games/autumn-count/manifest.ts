import type { GameManifest } from '../types'
import { img } from './assets'

export default {
  id: 'autumn-count',
  title: 'Осенний счёт',
  description: 'Считаем яблоки, грибы, листья и шишки до 10',
  age: '5 лет',
  cover: img('hedgehog.webp'),
  color: '#ffd9a8',
  access: 'free',
  load: () => import('./Game'),
} satisfies GameManifest
