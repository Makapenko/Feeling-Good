// TODO: добавить информацию как добавлять тесты

1. Добавить название переменной в ACTIVITY_IDS и ACTIVITY_NAMES в src/constants/activities.ts
   1.1. В объект ACTIVITY_IDS добавить новую активность (соблюдайте формат именования - SNAKE_CASE)
   1.2. В объект ACTIVITY_NAMES добавить человекочитаемое название для этой активности

2. Добавить саму активность в src/components/Activities/
   2.1. Если это тест или опросник - использовать компонент src/components/Activities/Survey/Survey.tsx
      2.1.1 Создать новую директорию для активности (например, NewSurvey/)
      2.1.2 Создать основной компонент, который будет использовать Survey.tsx

   2.2. Если это метод трёх или двух колонок - использовать src/components/Activities/ThreeColumnsBase/ThreeColumnsBase.tsx
      2.2.1 Создать новую директорию для активности (например, NewColumnsMethod/)
      2.2.2 Создать основной компонент по аналогии с ThreeColumnsMethod.tsx
      2.2.3 Добавить в ThreeColumnsBase необходимые строки с названием нового метода
   
   2.3. Если это форма дневника - использовать src/components/Activities/ThoughtDiaryBase/ThoughtDiaryBase.tsx
      2.3.1 Создать новую директорию для активности (например, NewDiary/)
      2.3.2 Создать основной компонент по аналогии с ThoughtDiary.tsx
   
   2.4 Типы добавлять в файл /types.ts в папке с активностью
   2.5 Добавить кнопки в активности
      2.5.1 import ChapterLinkButton from '../../shared/ChapterLinkButton';
      2.5.2 import FavoriteButton from '../../shared/FavoriteButton';

3. Добавить активность в src/components/ActivitiesPanel/ActivitiesPanel.tsx
   3.1. Добавить новую активность в соответствующую секцию в массиве sections
   3.2. При необходимости создать новую секцию

4. Добавить активность в список компонентов в src/components/MainContent/MainContent.tsx
   4.1. Импортировать созданный компонент активности
   4.2. Добавить компонент в объект ACTIVITY_COMPONENTS

5. Создать отображение результатов в календаре - src/components/ProgressCalendar/render (не нужно если задание не интерактивно - шпаргалка, список)
   5.1. Создать новый компонент по аналогии с существующими (например, NewExerciseComponent.tsx)
      5.1.1. Если новый компонент является вариантом компонента ThreeColumnsBase, то вместо создания нового компонента - добавить вариант в render/ThreeColumnsExerciseComponent.tsx
      5.1.2. Если новый компонент является вариантом компонента ThoughtDiaryBase, то вместо создания нового компонента - использовать универсальный компонент ThoughtDiaryExerciseComponent внутри RenderExercises с нужными параметрами (customTitle, showCognitiveDistortions, showEmotionIntensity, showResultIntensity)
   5.2. Добавить этот рендер в src/components/ProgressCalendar/DayDetails.tsx в функцию renderExercises
   5.3. Стили используй из '../DayDetails.module.css' если нужны дополнительные - допиши

6. Добавить в список компонентов со скрытым таймером в src/components/UniversalTimer/UniversalTimer.tsx
   6.1. Добавить идентификатор активности в массив HIDDEN_TIMER_COMPONENTS
   6.2. Если таймер полностью не нужен - добавить в EXCLUDED_TIMER_COMPONENTS

7. Связать с соответствующей главой в src/data/activitiesMapping.ts
   7.1. Добавить ID главы и активности в объект chapterToActivitiesMap


