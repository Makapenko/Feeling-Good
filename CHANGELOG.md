# Changelog

Все заметные изменения в этом проекте будут документированы в этом файле.

## [Unreleased] - 2025-10-26

### Добавлено ✨

#### 1. Система рейтинга упражнений ⭐
- Компонент `ExerciseRating` с 5-звездочным рейтингом
- Возможность добавления комментариев к рейтингам
- Автоматическое сохранение и редактирование рейтингов
- Интеграция в компонент `RecordsList` для дневника мыслей
- Утилиты для работы с рейтингами (`exerciseRatingUtils.ts`)
- Redux action `saveExerciseRating` для сохранения оценок

**Файлы:**
- `src/components/shared/ExerciseRating/ExerciseRating.tsx`
- `src/components/shared/ExerciseRating/ExerciseRating.module.css`
- `src/utils/exerciseRatingUtils.ts`
- `src/redux/types.ts` (добавлен интерфейс `ExerciseRating`)
- `src/redux/slices/progressSlice.ts` (добавлен reducer)

#### 2. Счётчик серий активности 🔥
- Компонент `StreakDisplay` для отображения серий
- Расчёт текущей и рекордной серии дней подряд
- Подсчёт общего количества активных дней
- Мотивационные сообщения в зависимости от длины серии
- Индикатор активности сегодня
- Градиентный дизайн с анимацией пульсирующего огонька
- Адаптивная версия для мобильных устройств

**Файлы:**
- `src/components/shared/StreakDisplay/StreakDisplay.tsx`
- `src/components/shared/StreakDisplay/StreakDisplay.module.css`
- `src/utils/streakUtils.ts`
- `src/components/WelcomePage/WelcomePage.tsx` (интеграция)

**Утилиты:**
- `calculateCurrentStreak()` - текущая серия
- `calculateLongestStreak()` - рекордная серия
- `calculateTotalActiveDays()` - всего активных дней
- `getStreakInfo()` - полная информация о сериях
- `isActiveToday()` - проверка активности сегодня
- `getStreakMotivationalMessage()` - мотивационные сообщения

#### 3. График динамики настроения 📈
- Компонент `MoodTrendChart` с использованием Recharts
- Линейный график с историей баллов по опроснику Бернса
- Статистические карточки: всего тестов, последний балл, средний, лучший результат
- Референсные линии для интерпретации уровней депрессии
- Интерактивный tooltip с детальной информацией
- Мотивационные сообщения о прогрессе
- Цветовая легенда для интерпретации баллов
- Адаптивный дизайн для мобильных устройств
- Empty state для новых пользователей

**Файлы:**
- `src/components/MoodTrendChart/MoodTrendChart.tsx`
- `src/components/MoodTrendChart/MoodTrendChart.module.css`
- `src/utils/moodTrendUtils.ts`
- `src/components/TodayTasks/TodayTasks.tsx` (интеграция)

**Утилиты:**
- `getBurnsInterpretation()` - интерпретация баллов
- `getMoodTrendData()` - извлечение данных тестов
- `getLatestBurnsScore()` - последний результат
- `getMoodImprovement()` - изменение настроения
- `getAverageMoodScore()` - средний балл за период
- `getMoodTrend()` - тренд (улучшается/ухудшается/стабильно)
- `formatMoodDataForChart()` - форматирование для Recharts
- `getMoodStats()` - полная статистика

**Интерпретация баллов:**
- 0-5: Минимальная или отсутствует (зелёный)
- 6-10: Легкая депрессия (светло-зелёный)
- 11-25: Умеренная депрессия (жёлтый)
- 26-45: Тяжелая депрессия (оранжевый)
- 46-60: Крайне тяжелая депрессия (красный)

### Изменено 🔄

- **RecordsList**: Добавлен prop `activityId` для интеграции рейтинга
- **ThoughtDiaryBase**: Передача `activityId` в компонент `RecordsList`
- **WelcomePage**: Добавлен компонент `StreakDisplay` на главную страницу
- **TodayTasks**: Добавлен компонент `MoodTrendChart` в раздел работы с самооценкой
- **progressSlice**: Расширен initial state полем `exerciseRatings`
- **types.ts**: Добавлен интерфейс `ExerciseRating`

### Технические детали 🔧

**Redux State:**
```typescript
interface UserProgress {
  // ... существующие поля
  exerciseRatings: ExerciseRating[];
}

interface ExerciseRating {
  exerciseId: string;
  activityId: string;
  rating: number; // 1-5
  ratedAt: string;
  comment?: string;
}
```

**Новые зависимости:**
- Recharts 2.15.1 уже был в проекте, используется для графика настроения

**Архитектура:**
- Все данные хранятся в localStorage (offline-first)
- TypeScript strict mode для безопасности типов
- Мемоизация селекторов для оптимизации производительности
- Адаптивный дизайн для desktop и mobile

### Статистика изменений 📊

- **Добавлено**: 12 новых файлов
- **Изменено**: 6 существующих файлов
- **Новых компонентов**: 3 (ExerciseRating, StreakDisplay, MoodTrendChart)
- **Новых утилит**: 3 (exerciseRatingUtils, streakUtils, moodTrendUtils)
- **Новых Redux actions**: 1 (saveExerciseRating)
- **Новых селекторов**: 10+ (для рейтингов, серий, настроения)

### Планы на будущее 🚀

**Приоритет 1 (15 минут):**
- Интеграция рейтинга во все 14 оставшихся упражнений на базе ThoughtDiaryBase

**Приоритет 2 (5 часов):**
- Дашборд аналитики с рейтингами и корреляциями

**Приоритет 3 (18-24 часа):**
- Недостающие упражнения из книги (Работа с виной, Перфекционизм, Работа-самооценка)

---

## [0.0.0] - 2024-XX-XX

### Изначальный релиз
- 37 терапевтических упражнений
- Система глав с последовательным открытием
- Календарь прогресса
- Тесты: Бернса, Прокрастинации, Дисфункциональных установок, Гнева Новако
- Адаптивный дизайн для desktop и mobile
- Offline-first архитектура с localStorage
- Redux для управления состоянием
