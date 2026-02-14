# Проект: Терапия настроения (feelingGood)

SPA-приложение на React + Redux Toolkit для когнитивно-поведенческой терапии. Две книги с прогрессивной разблокировкой глав, 37+ терапевтических упражнений.

## Стек
- React, TypeScript, Vite
- Redux Toolkit + localStorage persistence
- Recharts (графики), FontAwesome (иконки)
- Без URL-роутера (навигация через Redux state)

## Структура
- `src/components/` — UI-компоненты (главы, упражнения, мобильная навигация)
- `src/redux/` — store, slices, actions, selectors, hooks
- `src/data/` — маппинги глав <-> упражнений
- `src/utils/` — утилиты (главы, даты, стрики, тренды)
- `src/types/` — TypeScript типы
- `src/constants/` — константы (ID упражнений)

## Документация и планы
- [src/docs/url-routing-plan.md](src/docs/url-routing-plan.md) — план добавления URL-маршрутизации
- [src/docs/improvement-ideas.md](src/docs/improvement-ideas.md) — идеи по улучшению
- [src/docs/refactor.md](src/docs/refactor.md) — заметки по рефакторингу
- [src/docs/newActivities.md](src/docs/newActivities.md) — новые упражнения
