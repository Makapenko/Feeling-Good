# Инструкция по обновлению компонентов для использования селекторов и actions

Для улучшения производительности и организации кода, необходимо обновить оставшиеся компоненты, чтобы они использовали новые селекторы и actions. Ниже представлена пошаговая инструкция по миграции компонентов.

## Шаг 1: Импорты

### Было:
```typescript
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { someAction } from '../../redux/slices/progressSlice';
```

### Стало:
```typescript
import { useAppDispatch, useISomeSelector } from '../../redux/hooks';
import { someActionWithNotification } from '../../redux/actions';
```

## Шаг 2: Получение данных из Redux

### Было:
```typescript
const progress = useAppSelector(state => state.progress);
const chapters = useAppSelector(state => state.progress.chapters);
const favoriteActivities = useAppSelector(state => state.progress.favoriteActivities);
```

### Стало:
```typescript
const progress = useProgressSelector(); // селектор всего прогресса если нужен
const chapters = useChapters(); // специализированный селектор
const favoriteActivities = useFavoriteActivities(); // специализированный селектор
```

## Шаг 3: Работа с параметризованными селекторами

### Было:
```typescript
// Получение информации, является ли глава доступной
const isAvailable = unlockedContent?.chapters?.includes(chapterId) || 
                     unlockedContent?.chapters?.includes('all');

// Проверка, находится ли активность в избранном
const isFavorite = favoriteActivities?.includes(activityId);
```

### Стало:
```typescript
// Получение информации, является ли глава доступной
const isAvailable = useIsChapterAvailable(chapterId);

// Проверка, находится ли активность в избранном
const isFavorite = useIsFavoriteActivity(activityId);
```

## Шаг 4: Замена действий на thunks с уведомлениями

### Было:
```typescript
// Добавление в избранное
dispatch(toggleFavoriteActivity(activityId));

// Установка специального контента
dispatch(setSpecialContent(contentId));

// Сохранение упражнения
dispatch(saveExercise(exercise));

// Сохранение результатов теста
dispatch(saveTestResult(result));
```

### Стало:
```typescript
// Добавление в избранное с уведомлением
dispatch(toggleFavoriteActivity({ 
  activityId, 
  showNotification: true 
}));

// Установка специального контента с уведомлением
dispatch(setSpecialContent({ 
  content: contentId, 
  showNotification: true,
  notificationMessage: 'Открыт раздел: ' + getActivityName(contentId)
}));

// Сохранение упражнения с уведомлением
dispatch(addExercise({ 
  exercise, 
  showNotification: true 
}));

// Сохранение результатов теста с уведомлением
dispatch(saveTestResultWithNotification({ 
  testResult: result, 
  showNotification: true 
}));
```

## Шаг 5: Обновление загрузки данных глав

### Было:
```typescript
const handleChapterClick = async (chapterId) => {
  try {
    const response = await fetch(getChapterPath(chapterId));
    const content = await response.text();
    
    dispatch(setCurrentChapter({
      id: chapterId,
      title: getChapterTitle(chapterId),
      content,
      timeSpent: 0,
      completed: false
    }));
  } catch (error) {
    console.error('Error loading chapter:', error);
  }
};
```

### Стало:
```typescript
const handleChapterClick = (chapterId) => {
  dispatch(loadChapter(chapterId));
};
```

## Шаг 6: Обновление обработки времени чтения

### Было:
```typescript
const handleTimeUpdate = (timeSpent) => {
  dispatch(updateChapterProgress({ chapterId, timeSpent }));
};
```

### Стало:
```typescript
const handleTimeUpdate = (timeSpent) => {
  dispatch(updateChapterTime({ chapterId, timeSpent }));
};
```

## Шаг 7: Использование селекторов для получения ежедневных данных

### Было:
```typescript
const currentDate = getCurrentDate();
const todayProgress = progress.dailyProgress[currentDate] || { 
  chapters: {}, 
  exercises: { 
    exercises: [], 
    testResults: [] 
  } 
};
const exercises = todayProgress.exercises.exercises || [];
```

