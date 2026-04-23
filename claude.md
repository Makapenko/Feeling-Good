# Feeling Good - Проект когнитивно-поведенческой терапии

## Обзор проекта

**Feeling Good** — это веб-приложение для самопомощи на основе когнитивно-поведенческой терапии (КПТ), основанное на методологии Дэвида Бернса. Приложение включает две книги ("Терапия настроения" и "Терапия одиночества") и 37 терапевтических упражнений для борьбы с депрессией, улучшения межличностных отношений и психологического состояния.

### Ключевые характеристики
- **Технологии**: React 19, TypeScript, Redux Toolkit, Vite, Recharts
- **Упражнений**: 37 различных активностей КПТ
- **Архитектура**: Offline-first с localStorage
- **Поддержка**: Адаптивный дизайн (desktop + mobile)
- **Деплой**: GitHub Pages
- **🆕 Новое**: Рейтинг упражнений, счётчик серий, график настроения

---

## 1. Структура проекта

```
feelingGood/
├── src/
│   ├── components/          # React компоненты
│   │   ├── Activities/      # 37 терапевтических упражнений
│   │   ├── ActivitiesPanel/ # Панель доступных упражнений
│   │   ├── ChapterReader/   # Отображение содержимого глав
│   │   ├── Header/          # Шапка приложения
│   │   ├── ListOfChapters/  # Навигация по главам (сайдбар, вкладки книг)
│   │   ├── MainContent/     # Основной контент-роутер
│   │   ├── ProgressCalendar/# Календарь прогресса
│   │   ├── TodayTasks/      # Задачи на сегодня
│   │   ├── UniversalTimer/  # Таймер для упражнений
│   │   ├── WelcomePage/     # Приветственная страница
│   │   ├── Notification/    # Toast уведомления
│   │   ├── MoodTrendChart/  # 🆕 График динамики настроения
│   │   ├── mobile/          # Компоненты для мобильной версии
│   │   └── shared/          # Переиспользуемые компоненты
│   │       ├── ExerciseRating/  # 🆕 Рейтинг упражнений (5 звёзд)
│   │       └── StreakDisplay/   # 🆕 Счётчик серий активности
│   ├── redux/
│   │   ├── slices/          # Redux слайсы (progress, mobile, notification)
│   │   ├── actions/         # Actions (chapter, activity, unlock, favorite)
│   │   ├── store.ts         # Конфигурация Redux store
│   │   ├── types.ts         # Типы Redux состояния
│   │   ├── hooks.ts         # Типизированные хуки и селекторы
│   │   ├── selectors.ts     # Redux селекторы
│   │   └── constants.ts     # Константы Redux
│   ├── types/
│   │   ├── progress.types.ts # Типы упражнений и прогресса
│   │   ├── chapters.types.ts # Структура глав
│   │   └── charts.types.ts   # Типы для визуализации
│   ├── utils/
│   │   ├── dateUtils.ts      # Работа с датами
│   │   ├── deviceUtils.ts    # Определение устройства
│   │   ├── chapterUtils.ts   # Навигация по главам
│   │   ├── exerciseUtils.ts  # Управление упражнениями
│   │   ├── activityTimerStorage.ts # Хранение времени активностей
│   │   ├── exerciseRatingUtils.ts  # 🆕 Утилиты для рейтингов
│   │   ├── streakUtils.ts          # 🆕 Расчёт серий активности
│   │   └── moodTrendUtils.ts       # 🆕 Обработка данных настроения
│   ├── constants/
│   │   └── activities.ts     # ID и названия активностей
│   ├── data/
│   │   ├── chaptersMapping.ts   # Метаданные глав
│   │   └── activitiesMapping.ts # Метаданные активностей
│   ├── App.tsx               # Корневой компонент
│   ├── main.tsx              # Точка входа с Redux Provider
│   └── index.css             # Глобальные стили
├── public/
│   └── content/
│       ├── chapters/         # HTML-файлы глав (Книга 1 — Терапия настроения)
│       ├── book2/
│       │   ├── chapters/     # HTML-файлы глав (Книга 2 — Терапия одиночества)
│       │   └── images/       # Изображения для Книги 2
│       ├── images/           # Изображения для Книги 1
│       └── articles/         # Дополнительный контент
├── dist/                     # Production build
├── package.json
├── vite.config.ts
├── tsconfig.app.json
└── eslint.config.js
```

