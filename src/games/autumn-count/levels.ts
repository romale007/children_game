import { img } from './assets'
import type { PhraseId } from './voice'

export type Level = {
  question: string
  questionAudio: PhraseId
  itemImage: string
  itemName: string
  character?: string
  count: number
  options: number[]
  parentNote: string
}

export const levels: Level[] = [
  {
    question: 'Сколько яблок у ёжика?',
    questionAudio: 'q-apples',
    itemImage: img('apple.webp'),
    itemName: 'яблоко',
    character: img('hedgehog.webp'),
    count: 5,
    options: [4, 5, 6],
    parentNote:
      'Цель: счёт до 5, соотнесение числа и количества. Считаем вслух, указывая на каждое яблоко. Верный ответ «5» ведёт дальше.',
  },
  {
    question: 'Сколько грибочков у белочки?',
    questionAudio: 'q-mushrooms',
    itemImage: img('mushroom.webp'),
    itemName: 'грибок',
    character: img('squirrel.webp'),
    count: 7,
    options: [6, 7, 8],
    parentNote: 'Цель: счёт до 7. Считаем грибы вслух, обводим пальцем каждый. Верный ответ «7».',
  },
  {
    question: 'Сколько листиков упало?',
    questionAudio: 'q-leaves',
    itemImage: img('leaf.webp'),
    itemName: 'листик',
    count: 9,
    options: [8, 9, 10],
    parentNote: 'Цель: счёт до 9. Учим считать по порядку, не сбиваясь. Верный ответ «9».',
  },
  {
    question: 'Сколько шишек собрал ёжик?',
    questionAudio: 'q-cones',
    itemImage: img('cone.webp'),
    itemName: 'шишка',
    character: img('hedgehog.webp'),
    count: 10,
    options: [8, 9, 10],
    parentNote:
      'Цель: счёт до 10. Считаем шишки вслух, отмечаем, что после 9 идёт 10. Верный ответ «10» ведёт на финальный слайд.',
  },
]

export const startNote =
  'Тема: закрепление счёта в пределах 10. Задачи: счёт предметов, соотнесение числа и количества, развитие внимания и самоконтроля. Нажмите «Играть».'

export const finishNote =
  'Похвалите ребёнка, пересчитайте вместе до 10. Спросите: «Что было самым интересным? Какое задание было трудным?»'

export const decoLeaves = [img('deco-leaf-1.webp'), img('deco-leaf-2.webp'), img('deco-leaf-3.webp')]
