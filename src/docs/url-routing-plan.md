# План: Добавление URL-маршрутизации (Deep Links) для глав и упражнений

## Контекст

Сейчас приложение — полноценный SPA **без URL-роутинга**. Вся навигация управляется через Redux state (`currentChapter`, `specialContent`, `activeTab`). Это значит:
- Нельзя поделиться ссылкой на конкретную главу или упражнение
- Кнопка "Назад" в браузере не работает как ожидается
- При обновлении страницы теряется текущее место чтения (хотя localStorage частично спасает)

**Цель**: добавить URL-маршруты вида `/chapter/ch1`, `/activity/three-columns` и т.д., сохранив текущую архитектуру.

## Оценка сложности: Средняя

Задача не тривиальная, но и не катастрофически сложная. Основная сложность — в количестве точек интеграции, а не в концептуальной сложности.

---

## Что нужно сделать

### 1. Установить react-router-dom
- Добавить зависимость `react-router-dom`
- Файл: `package.json`

### 2. Настроить роутер на верхнем уровне
- Обернуть приложение в `BrowserRouter` (или `HashRouter` если хостинг не поддерживает SPA fallback)
- Файлы: `src/main.tsx`, `src/App.tsx`
- Определить маршруты:
  - `/` — главная (TodayTasks / список глав)
  - `/chapters` — список глав
  - `/chapter/:chapterId` — конкретная глава
  - `/activities` — список упражнений
  - `/activity/:activityId` — конкретное упражнение
  - `/calendar` — календарь прогресса
  - `/about` — о приложении

### 3. Синхронизировать Redux state с URL — самая сложная часть
- При переходе по URL — диспатчить `loadChapter()` / `setSpecialContent()`
- При диспатче этих actions — обновлять URL через `navigate()`
- Нужно избежать циклов (URL меняет state -> state меняет URL -> ...)
- Ключевые файлы:
  - `src/redux/actions/chapterActions.ts` — `loadChapter()` async thunk
  - `src/redux/slices/progressSlice.ts` — `setSpecialContent`, `setCurrentChapter`
  - `src/components/MainContent/MainContent.tsx` — диспетчер контента
  - `src/components/ListOfChapters/ListOfChapters.tsx` — клики по главам
  - `src/components/ActivitiesPanel/ActivitiesPanel.tsx` — клики по упражнениям

### 4. Обновить компоненты навигации
- Заменить `dispatch(loadChapter(id))` на `navigate(/chapter/${id})` в компонентах
- Заменить `dispatch(setSpecialContent(id))` на `navigate(/activity/${id})`
- Кнопки "Назад" -> `navigate(-1)` или `navigate('/chapters')`
- Кнопка "Далее" после завершения главы -> `navigate(/chapter/${nextId})`
- Ключевые файлы (все точки где происходит навигация):
  - `src/components/ListOfChapters/ListOfChapters.tsx`
  - `src/components/ActivitiesPanel/ActivitiesPanel.tsx`
  - `src/components/ChapterReader/ChapterReader.tsx` (кнопка "Далее")
  - `src/components/ChapterReader/ChapterContainer.tsx`
  - `src/components/TodayTasks/TodayTasks.tsx`
  - `src/components/mobile/MobileLayout.tsx` (табы)
  - `src/components/mobile/MobileNavBar.tsx`
  - Все компоненты Activities, где есть кнопка "Назад"

### 5. Адаптировать мобильную навигацию
- Сейчас мобильные табы управляются через `mobileSlice` (`activeTab`)
- Нужно синхронизировать табы с URL-путями
- Файлы: `src/components/mobile/MobileLayout.tsx`, `src/components/mobile/MobileNavBar.tsx`

### 6. Обработать Progressive Unlocking с URL
- Если пользователь перейдёт по ссылке на заблокированную главу — нужно показать сообщение или редирект
- Проверка `unlockedContent` при роутинге
- Файлы: новый компонент-guard или проверка в `MainContent`

### 7. Настроить хостинг для SPA fallback
- Все URL должны возвращать `index.html` (иначе 404 при прямом переходе)
- Если используется GitHub Pages — проще `HashRouter` (`/#/chapter/ch1`)
- Если Vercel/Netlify — настроить rewrites

---

## Основные риски и сложности

| Риск | Уровень | Пояснение |
|------|---------|-----------|
| Синхронизация Redux <-> URL | Высокий | Главная сложность — избежать циклов и рассинхрона |
| Количество точек навигации | Средний | ~15+ компонентов содержат навигационную логику |
| Progressive unlocking | Средний | Нужна защита роутов от прямого доступа |
| Мобильные табы | Низкий | Нужна синхронизация activeTab с URL |
| localStorage persistence | Низкий | Уже работает, нужно лишь приоритезировать URL над сохранённым состоянием |

## Два варианта реализации

### Вариант A: Полноценный react-router-dom
- Чистые URL: `/chapter/ch1`, `/activity/three-columns`
- Полная поддержка вложенных роутов, lazy loading, guards
- Требует настройки SPA fallback на хостинге

### Вариант B: Hash-based навигация
- URL вида `/#/chapter/ch1`
- Работает на любом хостинге без настройки
- Менее гибко, но значительно проще в реализации