---

## 2. Технологический стек

### Core
- **React 19.0.0** - UI библиотека с хуками
- **TypeScript 5.7.2** - Типизация и безопасность
- **Vite 6.1.0** - Быстрый бандлер и dev-сервер

### State Management
- **Redux Toolkit 2.6.1** - Управление состоянием
- **React-Redux 9.2.0** - React интеграция
- **Redux-Persist 6.0.0** - Персистентность в localStorage

### UI & Visualization
- **Recharts 2.15.1** - Графики и визуализация прогресса
- **FontAwesome 6.7.2** - Библиотека иконок
- **React Transition Group** - Анимации

### Utilities
- **date-fns 4.1.0** - Работа с датами
- **Lodash 4.17.21** - Утилиты
- **DOMPurify 3.2.4** - Санитизация HTML
- **UUID 11.1.0** - Генерация уникальных ID
- **@stagewise/toolbar 0.5.1** - Dev toolbar (только для разработки)

---

## 3. Основные функции

### 3.1 Система управления главами (две книги)

- **Две книги**: "Терапия настроения" (19 глав) и "Терапия одиночества" (14 глав + приложения)
- **Вкладки переключения**: Компонент ListOfChapters с вкладками книг
- **Последовательная прогрессия**: Главы открываются по мере прохождения (для каждой книги отдельно)
- **Иерархическая структура**: Разделы и подразделы
- **HTML контент**: Книга 1 — `/public/content/chapters/`, Книга 2 — `/public/content/book2/chapters/`
- **Метаданные глав**: `chapters.json` (книга 1), `chapters-book2.json` (книга 2)
- **Отслеживание прогресса**: Визуализация завершенных глав
- **Избранное**: Возможность добавлять главы в избранное

### 3.2 Терапевтические упражнения (37 активностей)

#### Отслеживание и анализ мыслей:
- Дневник автоматических мыслей (Thought Diary)
- Метод трёх колонок (Three-Column Method)
- Техника нисходящей стрелы (Downward Arrow)
- Анализ когнитивных искажений

#### Поведенческая активация:
- Расписание дня (Daily Schedule)
- Метод маленьких шагов (Small Steps)
- Лист удовольствий (Activity Pleasure Sheet)
- Методы самоактивации

#### Управление прокрастинацией:
- Лист антипрокрастинации (Anti-Procrastination Sheet)
- Дневник прокрастинации
- Шкала прокрастинации

#### Эмоциональная регуляция:
- Управление гневом и критикой
- Вербальное дзюдо (Verbal Judo)
- Техника обезоруживания (Disarming Technique)

#### Тесты и оценки:
- Опросник депрессии Бернса
- Шкала дисфункциональных установок
- Шкала гнева Новако
- Тест когнитивных искажений

### 3.3 Отслеживание прогресса

- **Календарь прогресса**: Визуальное отображение активности по дням
- **Учёт времени**: Отслеживание времени на главы и упражнения
- **Запись результатов**: Сохранение выполненных упражнений
- **Хранение результатов тестов**: История прохождения тестов
- **История чтения**: Отслеживание прочитанных глав

### 3.4 Адаптивный дизайн

- **Desktop**: Сайдбар навигации + основной контент + панель активностей
- **Mobile**: Табовая навигация (breakpoint: 768px)
- **Автоматическое переключение** между desktop и mobile layout

### 3.5 Персистентность данных

- **localStorage**: Хранение на клиенте
- **Автосохранение**: При изменении состояния Redux
- **Offline-first**: Работает без интернета после загрузки
- **Миграция данных**: Обработка старых форматов данных

### 3.6 Система уведомлений

- Toast уведомления с автоматическим скрытием
- Middleware для управления уведомлениями
- Звуковые уведомления (`/public/notification.mp3`)

---

## 4. Архитектура и паттерны

### 4.1 Redux State Structure

