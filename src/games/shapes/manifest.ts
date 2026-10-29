import type { GameManifest } from '../types'
import { img } from './assets'

export default {
  id: 'shapes',
  title: 'Фигуры',
  description: 'Учимся узнавать круг, квадрат и треугольник',
  age: '5 лет',
  cover: img('cover.svg'),
  color: '#d9e7fb',
  access: 'free',
  load: () => import('./Game'),
} satisfies GameManifest
