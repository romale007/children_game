import type { PhraseId } from './voice'

export type Figure = 'circle' | 'square' | 'triangle' | 'ball' | 'cube'

export const figureNames: Record<Figure, string> = {
  circle: 'круг',
  square: 'квадрат',
  triangle: 'треугольник',
  ball: 'мяч',
  cube: 'кубик',
}

export type Level = {
  /** Shown left to right. A single figure is an introduction: it can't be answered wrong. */
  options: Figure[]
  answer: Figure
  /** The task, spoken when the level opens and repeated after a mistake. */
  prompt: PhraseId
  /** Said after the praise, naming what the child found. */
  success: PhraseId
  /** After the second mistake: points at the right answer. */
  hint: PhraseId
  parentNote: string
}

// Part 1 of the scenario: circle, square and triangle.
export const levels: Level[] = [
  {
    options: ['circle'],
    answer: 'circle',
    prompt: 'intro-circle',
    success: 'is-circle',
    hint: 'hint-circle',
    parentNote:
      'Знакомство с кругом. После нажатия предложите обвести круг пальцем по контуру и назвать его вслух. Спросите: «Есть у круга углы?»',
  },
  {
    options: ['square'],
    answer: 'square',
    prompt: 'intro-square',
    success: 'is-square',
    hint: 'hint-square',
    parentNote:
      'Знакомство с квадратом. Обведите квадрат пальцем, посчитайте вместе углы. Спросите: «Есть у квадрата углы?»',
  },
  {
    options: ['triangle'],
    answer: 'triangle',
    prompt: 'intro-triangle',
    success: 'is-triangle',
    hint: 'hint-triangle',
    parentNote: 'Знакомство с треугольником. Обведите его пальцем и посчитайте углы: их три.',
  },
  {
    options: ['circle', 'triangle'],
    answer: 'circle',
    prompt: 'find-circle',
    success: 'is-circle',
    hint: 'hint-circle',
    parentNote:
      'Выбор из двух непохожих фигур. Если ребёнок ошибается, не показывайте ответ сразу: после второй ошибки игра сама подсветит верную фигуру.',
  },
  {
    options: ['circle', 'square'],
    answer: 'square',
    prompt: 'find-square',
    success: 'is-square',
    hint: 'hint-square',
    parentNote: 'Круг или квадрат. Обратите внимание: у квадрата есть углы, а круг ровный, без углов.',
  },
  {
    options: ['square', 'circle', 'triangle'],
    answer: 'triangle',
    prompt: 'find-triangle',
    success: 'is-triangle',
    hint: 'hint-triangle',
    parentNote: 'Выбор из трёх фигур. После ответа попросите ребёнка назвать каждую фигуру на экране.',
  },
  {
    options: ['ball', 'cube'],
    answer: 'ball',
    prompt: 'like-circle',
    success: 'ball-round',
    hint: 'hint-ball',
    parentNote: 'Перенос на предметы. После задания поищите в комнате круглые предметы: тарелка, колесо, часы.',
  },
]

export const startNote =
  'Цель: различение и называние фигур: круг, квадрат, треугольник. Садитесь рядом, но дайте ребёнку нажимать самому. Это первая часть игры, около 5 минут.'

export const finishNote =
  'Похвалите ребёнка. Задания, где понадобилась подсказка, стоит повторить на следующем занятии.'