```typescript
RootState
├── progress (UserProgress)
│   ├── currentChapter: ChapterWithContent | null
│   ├── specialContent: SpecialContent | null
│   ├── dailyProgress: Record<date, DayProgress>
│   ├── chapters: Chapter[]
│   ├── unlockedContent: { chapters[], activities[] }
│   ├── completedChapters: string[]
│   ├── favoriteActivities: string[]
│   ├── favoriteChapters: FavoriteChapter[]
│   ├── readingHistory: Record<date, DailyProgress>
│   └── lastUnlockedChapter/Activities
├── mobile: { currentTab: MobileTab }
└── notification: Notification[]
```

### 4.2 Component Hierarchy

```
App (Redux Provider)
├── Desktop View:
│   ├── Header
│   ├── ListOfChapters (sidebar)
│   ├── MainContent (chapters/activities)
│   └── ActivitiesPanel
└── Mobile View:
    ├── MobileNavBar (tabs)
    └── MobileLayout (content switching)
```

### 4.3 Ключевые паттерны

1. **Redux Slice Pattern** - `createSlice` для редьюсеров
2. **Async Thunks** - Для асинхронных операций (загрузка глав)
3. **Custom Hooks** - Типизированные селекторы и хуки Redux
4. **Memoization** - `useMemo` для оптимизации селекторов
5. **Middleware** - Кастомные middleware для localStorage и уведомлений
6. **Local Storage Adapter** - Синхронизация Redux ↔ localStorage

---

## 5. Работа с данными

### 5.1 Поток данных

```
User Interaction
    ↓
Dispatch Action (sync/async thunk)
    ↓
Reducer updates state (immutably)
    ↓
Middleware triggered (localStorage, notifications)
    ↓
State propagates to components via hooks
    ↓
Components re-render
```

### 5.2 Персистентность

- Custom Redux middleware отслеживает все изменения состояния
- После каждого action сохраняет `progress` state в localStorage
- При старте приложения загружает состояние из localStorage
- Миграция для обработки старых форматов данных

### 5.3 Структура активностей

Каждая активность имеет:
- Свой компонент в `/components/Activities/[ActivityName]/`
- Обычно оборачивает базовый компонент (например, `ThoughtDiaryBase`)
- Специфичная конфигурация передается через props
- Определения типов рядом с компонентом

---

## 6. Development & Build

### 6.1 Development Workflow

```bash
npm install      # Установка зависимостей
npm run dev      # Запуск dev-сервера с HMR
npm run lint     # Проверка кода ESLint
npm run build    # Production build
npm run preview  # Предпросмотр production build
```

### 6.2 Build Process

1. TypeScript compilation (`tsc -b`)
2. Vite bundling с React plugin
3. Копирование статических файлов (404.html для SPA routing)
4. Деплой на GitHub Pages через `gh-pages`

### 6.3 Environment Variables

- **VITE_BASE** - Базовый путь для деплоя:
  - `/Feeling-Good/` для GitHub Pages subpath
  - `/` для корневого домена

### 6.4 Configuration Files

**vite.config.ts:**
- Конфигурация React plugin
- Динамическая base path через `VITE_BASE`
- React Fast Refresh для HMR

**tsconfig.app.json:**
- Target: ES2020
- Strict mode enabled
- `noUnusedLocals` и `noUnusedParameters`
- JSX: react-jsx
- Module resolution: bundler

**eslint.config.js:**
- Flat config format
- React hooks правила
- React refresh warnings

---

## 7. Code Conventions

### 7.1 Naming Conventions

- **Components**: PascalCase (`ThoughtDiary`)
- **Activity IDs**: kebab-case (`thought-diary`)
- **CSS Modules**: `[ComponentName].module.css`
- **TypeScript files**: `.ts` рядом с `.tsx`

### 7.2 File Organization

```
/components/Activities/ThoughtDiary/
├── ThoughtDiary.tsx           # Wrapper component
├── ThoughtDiaryBase.tsx       # Base component
├── ThoughtDiary.module.css    # Styles
└── types.ts                   # Type definitions
```

### 7.3 Type Safety

- Strict TypeScript configuration
- Discriminated unions для Exercise типов
- Interface segregation
- Generic types где применимо

### 7.4 Internationalization

