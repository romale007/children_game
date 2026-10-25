# Осенний счёт

Веб-версия детской игры «Считаем до 10» (5 лет): ребёнок считает предметы и нажимает на правильную цифру.

Стек: Vite + React + TypeScript, `motion` для анимаций, `canvas-confetti`, озвучка через Web Speech API.

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

## Озвучка

Фразы лежат в `src/game/phrases.json`, готовые mp3 в `public/audio/`. Они сгенерированы нейросетевым
голосом Microsoft через [edge-tts](https://github.com/rany2/edge-tts). Если файла нет или он не загрузился,
игра произносит фразу встроенным голосом браузера.

```sh
python3 -m venv .venv && .venv/bin/pip install edge-tts
.venv/bin/python scripts/generate_audio.py                 # создать недостающие файлы
.venv/bin/python scripts/generate_audio.py --force         # перегенерировать все
.venv/bin/python scripts/generate_audio.py right finish    # только выбранные фразы
.venv/bin/python scripts/generate_audio.py --force --voice ru-RU-DmitryNeural --rate=-15%
```

Скрипт обрезает тишину в конце файлов. Свою запись можно положить в `public/audio/<id>.mp3` вместо сгенерированной.

## Задания

Задания описаны в `src/levels.ts`: новое задание добавляется одной записью.
