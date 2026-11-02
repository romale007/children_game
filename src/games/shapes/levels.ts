import type { PhraseId } from './voice'

export type Figure = 'circle' | 'square' | 'triangle' | 'rectangle' | 'oval' | 'ball' | 'cube'

export const figureNames: Record<Figure, string> = {
  circle: 'круг',
  square: 'квадрат',
  triangle: 'треугольник',
  rectangle: 'прямоугольник',
  oval: 'овал',
  ball: 'мяч',
  cube: 'кубик',
}

/** A figure as drawn on the screen: in part 2 the size and rotation vary, so only the form counts. */
export type Option = Figure | { figure: Figure; size?: number; rotate?: number }

export const optionFigure = (option: Option) => (typeof option === 'string' ? option : option.figure)

export type Level = {
  /** Shown left to right. A single figure is an introduction: it can't be answered wrong. */
  options: Option[]
  /** Every option with this figure must be tapped. */
  answer: Figure
  /** «Найди такую же»: the figure to match, shown above the options. */
  sample?: Figure
  /** «Чего не хватает»: a picture missing the answer, completed when the task is solved. */
  scene?: 'house'
  /** The task, spoken when the level opens and repeated after a mistake. */
  prompt: PhraseId
  /** Said after the praise, naming what the child found. */
  success: PhraseId
  /** After the second mistake: points at the right answer. */
  hint: PhraseId
  parentNote: string
}

/** Indices of the options the child has to find. */
export const targetsOf = (level: Level) =>
  level.options.flatMap((option, i) => (optionFigure(option) === level.answer ? [i] : []))

export type Part = {
  title: string
  /** Pictured on the part's button on the start screen. */
  figures: Figure[]
  levels: Level[]
  finishTitle: string
  finishPhrase: PhraseId
  startNote: string
}

const part1: Level[] = [
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

const part2: Level[] = [
  {
    options: ['circle', 'triangle', 'square'],
    answer: 'square',
    prompt: 'find-square',
    success: 'is-square',
    hint: 'hint-square',
    parentNote: 'Разминка: повторяем фигуры из первой части. Если ребёнок ошибается, стоит вернуться к первой части.',
  },
  {
    options: ['rectangle'],
    answer: 'rectangle',
    prompt: 'intro-rectangle',
    success: 'is-rectangle',
    hint: 'hint-rectangle',
    parentNote:
      'Знакомство с прямоугольником. Обведите его пальцем, посчитайте углы. Покажите: две стороны длинные, две короткие.',
  },
  {
    options: ['oval'],
    answer: 'oval',
    prompt: 'intro-oval',
    success: 'is-oval',
    hint: 'hint-oval',
    parentNote: 'Знакомство с овалом. Обведите его пальцем: углов нет, как у круга, но он вытянутый, как яичко.',
  },
  {
    options: [{ figure: 'square', size: 0.85 }, 'rectangle'],
    answer: 'rectangle',
    prompt: 'find-rectangle',
    success: 'is-rectangle',
    hint: 'hint-rectangle',
    parentNote:
      'Похожие фигуры. У квадрата все стороны одинаковые, а прямоугольник вытянут. Можно сравнить стороны пальцем.',
  },
  {
    options: ['oval', { figure: 'circle', size: 0.85 }],
    answer: 'oval',
    prompt: 'find-oval',
    success: 'is-oval',
    hint: 'hint-oval',
    parentNote: 'Похожие фигуры. Круг ровный со всех сторон, а овал вытянут.',
  },
  {
    options: ['circle', 'rectangle', 'oval'],
    answer: 'oval',
    sample: 'oval',
    prompt: 'find-same',
    success: 'is-oval',
    hint: 'hint-same',
    parentNote:
      'Найди такую же: сравнение с образцом без названия фигуры. Если здесь ребёнок не ошибается, а в заданиях с названием ошибается, ему трудно запомнить слово, а не саму форму.',
  },
  {
    options: [
      'circle',
      'oval',
      { figure: 'square', size: 0.8 },
      { figure: 'circle', size: 0.6 },
      { figure: 'triangle', rotate: 180 },
    ],
    answer: 'circle',
    prompt: 'find-all-circles',
    success: 'all-circles',
    hint: 'hint-circles',
    parentNote:
      'Найди все: нужно удержать инструкцию, пока ищешь. Ловушки: маленький круг (размер не важен) и овал (похож на круг). Каждый найденный круг отмечается звуком.',
  },
  {
    options: ['circle', 'square', 'triangle'],
    answer: 'triangle',
    scene: 'house',
    prompt: 'house-missing',
    success: 'house-roof',
    hint: 'hint-roof',
    parentNote:
      'Чего не хватает: перенос знания о фигурах на картинку. Спросите, из каких фигур состоит домик: стены — квадрат, крыша — треугольник.',
  },
]

export const parts: Part[] = [
  {
    title: 'Часть 1',
    figures: ['circle', 'square', 'triangle'],
    levels: part1,
    finishTitle: 'Все фигуры найдены!',
    finishPhrase: 'finish-1',
    startNote:
      'Часть 1: круг, квадрат, треугольник. Знакомство с каждой фигурой, выбор из двух и трёх, перенос на предметы. Около 5 минут.',
  },
  {
    title: 'Часть 2',
    figures: ['rectangle', 'oval'],
    levels: part2,
    finishTitle: 'Ты знаешь прямоугольник и овал!',
    finishPhrase: 'finish-2',
    startNote:
      'Часть 2, сложнее: прямоугольник и овал, похожие пары фигур, разный размер и поворот, сравнение с образцом, поиск нескольких фигур и картинка «Чего не хватает». Около 5 минут.',
  },
]

export const startNote =
  'Цель: различение и называние фигур. Садитесь рядом, но дайте ребёнку нажимать самому. Одной части достаточно за одно занятие. ' +
  parts.map((part) => part.startNote).join(' ')

export const finishNote =
  'Похвалите ребёнка. Задания, где понадобилась подсказка, стоит повторить на следующем занятии.'