- Основной язык: Русский
- Locale-specific форматирование дат
- Все UI строки на русском

---

## 8. Key Files Reference

### 8.1 Entry Points
- [src/main.tsx](src/main.tsx) - Точка входа с Redux Provider
- [src/App.tsx](src/App.tsx) - Корневой компонент приложения
- [index.html](index.html) - HTML entry point

### 8.2 Redux Configuration
- [src/redux/store.ts](src/redux/store.ts) - Конфигурация store
- [src/redux/slices/progressSlice.ts](src/redux/slices/progressSlice.ts) - Основной слайс прогресса
- [src/redux/hooks.ts](src/redux/hooks.ts) - Типизированные хуки
- [src/redux/selectors.ts](src/redux/selectors.ts) - Селекторы с мемоизацией

### 8.3 Core Components
- [src/components/MainContent/MainContent.tsx](src/components/MainContent/MainContent.tsx) - Роутинг контента
- [src/components/ChapterReader/ChapterReader.tsx](src/components/ChapterReader/ChapterReader.tsx) - Отображение глав
- [src/components/ActivitiesPanel/ActivitiesPanel.tsx](src/components/ActivitiesPanel/ActivitiesPanel.tsx) - Панель упражнений
- [src/components/ListOfChapters/ListOfChapters.tsx](src/components/ListOfChapters/ListOfChapters.tsx) - Навигация

### 8.4 Data & Constants
- [src/constants/activities.ts](src/constants/activities.ts) - ID и названия активностей
- [src/components/ListOfChapters/chapters.json](src/components/ListOfChapters/chapters.json) - Метаданные глав Книги 1
- [src/components/ListOfChapters/chapters-book2.json](src/components/ListOfChapters/chapters-book2.json) - Метаданные глав Книги 2
- [src/data/chaptersMapping.ts](src/data/chaptersMapping.ts) - Метаданные глав
- [src/data/activitiesMapping.ts](src/data/activitiesMapping.ts) - Метаданные активностей

### 8.5 Utilities
- [src/utils/dateUtils.ts](src/utils/dateUtils.ts) - Утилиты для работы с датами
- [src/utils/deviceUtils.ts](src/utils/deviceUtils.ts) - Определение мобильного устройства
- [src/utils/chapterUtils.ts](src/utils/chapterUtils.ts) - Логика навигации по главам
- [src/utils/exerciseUtils.ts](src/utils/exerciseUtils.ts) - Управление упражнениями
- [src/utils/activityTimerStorage.ts](src/utils/activityTimerStorage.ts) - Хранение времени активностей

---

## 9. Mobile Support

### 9.1 Breakpoints
- **Desktop**: > 768px
- **Mobile**: ≤ 768px

### 9.2 Mobile Components
- [src/components/mobile/MobileLayout.tsx](src/components/mobile/MobileLayout.tsx) - Мобильный layout
- [src/components/mobile/MobileNavBar.tsx](src/components/mobile/MobileNavBar.tsx) - Табовая навигация

### 9.3 Mobile State
- Redux slice `mobile` хранит текущую активную вкладку
- Переключение между: Главы | Сегодня | Упражнения | Прогресс

---

## 10. Data Types

### 10.1 Exercise Types (37 активностей)

Упражнения представлены как discriminated union:

```typescript
type Exercise =
  | ThoughtDiaryExercise
  | ThreeColumnExercise
  | DailyScheduleExercise
  | BurnsChecklistExercise
  // ... остальные 33 типа
```

Каждый тип упражнения имеет:
- `id: string` (уникальный ID)
- `activityId: string` (ID активности)
- `createdAt: string` (дата создания)
- Специфичные поля для упражнения

### 10.2 Progress Types

```typescript
interface DayProgress {
  date: string;
  exercises: Exercise[];
  chaptersRead: string[];
  timeSpent: number; // минуты
}

interface UserProgress {
  dailyProgress: Record<string, DayProgress>;
  completedChapters: string[];
  unlockedContent: {
    chapters: string[];
    activities: string[];
  };
  // ... другие поля
}
```

---

## 11. Testing & Quality

### 11.1 Code Quality Tools
- **ESLint** - Статический анализ кода
- **TypeScript strict mode** - Строгая типизация
- **React hooks linting** - Проверка правил хуков