### Стало:
```typescript
const todayProgress = useTodayProgress();
const exercises = useTodayExercises();
const testResults = useTodayTests();
```

## Шаг 8: Фильтрация по типу активности или упражнения

### Было:
```typescript
const filteredExercises = useMemo(() => {
  if (!progress?.dailyProgress) return [];
  
  return Object.values(progress.dailyProgress)
    .flatMap(day => day.exercises.exercises || [])
    .filter(exercise => exercise.type === exerciseType);
}, [progress, exerciseType]);
```

### Стало:
```typescript
const filteredExercises = useExercisesByType(exerciseType);
```

## Шаг 9: Использование селектора для получения времени, потраченного на главы

### Было:
```typescript
const totalTimeSpent = useMemo(() => {
  let total = 0;
  
  if (progress?.dailyProgress) {
    Object.values(progress.dailyProgress).forEach(day => {
      Object.values(day.chapters || {}).forEach(chapter => {
        total += chapter.timeSpent || 0;
      });
    });
  }
  
  return total;
}, [progress]);
```

### Стало:
```typescript
const timeSpentByChapter = useTimeSpentByChapter();
const totalTimeSpent = useMemo(() => {
  return Object.values(timeSpentByChapter).reduce((sum, time) => sum + time, 0);
}, [timeSpentByChapter]);
```

## Примеры обновления компонентов

### Пример для компонента FavoriteButton.tsx:

```typescript
import React from 'react';
import { SpecialContent } from '../../types/progress.types';
import styles from './FavoriteButton.module.css';
import { useAppDispatch } from '../../redux/hooks';
import { useIsFavoriteActivity } from '../../redux/hooks';
import { toggleFavoriteActivity } from '../../redux/actions';

interface FavoriteButtonProps {
  activityId: SpecialContent;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  activityId,
  className = ''
}) => {
  const dispatch = useAppDispatch();
  const isFavorite = useIsFavoriteActivity(activityId);
  
  // Добавление или удаление из избранного через Redux
  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteActivity({ 
      activityId,
      showNotification: true
    }));
  };
  
  return (
    <button
      className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''} ${className}`}
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      ★
    </button>
  );
};

export default FavoriteButton;
```

### Пример для компонента ChapterReader.tsx:

```typescript
import { useAppDispatch } from '../../redux/hooks';
import { useCurrentChapter } from '../../redux/hooks';
import { updateChapterTime, completeChapter } from '../../redux/actions';

const ChapterReader = ({ onNext }) => {
  const dispatch = useAppDispatch();
  const currentChapter = useCurrentChapter();
  
  const handleTimeUpdate = (timeSpent) => {
    if (currentChapter) {
      dispatch(updateChapterTime({ 
        chapterId: currentChapter.id, 
        timeSpent 
      }));
    }
  };
  
  const handleNextChapter = () => {
    if (currentChapter) {
      dispatch(completeChapter(currentChapter.id));
      if (onNext) onNext();
    }
  };
  
  // Остальной код компонента
};
```

## Пошаговый план миграции всех компонентов

1. Начните с простых компонентов, которые используют минимум селекторов (например, FavoriteButton, ChapterLinkButton)
2. Обновите компоненты верхнего уровня (MainContent, ListOfChapters)
3. Обновите компоненты активностей и упражнений
4. Обновите компоненты мобильного интерфейса
5. Проверьте правильность работы всех компонентов после миграции

## Проверка после обновления

После обновления каждого компонента, проверьте следующее:

1. Приложение запускается без ошибок
2. Все функции компонента работают правильно
3. Отображаются нужные уведомления при выполнении действий
4. Данные правильно сохраняются и загружаются
5. Производительность не пострадала или улучшилась

Эти шаги позволят вам последовательно обновить все компоненты приложения для использования новых селекторов и actions, что приведет к улучшению структуры кода и повышению производительности.
