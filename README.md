# Детские игры

Набор развивающих веб-игр для детей. На главной странице карточки игр, каждая игра открывается
по своему адресу (`#/autumn-count`) и загружается только при открытии.

Стек: Vite + React + TypeScript, `react-router` (hash-роутинг для GitHub Pages), `motion` для анимаций,
`canvas-confetti`, `howler` для озвучки.

```sh
npm install
npm run dev      # локальная разработка
npm test         # тесты игровой логики
npm run build    # сборка в dist/
npm run preview  # проверка сборки
```

## Деплой

Push в `main` запускает `.github/workflows/deploy.yml`. Один раз включите в репозитории
**Settings → Pages → Source: GitHub Actions**. Адрес: https://romale007.github.io/children_game/

Если репозиторий переименуется, поправьте `base` в `vite.config.ts`.

## Структура

```
src/app/                  главная (HubPage, GameCard), роутер, страница игры с lazy-загрузкой
src/games/registry.ts     список игр: порядок карточек на главной
src/games/access.ts       canPlay(): единственное место, где решается, доступна ли игра
src/games/<id>/           игра: manifest.ts, Game.tsx, экраны, phrases.json
src/shared/               общее: озвучка, кнопки, confetti, глобальные стили
public/games/<id>/        картинки и mp3 игры
```

### Как добавить игру

1. Создать `src/games/<id>/` с `Game.tsx` (default export) и `manifest.ts` (тип `GameManifest`,
   `load: () => import('./Game')`).
2. Положить картинки в `public/games/<id>/images/`, фразы в `src/games/<id>/phrases.json`
   и сгенерировать озвучку (см. ниже).
3. Добавить манифест в массив `games` в `src/games/registry.ts`.

Поле `access: 'free' | 'premium'` в манифесте и функция `canPlay()` нужны для будущей подписки;
сейчас все игры открыты.

## Картинки

Картинки хранятся в WebP, уменьшенными примерно до двойного экранного размера (для retina):

```sh
cwebp -q 85 -alpha_q 90 -m 6 -resize 480 0 squirrel.png -o squirrel.webp   # brew install webp
```

## Озвучка

Фразы игры лежат в `src/games/<id>/phrases.json`, готовые mp3 в `public/games/<id>/audio/`. Они сгенерированы
нейросетевым голосом Microsoft через [edge-tts](https://github.com/rany2/edge-tts). Если файла нет
или он не загрузился, игра произносит фразу встроенным голосом браузера.

```sh
python3 -m venv .venv && .venv/bin/pip install edge-tts
.venv/bin/python scripts/generate_audio.py autumn-count                # создать недостающие файлы
.venv/bin/python scripts/generate_audio.py autumn-count --force        # перегенерировать все
.venv/bin/python scripts/generate_audio.py autumn-count right finish   # только выбранные фразы
.venv/bin/python scripts/generate_audio.py autumn-count --force --voice ru-RU-DmitryNeural --rate=-15%
```

Скрипт обрезает тишину в конце файлов. Свою запись можно положить в `public/games/<id>/audio/<phrase>.mp3`
вместо сгенерированной.

## Задания «Осеннего счёта»

Задания описаны в `src/games/autumn-count/levels.ts`: новое задание добавляется одной записью.

## Задания «Фигур»

Задания описаны в `src/games/shapes/levels.ts`. Ведущий мишка нарисован в SVG (`components/Bear.tsx`),
фигуры тоже (`components/FigureImage.tsx`), поэтому из картинок у игры только обложка для главной. Аплодисменты, звук ошибки
и финальная мелодия синтезируются в браузере (`src/shared/audio/sfx.ts`), громкость задаётся там же.
Озвучка «Фигур» сгенерирована чуть быстрее обычного: `generate_audio.py shapes --force --rate=+0%`.