### 11.2 Development Tools
- **Vite HMR** - Горячая перезагрузка модулей
- **@stagewise/toolbar** - Dev toolbar (только в dev режиме)
- **React Fast Refresh** - Мгновенный фидбек

---

## 12. Deployment

### 12.1 GitHub Pages
- Хостинг на GitHub Pages
- Поддержка subpath deployments (`/Feeling-Good/`)
- Только статические файлы (без backend)
- Работает offline после первой загрузки

### 12.2 Build Scripts

```json
{
  "build": "tsc -b && vite build && cp dist/index.html dist/404.html && gh-pages -d dist -t -b gh-pages -e /Feeling-Good",
  "build2": "tsc -b && vite build && cp dist/index.html dist/404.html && gh-pages -d dist -t -b gh-pages"
}
```

---

## 13. Future Improvements

См. [docs/improvements.md](docs/improvements.md) для детального списка идей улучшений.

---

## 14. Полезные команды

### Разработка
```bash
npm run dev           # Запуск dev-сервера на http://localhost:5173
npm run lint          # Проверка кода
npm run preview       # Предпросмотр production build
```

### Деплой
```bash
npm run build         # Build + deploy на GitHub Pages (subpath)
npm run build2        # Build + deploy на GitHub Pages (root)
```

### Debugging
- Redux DevTools (автоматически подключается в dev режиме)
- @stagewise/toolbar (видимый только в dev режиме)
- Browser DevTools

---

## 15. Важные замечания

### 15.1 Content Management
- Контент глав Книги 1 в HTML формате находится в `/public/content/chapters/`
- Контент глав Книги 2 в HTML формате находится в `/public/content/book2/chapters/`
- Изображения Книги 1 в `/public/content/images/`, Книги 2 в `/public/content/book2/images/`
- Метаданные: `src/components/ListOfChapters/chapters.json` (Книга 1), `chapters-book2.json` (Книга 2)
- Можно редактировать HTML напрямую без пересборки приложения

### 15.2 Data Persistence
- Все данные пользователя хранятся в localStorage
- Нет backend, нет базы данных
- Данные привязаны к браузеру

### 15.3 Performance
- Мемоизация селекторов для минимизации ре-рендеров
- Code splitting через dynamic imports (если необходимо)
- Lazy loading для больших компонентов

### 15.4 Browser Compatibility
- Современные браузеры с поддержкой ES2020
- localStorage API required
- Fetch API required

---

## Резюме

**Feeling Good** — это полнофункциональное приложение для когнитивно-поведенческой терапии с:

- ✅ Двумя книгами: "Терапия настроения" и "Терапия одиночества"
- ✅ 37 терапевтическими упражнениями
- ✅ Структурированным курсом с последовательными главами (для каждой книги)
- ✅ Отслеживанием прогресса и статистикой
- ✅ Адаптивным дизайном (desktop + mobile)
- ✅ Offline-first архитектурой
- ✅ Типобезопасной реализацией на TypeScript
- ✅ Предсказуемым управлением состоянием через Redux
- ✅ Модульной архитектурой для поддержки и расширения

Проект хорошо организован, следует консистентным паттернам и уделяет большое внимание типобезопасности и оптимизации производительности.

---

## 🆕 16. Новые функции (октябрь 2025)

### 16.1 Система рейтинга упражнений ⭐

**Файлы:**
- [src/components/shared/ExerciseRating/](src/components/shared/ExerciseRating/) - Компонент рейтинга
- [src/utils/exerciseRatingUtils.ts](src/utils/exerciseRatingUtils.ts) - Утилиты
- [src/redux/slices/progressSlice.ts:344-371](src/redux/slices/progressSlice.ts#L344-L371) - Redux action

**Возможности:**
- ⭐ Оценка упражнений от 1 до 5 звёзд
- 💬 Добавление комментариев к рейтингу
- 💾 Автоматическое сохранение в localStorage
- 🔄 Редактирование существующих рейтингов
- 📊 Основа для аналитики эффективности

**Где работает:**
- Дневник автоматических мыслей (полностью интегрировано)
- 14+ упражнений на базе ThoughtDiaryBase (требуется передача activityId)

**Использование:**
```typescript
import { ExerciseRating } from '../shared/ExerciseRating';

<ExerciseRating
  exerciseId={record.timestamp}
  activityId={ACTIVITY_IDS.THOUGHT_DIARY}
  onRatingChange={(rating) => console.log(rating)}
/>
```

**Redux State:**
```typescript
interface ExerciseRating {
  exerciseId: string;
  activityId: string;
  rating: number; // 1-5
  ratedAt: string;
  comment?: string;
}

state.progress.exerciseRatings: ExerciseRating[]
```

---

### 16.2 Счётчик серий активности 🔥

**Файлы:**
- [src/components/shared/StreakDisplay/](src/components/shared/StreakDisplay/) - Компонент отображения
- [src/utils/streakUtils.ts](src/utils/streakUtils.ts) - Логика расчёта

**Возможности:**
- 🔥 Текущая серия дней подряд
- 🏆 Рекордная серия (максимальная за всё время)
- 📊 Общее количество активных дней
- ✓ Индикатор активности сегодня
- 💡 Напоминание о последней активности
- 🎯 Мотивационные сообщения в зависимости от длины серии

**Где отображается:**
- Главная страница (WelcomePage) - полная версия с градиентом
- Можно добавить компактную версию в Header

**Мотивационные сообщения:**
```typescript
0 дней:   "Начните свою серию сегодня!"
1 день:   "Отличное начало! Продолжайте завтра!"
2-6 дней: "Продолжайте в том же духе! N дней подряд!"
7-13:     "Впечатляюще! Вы активны уже N дней!"
14-29:    "Невероятно! N дней подряд! Вы на верном пути!"
30-99:    "🔥 Потрясающе! N дней! Вы формируете сильную привычку!"
100+:     "🏆 ЛЕГЕНДА! N дней подряд! Вы вдохновляете!"
```

**Использование:**
```typescript
import { StreakDisplay } from '../shared/StreakDisplay';

// Полная версия
<StreakDisplay variant="full" />

// Компактная версия
<StreakDisplay variant="compact" />
```

**Утилиты:**
```typescript
import { getStreakInfo, calculateCurrentStreak, getMoodTrend } from '../utils/streakUtils';

const streakInfo = useAppSelector(getStreakInfo);
// {
//   currentStreak: 5,
//   longestStreak: 12,
//   totalActiveDays: 28,
//   lastActivityDate: "2025-10-26"
// }
```

---

### 16.3 График динамики настроения 📈

**Файлы:**
- [src/components/MoodTrendChart/](src/components/MoodTrendChart/) - Компонент графика
- [src/utils/moodTrendUtils.ts](src/utils/moodTrendUtils.ts) - Обработка данных

**Возможности:**
- 📊 Линейный график с историей баллов по опроснику Бернса
- 🎨 Референсные линии для интерпретации уровней депрессии
- 📈 Статистика: всего тестов, последний балл, средний, лучший результат
- 💬 Мотивационные сообщения о прогрессе
- 🖱️ Интерактивный tooltip с детальной информацией
- 📱 Адаптивный дизайн для мобильных

**Где отображается:**
- Страница "Сегодня" (TodayTasks) - после секции "История работы с самооценкой"
- Появляется только если пройден хотя бы один тест Бернса

**Интерпретация баллов:**
```
0-5:   Минимальная или отсутствует (зелёный)
6-10:  Легкая депрессия (светло-зелёный)
11-25: Умеренная депрессия (жёлтый)
26-45: Тяжелая депрессия (оранжевый)
46-60: Крайне тяжелая депрессия (красный)
```

**Использование:**
```typescript
import { MoodTrendChart } from '../MoodTrendChart';

<MoodTrendChart 
  height={350}
  showStats={true}
/>
```

**Утилиты:**
```typescript
import { getMoodStats, getMoodTrend, getBurnsInterpretation } from '../utils/moodTrendUtils';

const stats = useAppSelector(getMoodStats);
// {
//   totalTests: 5,
//   averageScore: 25.4,
//   latestScore: 18,
//   improvement: 17, // положительное = улучшение
//   trend: 'improving', // 'improving' | 'worsening' | 'stable'
//   bestScore: 12,
//   worstScore: 35
// }

const interpretation = getBurnsInterpretation(18);
// { label: "Умеренная депрессия", color: "#ffc107" }
```

---

### 16.4 Технические детали новых функций

**Redux State расширен:**
```typescript
interface UserProgress {
  // ... существующие поля
  exerciseRatings: ExerciseRating[]; // Рейтинги упражнений
}
```

**Новые селекторы:**
```typescript
// Рейтинги
selectExerciseRatings(state) // все рейтинги
getAverageRatingForActivity(state, activityId) // средний по типу
getRatingForExercise(state, exerciseId) // конкретный рейтинг

// Серии
getStreakInfo(state) // полная информация о сериях
calculateCurrentStreak(state) // текущая серия
isActiveToday(state) // активность сегодня

// Настроение
getMoodTrendData(state) // все результаты тестов Бернса
getMoodStats(state) // статистика настроения
getMoodImprovement(state) // изменение (первый vs последний)
```

**Зависимости:**
- Recharts 2.15.1 используется для графика настроения
- Все данные хранятся в localStorage (offline-first)
- TypeScript strict mode для безопасности типов

---

### 16.5 Планы развития

**Приоритет 1 (15 минут):**
- Интеграция рейтинга во все 14 оставшихся упражнений на базе ThoughtDiaryBase

**Приоритет 2 (5 часов):**
- Дашборд аналитики:
  - График настроения
  - ТОП рейтинговых упражнений
  - Корреляция: упражнение → настроение
  - Персональные рекомендации

**Приоритет 3 (18-24 часа):**
- Недостающие упражнения из книги:
  - Работа с виной (Глава 8)
  - Перфекционизм (Глава 14)
  - Работа-самооценка (Глава 13)
  - Дополнительные упражнения по гневу (Глава 7)

---

### 16.6 Файлы добавленные в этом обновлении

**Новые компоненты (9 файлов):**
```
src/components/
├── MoodTrendChart/
│   ├── MoodTrendChart.tsx
│   ├── MoodTrendChart.module.css
│   └── index.ts
└── shared/
    ├── ExerciseRating/
    │   ├── ExerciseRating.tsx
    │   ├── ExerciseRating.module.css
    │   └── index.ts
    └── StreakDisplay/
        ├── StreakDisplay.tsx
        ├── StreakDisplay.module.css
        └── index.ts
```

**Новые утилиты (3 файла):**
```
src/utils/
├── exerciseRatingUtils.ts
├── streakUtils.ts
└── moodTrendUtils.ts
```

**Изменённые файлы (6 файлов):**
```
src/
├── redux/
│   ├── types.ts (добавлен ExerciseRating)
│   └── slices/progressSlice.ts (добавлен saveExerciseRating)
├── components/
│   ├── WelcomePage/
│   │   ├── WelcomePage.tsx (добавлен StreakDisplay)
│   │   └── WelcomePage.module.css
│   ├── TodayTasks/
│   │   ├── TodayTasks.tsx (добавлен MoodTrendChart)
│   │   └── TodayTasks.module.css
│   └── Activities/ThoughtDiaryBase/
│       ├── ThoughtDiaryBase.tsx (передача activityId)
│       └── RecordsList/RecordsList.tsx (добавлен ExerciseRating)
```

**Всего добавлено: 12 новых файлов, изменено 6 существующих**

---

### 16.7 График динамики дисфункциональных убеждений (DAS) 📊

**Дата добавления:** 27 октября 2025

**Файлы:**
- [src/components/DASTrendChart/](src/components/DASTrendChart/) - Компонент мультилайн-графика
- [src/utils/dasTrendUtils.ts](src/utils/dasTrendUtils.ts) - Утилиты для DAS данных

**Возможности:**
- 📊 Мультилайн-график с 7 линиями (по одной на каждую категорию убеждений)
- 🎨 Уникальные цвета для каждой категории
- 📈 Статистика: всего тестов, последний общий балл, средний, лучший результат
- 💬 Мотивационные сообщения о прогрессе
- 🖱️ Интерактивный tooltip с детализацией по всем категориям
- 📱 Адаптивный дизайн для мобильных
- ⚖️ Нулевая референсная линия (граница здоровых/дисфункциональных убеждений)

**7 категорий убеждений:**
1. **Одобрение** (Approval) - фиолетовый `#667eea`
2. **Любовь** (Love) - розовый `#f093fb`
3. **Достижения** (Achievement) - голубой `#4facfe`
4. **Перфекционизм** (Perfectionism) - зеленый `#43e97b`
5. **Право** (Entitlement) - коралловый `#fa709a`
6. **Всемогущество** (Omnipotence) - желтый `#feca57`
7. **Автономия** (Autonomy) - оранжево-красный `#ff6348`

**Где отображается:**
- Страница "Задания на сегодня" (TodayTasks) - новый раздел "Работа с убеждениями"
- Появляется только если пройден хотя бы один тест DAS
- Отображается после карточки теста DAS

**Интервал прохождения теста:**
- Рекомендуется проходить раз в **14 дней** (2 недели)
- Первый тест можно пройти сразу
- После этого напоминание появляется через 2 недели

**Диапазон баллов:**
- Каждая категория: от **-10** (дисфункциональные) до **+10** (здоровые)
- Общий балл: от **-70** до **+70** (сумма всех 7 категорий)

**Интерпретация общего балла:**
```
+35 до +70:  Отличные здоровые убеждения (зелёный)
+15 до +35:  Хорошие убеждения (светло-зелёный)
-15 до +15:  Умеренные убеждения (жёлтый)
-35 до -15:  Проблемные убеждения (оранжевый)
-70 до -35:  Дисфункциональные убеждения (красный)
```

**Использование:**
```typescript
import { DASTrendChart } from '../DASTrendChart';

<DASTrendChart
  height={350}
  showStats={true}
/>
```

**Утилиты:**
```typescript
import {
  getDASData,
  getDASStats,
  getDASInterpretation,
  CATEGORY_COLORS,
  CATEGORY_LABELS
} from '../utils/dasTrendUtils';

// Получить все DAS тесты
const dasData = useAppSelector(getDASData);
// [
//   {
//     date: "2025-10-20",
//     timestamp: "2025-10-20T10:30:00Z",
//     categoryResults: [
//       { category: "approval", score: 8, isStrength: true },
//       { category: "love", score: 6, isStrength: true },
//       // ... остальные категории
//     ],
//     totalScore: 12
//   }
// ]

// Статистика
const stats = useAppSelector(getDASStats);
// {
//   totalTests: 3,
//   averageScore: 15.3,
//   latestScore: 18,
//   improvement: 12, // положительное = улучшение
//   trend: 'improving', // 'improving' | 'worsening' | 'stable'
//   bestScore: 22,
//   worstScore: 6
// }

// Интерпретация
const interpretation = getDASInterpretation(18);
// { label: "Хорошие убеждения", color: "#90EE90" }

// Цвета и названия категорий
const color = CATEGORY_COLORS['approval']; // "#667eea"
const label = CATEGORY_LABELS['approval']; // "Одобрение"
```

**Дизайн:**
- Полностью идентичен дизайну компонента MoodTrendChart
- Использует те же стилевые паттерны
- Мобильная адаптивность через CSS Grid и Flexbox
- Градиенты на карточках статистики

**Redux Integration:**
```typescript
// DAS данные хранятся в exercises (не в testResults)
state.progress.dailyProgress[date].exercises.exercises[]
// где каждый exercise с type === 'dysfunctional-attitude-scale'
```

**Новые файлы (4 файла):**
```
src/
├── components/DASTrendChart/
│   ├── DASTrendChart.tsx           # Компонент графика
│   ├── DASTrendChart.module.css    # Стили
│   └── index.ts                    # Экспорт
└── utils/
    └── dasTrendUtils.ts            # Утилиты и селекторы
```

**Изменённые файлы (3 файла):**
```
src/components/TodayTasks/
├── TodayTasks.tsx          # Добавлен раздел "Работа с убеждениями"
└── TodayTasks.module.css   # Стили для .dasTrendSection
```

**Всего для DAS Trend: 4 новых файла, 2 изменённых**

---

