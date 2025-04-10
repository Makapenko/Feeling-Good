import React, { useMemo, useEffect, useState } from 'react';
import styles from './TodayTasks.module.css';
import {
  useAppDispatch,
  useUnlockedContent,
  useCompletedChapters,
  useFavoriteActivities,
  useFavoriteChapters,
  useTodayProgress,
  useTestsByType,
  useDailyProgress,
  useTodayActivitiesProgress
} from '../../redux/hooks';
import { setSpecialContent } from '../../redux/slices/progressSlice';
import { loadChapter } from '../../redux/actions/chapterActions';
import { getAvailableActivities } from '../../data/activitiesMapping';
import chaptersData from '../ListOfChapters/chapters.json';
import type { ChaptersData } from '../../types/chapters.types';
import { ActivityId, ACTIVITY_IDS, ACTIVITY_NAMES } from '../../constants/activities';
import {
  formatTimeFromSeconds,
  getDaysDifference,
  getCurrentDate,
  formatDateWithOptions
} from '../../utils/dateUtils';
import { SmartProgressChart } from '../ProgressChart';

// Константы для времени в секундах
const READING_GOAL_SECONDS = 300; // 5 минут
const METHODS_GOAL_SECONDS = 900; // 15 минут
const BURNS_TEST_INTERVAL_DAYS = 7; // Интервал между прохождениями опросника Бернса

// Типизируем импортированные JSON-данные
const typedChaptersData = chaptersData as ChaptersData;

// Интерфейс для дневной статистики чтения
interface DayReadingStats {
  date: string;
  totalTime: number;
}

// Интерфейс для дневной статистики методов
interface DayMethodsStats {
  date: string;
  totalTime: number;
  burnsScore?: number | null;
}

// Компонент для отображения истории чтения по дням
const ReadingHistoryBar: React.FC = () => {
  const dailyProgress = useDailyProgress();
  const [dayStats, setDayStats] = useState<DayReadingStats[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  
  // Функция для форматирования месяца
  const getMonthName = (date: Date): string => {
    const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return monthNames[date.getMonth()];
  };
  
  // Обработчик клика по квадратику
  const handleDayClick = (date: string) => {
    if (expandedDay === date) {
      setExpandedDay(null);
    } else {
      setExpandedDay(date);
    }
  };
  
  useEffect(() => {
    if (!dailyProgress) return;
    
    // Преобразуем прогресс в статистику по дням
    const stats: Record<string, number> = {};
    
    // Собираем данные по всем дням
    Object.entries(dailyProgress).forEach(([date, dayData]) => {
      if (dayData && dayData.chapters) {
        const totalTimeForDay = Object.values(dayData.chapters).reduce(
          (total, chapter) => total + (chapter?.timeSpent || 0), 
          0
        );
        
        if (totalTimeForDay > 0) {
          stats[date] = totalTimeForDay;
        }
      }
    });
    
    // Сортируем дни по возрастанию
    const sortedDays = Object.keys(stats).sort();
    
    if (sortedDays.length > 0) {
      // Найдем первый день с чтением
      const firstDayWithReading = sortedDays[0];
      const lastDay = getCurrentDate();
      
      // Создаем массив всех дней между первым и последним
      const allDays: DayReadingStats[] = [];
      const currentDate = new Date(firstDayWithReading);
      const endDate = new Date(lastDay);
      
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        allDays.push({
          date: dateString,
          totalTime: stats[dateString] || 0
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setDayStats(allDays);
    }
  }, [dailyProgress]);
  
  // Определяем цвет квадратика в зависимости от времени чтения
  const getColorByTime = (seconds: number) => {
    if (seconds === 0) return styles.readingNone; // Серый
    if (seconds < READING_GOAL_SECONDS) return styles.readingLow; // Желтый
    return styles.readingGood; // Зеленый (>=5 минут)
  };
  
  // Находим текущую серию дней с чтением
  const getCurrentStreak = (): number => {
    if (dayStats.length === 0) return 0;
    
    let streak = 0;
    const today = getCurrentDate();
    const todayIndex = dayStats.findIndex(day => day.date === today);
    
    if (todayIndex < 0) return 0;
    
    // Проверяем текущий день
    if (dayStats[todayIndex].totalTime > 0) {
      streak = 1;
      
      // Проверяем предыдущие дни
      for (let i = todayIndex - 1; i >= 0; i--) {
        if (dayStats[i].totalTime > 0) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  };
  
  // Подсчитываем общее время чтения за всю историю
  const getTotalHistoryReadingTime = (): number => {
    return dayStats.reduce((total, day) => total + day.totalTime, 0);
  };
  
  // Подсчитываем количество дней с чтением более 5 минут
  const getGoodReadingDays = (): number => {
    return dayStats.filter(day => day.totalTime >= READING_GOAL_SECONDS).length;
  };
  
  const readingStreak = getCurrentStreak();
  const totalHistoryTime = getTotalHistoryReadingTime();
  const goodReadingDays = getGoodReadingDays();
  
  if (dayStats.length === 0) {
    return <div className={styles.noReadingHistory}>История чтения пока отсутствует</div>;
  }
  
  return (
    <div className={styles.readingHistoryContainer}>
      <div className={styles.readingStats}>
        <div className={styles.readingStatItem}>
          <span className={styles.readingStatValue}>{readingStreak}</span>
          <span className={styles.readingStatLabel}>Дней подряд</span>
        </div>
        <div className={styles.readingStatItem}>
          <span className={styles.readingStatValue}>{formatTimeFromSeconds(totalHistoryTime, true)}</span>
          <span className={styles.readingStatLabel}>Всего прочитано</span>
        </div>
        <div className={styles.readingStatItem}>
          <span className={styles.readingStatValue}>{goodReadingDays}</span>
          <span className={styles.readingStatLabel}>Успешных дней</span>
        </div>
      </div>
      <div className={styles.readingHistoryScroll}>
        {dayStats.map((day, index) => {
          const isToday = day.date === getCurrentDate();
          const dayDate = new Date(day.date);
          const dayNumber = dayDate.getDate();
          const hasReading = day.totalTime > 0;
          const isExpanded = expandedDay === day.date;
          const isFirstDayOfMonth = dayNumber === 1 || index === 0;
          
          return (
            <div key={index} className={styles.dayBlock}>
              <div 
                className={`${styles.daySquare} ${getColorByTime(day.totalTime)} ${isToday ? styles.today : ''} ${isExpanded ? styles.expanded : ''}`}
                onClick={() => handleDayClick(day.date)}
                title={`${formatDateWithOptions(day.date)}: ${hasReading ? formatTimeFromSeconds(day.totalTime) : 'нет чтения'}`}
              >
                {isFirstDayOfMonth && (
                  <span className={styles.monthLabel}>{getMonthName(dayDate)}</span>
                )}
                <span className={styles.dayNumber}>{dayNumber}</span>
                {hasReading && (
                  <span className={styles.dayTime}>
                    {formatTimeFromSeconds(day.totalTime, false)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Хук для получения истории работы с методами
const useMethodsHistory = (): DayMethodsStats[] => {
  const [stats, setStats] = useState<DayMethodsStats[]>([]);
  const dailyProgress = useDailyProgress();
  const burnsResults = useTestsByType(ACTIVITY_IDS.BURNS_CHECKLIST);
  
  useEffect(() => {
    if (!dailyProgress) return;
    
    // Словарь для хранения статистики методов по дням
    const methodsStats: Record<string, DayMethodsStats> = {};
    
    // Сначала найдем все дни с работой над методами
    Object.entries(dailyProgress).forEach(([date, dayData]) => {
      // Считаем работу с методами
      let totalMethodsTime = 0;
      
      // Проверяем активности за день (новый способ хранения времени)
      if (dayData?.activities) {
        // Получаем время для метода трёх колонок
        const threeColumnsTime = dayData.activities['three-columns-method']?.timeSpent || 0;
        
        // Получаем время для дневника мыслей
        const diaryTime = dayData.activities['thought-diary']?.timeSpent || 0;
        
        // Суммируем времена из активностей
        totalMethodsTime += threeColumnsTime + diaryTime;
      }
      
      // Проверяем упражнения за день (старый способ хранения времени)
      if (dayData?.exercises?.exercises) {
        const threeColumnsExercises = dayData.exercises.exercises.filter(
          ex => ex.type === ACTIVITY_IDS.THREE_COLUMNS_METHOD
        );
        
        const diaryExercises = dayData.exercises.exercises.filter(
          ex => ex.type === ACTIVITY_IDS.THOUGHT_DIARY
        );
        
        // Суммируем время для всех упражнений типа "метод трёх колонок"
        let exerciseTime = 0;
        threeColumnsExercises.forEach(exercise => {
          if ('timeSpent' in exercise) {
            exerciseTime += (exercise.timeSpent || 0) as number;
          }
        });
        totalMethodsTime += exerciseTime;
        
        // Суммируем время для всех упражнений типа "дневник мыслей"
        exerciseTime = 0;
        diaryExercises.forEach(exercise => {
          if ('timeSpent' in exercise) {
            exerciseTime += (exercise.timeSpent || 0) as number;
          }
        });
        totalMethodsTime += exerciseTime;
      }
      
      // Если было время работы с методами, сохраняем запись
      if (totalMethodsTime > 0) {
        methodsStats[date] = {
          date,
          totalTime: totalMethodsTime,
          burnsScore: null // Изначально нет данных опросника
        };
      } else {
        // Создаем запись даже если не было работы, для непрерывности истории
        methodsStats[date] = {
          date,
          totalTime: 0,
          burnsScore: null
        };
      }
    });
    
    // Добавляем результаты опросника Бернса
    burnsResults.forEach(result => {
      const completionDate = result.completedAt.split('T')[0];
      
      if (methodsStats[completionDate]) {
        methodsStats[completionDate].burnsScore = result.score;
      } else {
        // Если еще не было записи для этой даты, создаем новую
        methodsStats[completionDate] = {
          date: completionDate,
          totalTime: 0,
          burnsScore: result.score
        };
      }
    });
    
    // Сортируем дни и заполняем пропуски
    const sortedDays = Object.keys(methodsStats).sort();
    
    if (sortedDays.length > 0) {
      // Найдем первый день с активностью
      const firstDay = sortedDays[0];
      const lastDay = getCurrentDate();
      
      // Создаем массив всех дней между первым и последним
      const allDays: DayMethodsStats[] = [];
      const currentDate = new Date(firstDay);
      const endDate = new Date(lastDay);
      
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        if (methodsStats[dateString]) {
          allDays.push(methodsStats[dateString]);
        } else {
          // Заполняем пропущенные дни
          allDays.push({
            date: dateString,
            totalTime: 0,
            burnsScore: null
          });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setStats(allDays);
    }
  }, [dailyProgress, burnsResults]);
  
  return stats;
};

// Компонент для отображения истории работы с методами
const MethodsHistoryBar: React.FC = () => {
  const methodsHistory = useMethodsHistory();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [showTestsMode, setShowTestsMode] = useState<boolean>(false);
  
  // Функция для форматирования месяца
  const getMonthName = (date: Date): string => {
    const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return monthNames[date.getMonth()];
  };
  
  // Обработчик клика по квадратику
  const handleDayClick = (date: string) => {
    if (expandedDay === date) {
      setExpandedDay(null);
    } else {
      setExpandedDay(date);
    }
  };
  
  // Определяем цвет квадратика в зависимости от времени работы с методами
  const getColorByTime = (seconds: number) => {
    if (seconds === 0) return styles.methodsNone; // Серый
    if (seconds < METHODS_GOAL_SECONDS) return styles.methodsLow; // Желтый
    return styles.methodsGood; // Зеленый (>=15 минут)
  };
  
  // Подсчитываем общее время работы с методами
  const getTotalMethodsTime = (): number => {
    return methodsHistory.reduce((total, day) => total + day.totalTime, 0);
  };
  
  // Находим текущую серию дней с работой над методами
  const getCurrentStreak = (): number => {
    if (methodsHistory.length === 0) return 0;
    
    let streak = 0;
    const today = getCurrentDate();
    const todayIndex = methodsHistory.findIndex(day => day.date === today);
    
    if (todayIndex < 0) return 0;
    
    // Проверяем текущий день
    if (methodsHistory[todayIndex].totalTime > 0) {
      streak = 1;
      
      // Проверяем предыдущие дни
      for (let i = todayIndex - 1; i >= 0; i--) {
        if (methodsHistory[i].totalTime > 0) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  };
  
  // Подсчитываем количество дней с полным выполнением цели
  const getGoodDays = (): number => {
    return methodsHistory.filter(day => day.totalTime >= METHODS_GOAL_SECONDS).length;
  };
  
  const methodsStreak = getCurrentStreak();
  const totalMethodsTime = getTotalMethodsTime();
  const goodMethodsDays = getGoodDays();
  
  // Функция для получения дней в режиме отображения тестов
  const getTestsAndIntervalsDays = (): React.ReactNode[] => {
    // Отфильтруем дни с результатами теста Бернса
    const daysWithTests = methodsHistory.filter(day => day.burnsScore !== null);
    
    if (daysWithTests.length === 0) {
      return [
        <div key="no-tests" className={styles.noMethodsHistory}>
          Результаты опросника Бернса отсутствуют
        </div>
      ];
    }
    
    const result: React.ReactNode[] = [];
    let lastMonth: number | null = null;
    
    // Обрабатываем каждый результат теста
    daysWithTests.forEach((testDay, testIndex) => {
      const testDate = new Date(testDay.date);
      const currentMonth = testDate.getMonth();
      const showMonthLabel = testIndex === 0 || currentMonth !== lastMonth;
      lastMonth = currentMonth;
      
      // Добавляем день с результатами теста
      result.push(
        <div key={`test-${testDay.date}`} className={styles.dayBlock}>
          <div 
            className={`${styles.daySquare} ${getColorByTime(testDay.totalTime)} ${testDay.date === getCurrentDate() ? styles.today : ''} ${expandedDay === testDay.date ? styles.expanded : ''} ${styles.hasBurnsScore}`}
            onClick={() => handleDayClick(testDay.date)}
            title={`${formatDateWithOptions(testDay.date)}: ${testDay.totalTime > 0 ? formatTimeFromSeconds(testDay.totalTime) : 'нет активности'} ${testDay.burnsScore !== null ? `, Опросник: ${testDay.burnsScore} баллов` : ''}`}
          >
            {showMonthLabel && (
              <span className={styles.monthLabel}>{getMonthName(testDate)}</span>
            )}
            <span className={styles.dayNumber}>{testDate.getDate()}</span>
            
            {/* Показываем индикатор прохождения опросника */}
            <span className={styles.burnsScoreBadge}>
              {testDay.burnsScore}
            </span>
          </div>
        </div>
      );
      
      // Если это последний тест, проверяем, есть ли активности после него
      if (testIndex === daysWithTests.length - 1) {
        const lastTestDate = new Date(testDay.date);
        const today = new Date(getCurrentDate());
        
        // Если последний тест был не сегодня, добавляем ещё один интервальный квадратик
        if (lastTestDate.getTime() < today.getTime()) {
          // Находим все дни после последнего теста
          const daysAfterLastTest = methodsHistory.filter(day => {
            const dayDate = new Date(day.date);
            return dayDate > lastTestDate && dayDate <= today;
          });
          
          if (daysAfterLastTest.length > 0) {
            const afterTestTime = daysAfterLastTest.reduce((total, day) => total + day.totalTime, 0);
            
            if (afterTestTime > 0) {
              // Проверяем, не начался ли новый месяц
              const firstDayAfterTest = daysAfterLastTest[0];
              const firstDayAfterTestDate = new Date(firstDayAfterTest.date);
              const afterTestMonth = firstDayAfterTestDate.getMonth();
              const showMonthLabel = afterTestMonth !== lastMonth;
              
              if (showMonthLabel) {
                lastMonth = afterTestMonth;
              }
              
              result.push(
                <div key={`after-last-test`} className={styles.dayBlock}>
                  <div 
                    className={`${styles.daySquare} ${getColorByTime(afterTestTime)} ${styles.intervalTime}`}
                    title={`Время активностей после последнего опросника (${formatDateWithOptions(testDay.date)}): ${formatTimeFromSeconds(afterTestTime)}`}
                  >
                    {showMonthLabel && (
                      <span className={styles.monthLabel}>{getMonthName(firstDayAfterTestDate)}</span>
                    )}
                    <span className={styles.dayNumber}>∑</span>
                    <span className={styles.dayTime}>
                      {formatTimeFromSeconds(afterTestTime, false)}
                    </span>
                  </div>
                </div>
              );
            }
          }
        }
      }
      // Если есть следующий тест, вычисляем интервал между ними
      else if (testIndex < daysWithTests.length - 1) {
        const nextTestDay = daysWithTests[testIndex + 1];
        
        // Находим все дни между текущим и следующим тестом
        const currentDate = new Date(testDay.date);
        const nextDate = new Date(nextTestDay.date);
        let intervalTime = 0;
        
        // Вычисляем общее время для всех дней в интервале
        const intervalDays = methodsHistory.filter(day => {
          const dayDate = new Date(day.date);
          return dayDate > currentDate && dayDate < nextDate;
        });
        
        intervalTime = intervalDays.reduce((total, day) => total + day.totalTime, 0);
        
        // Добавляем квадратик с суммарным временем между тестами
        if (intervalTime > 0 || intervalDays.length > 0) {
          // Проверяем, не начался ли новый месяц
          let showMonthLabel = false;
          
          if (intervalDays.length > 0) {
            const firstIntervalDay = intervalDays[0];
            const firstIntervalDate = new Date(firstIntervalDay.date);
            const intervalMonth = firstIntervalDate.getMonth();
            showMonthLabel = intervalMonth !== lastMonth;
            
            if (showMonthLabel) {
              lastMonth = intervalMonth;
            }
          }
          
          result.push(
            <div key={`interval-${testDay.date}-${nextTestDay.date}`} className={styles.dayBlock}>
              <div 
                className={`${styles.daySquare} ${getColorByTime(intervalTime)} ${intervalTime > 0 ? styles.intervalTime : styles.methodsNone}`}
                title={`Время активностей между ${formatDateWithOptions(testDay.date)} и ${formatDateWithOptions(nextTestDay.date)}: ${intervalTime > 0 ? formatTimeFromSeconds(intervalTime) : 'нет активности'}`}
              >
                {showMonthLabel && intervalDays.length > 0 && (
                  <span className={styles.monthLabel}>{getMonthName(new Date(intervalDays[0].date))}</span>
                )}
                <span className={styles.dayNumber}>∑</span>
                
                {/* Показываем суммарное время практики */}
                {intervalTime > 0 && (
                  <span className={styles.dayTime}>
                    {formatTimeFromSeconds(intervalTime, false)}
                  </span>
                )}
              </div>
            </div>
          );
        }
      }
    });
    
    return result;
  };
  
  if (methodsHistory.length === 0) {
    return <div className={styles.noMethodsHistory}>История работы с методами пока отсутствует</div>;
  }
  
  return (
    <div className={styles.methodsHistoryContainer}>
      <div className={styles.methodsStats}>
        <div className={styles.methodsStatItem}>
          <span className={styles.methodsStatValue}>{methodsStreak}</span>
          <span className={styles.methodsStatLabel}>Дней подряд</span>
        </div>
        <div className={styles.methodsStatItem}>
          <span className={styles.methodsStatValue}>{formatTimeFromSeconds(totalMethodsTime, true)}</span>
          <span className={styles.methodsStatLabel}>Всего практики</span>
        </div>
        <div className={styles.methodsStatItem}>
          <span className={styles.methodsStatValue}>{goodMethodsDays}</span>
          <span className={styles.methodsStatLabel}>Успешных дней</span>
        </div>
      </div>
      
      <div className={styles.displayModeControl}>
        <label className={styles.modeCheckbox}>
          <input 
            type="checkbox" 
            checked={showTestsMode} 
            onChange={() => setShowTestsMode(!showTestsMode)}
          />
          <span>Режим результатов опросника</span>
        </label>
      </div>
      
      {showTestsMode && (
        <div className={styles.modeLegend}>
          <div className={styles.legendItem}>
            <span className={styles.burnsScoreBadgeSmall}>№</span> 
            <span>Результаты опросника Бернса (баллы)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.sumSymbol}>∑</span> 
            <span>Суммарное время работы с методами между тестами</span>
          </div>
        </div>
      )}
      
      <div className={styles.methodsHistoryScroll}>
        {showTestsMode ? (
          // Показываем только дни с тестами и интервалы между ними
          getTestsAndIntervalsDays()
        ) : (
          // Стандартное отображение - все дни
          methodsHistory.map((day, index) => {
            const isToday = day.date === getCurrentDate();
            const dayDate = new Date(day.date);
            const dayNumber = dayDate.getDate();
            const isExpanded = expandedDay === day.date;
            const isFirstDayOfMonth = dayNumber === 1 || index === 0;
            
            return (
              <div key={index} className={styles.dayBlock}>
                <div 
                  className={`${styles.daySquare} ${getColorByTime(day.totalTime)} ${isToday ? styles.today : ''} ${isExpanded ? styles.expanded : ''} ${day.burnsScore !== null ? styles.hasBurnsScore : ''}`}
                  onClick={() => handleDayClick(day.date)}
                  title={`${formatDateWithOptions(day.date)}: ${day.totalTime > 0 ? formatTimeFromSeconds(day.totalTime) : 'нет активности'} ${day.burnsScore !== null ? `, Опросник: ${day.burnsScore} баллов` : ''}`}
                >
                  {isFirstDayOfMonth && (
                    <span className={styles.monthLabel}>{getMonthName(dayDate)}</span>
                  )}
                  <span className={styles.dayNumber}>{dayNumber}</span>
                  
                  {/* Показываем время практики */}
                  {day.totalTime > 0 && (
                    <span className={styles.dayTime}>
                      {formatTimeFromSeconds(day.totalTime, false)}
                    </span>
                  )}
                  
                  {/* Показываем индикатор прохождения опросника */}
                  {day.burnsScore !== null && (
                    <span className={styles.burnsScoreBadge}>
                      {day.burnsScore}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const TodayTasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const unlockedContent = useUnlockedContent();
  const completedChapters = useCompletedChapters();
  const favoriteActivitiesIds = useFavoriteActivities();
  const favoriteChapters = useFavoriteChapters();
  const todayProgress = useTodayProgress();
  const burnsTestResults = useTestsByType(ACTIVITY_IDS.BURNS_CHECKLIST);
  const todayActivitiesProgress = useTodayActivitiesProgress();

  // Получаем избранные активности напрямую из Redux
  const favoriteActivities = useMemo(() => {
    const favoriteIds = favoriteActivitiesIds || [];
    return favoriteIds.map(id => ({
      id,
      name: getActivityNameById(id)
    })).filter(activity => activity.name); // Фильтруем по наличию имени
  }, [favoriteActivitiesIds]);

  // Функция для получения имени активности по ID
  function getActivityNameById(id: string): string {
    return ACTIVITY_NAMES[id as keyof typeof ACTIVITY_NAMES] || '';
  }

  // Находим первую непрочитанную главу или подглаву
  const findFirstUnreadChapter = () => {
    // Пропускаем первые три главы (acknowledgments, foreword, introduction)
    const mainChapters = typedChaptersData.chapters.slice(3);

    for (const chapter of mainChapters) {
      // Проверяем доступность главы
      if (!unlockedContent.chapters.includes(chapter.id)) {
        continue;
      }

      // Если у главы есть подглавы
      if (chapter.sections && chapter.sections.length > 0) {
        for (const section of chapter.sections) {
          if (
            unlockedContent.chapters.includes(section.id) &&
            !completedChapters.includes(section.id)
          ) {
            return {
              id: section.id,
              title: section.title
            };
          }
        }
      } else if (!completedChapters.includes(chapter.id)) {
        // Если это глава без подглав
        return {
          id: chapter.id,
          title: chapter.title
        };
      }
    }
    return null;
  };

  const handleReadingClick = async () => {
    const firstUnreadChapter = findFirstUnreadChapter();
    
    if (firstUnreadChapter) {
      try {
        // Используем экшен loadChapter для загрузки главы
        await dispatch(loadChapter(firstUnreadChapter.id));
      } catch (error) {
        console.error('Ошибка загрузки главы:', error);
        alert('Не удалось загрузить главу. Пожалуйста, попробуйте позже или обратитесь в поддержку.');
      }
    } else {
      alert('Все доступные главы уже прочитаны. Попробуйте открыть другие главы или подождите новый контент.');
    }
  };

  // Проверяем статус опросника Бернса
  const checkBurnsStatus = () => {
    const availableActivities = getAvailableActivities(unlockedContent.chapters);
    if (!availableActivities.has(ACTIVITY_IDS.BURNS_CHECKLIST)) return null;

    if (burnsTestResults.length === 0) {
      return {
        needToComplete: true,
        message: 'Пройдите опросник депрессии Бернса',
        lastScore: null,
        completedAt: null
      };
    }

    const lastCompletionDate = new Date(burnsTestResults[0].completedAt);
    const today = new Date(getCurrentDate());
    const daysSinceLastCompletion = getDaysDifference(today, lastCompletionDate);
    
    // Сохраняем последний результат
    const lastScore = burnsTestResults[0].score;
    const maxScore = burnsTestResults[0].maxScore || 100;
    const scorePercent = lastScore !== undefined ? Math.round((lastScore / maxScore) * 100) : null;

    if (daysSinceLastCompletion >= BURNS_TEST_INTERVAL_DAYS) {
      return {
        needToComplete: true,
        message: burnsTestResults.length === 1
          ? 'Пройдите опросник Бернса повторно (второй раз)'
          : 'Пройдите опросник Бернса повторно',
        lastScore,
        scorePercent,
        completedAt: burnsTestResults[0].completedAt
      };
    }

    return {
      needToComplete: false,
      message: `Следующее прохождение опросника через ${BURNS_TEST_INTERVAL_DAYS - daysSinceLastCompletion} дн.`,
      lastScore,
      scorePercent,
      completedAt: burnsTestResults[0].completedAt
    };
  };

  // Получаем время работы с каждой методикой
  const threeCategoryTime = todayActivitiesProgress[ACTIVITY_IDS.THREE_COLUMNS_METHOD]?.timeSpent || 0;
  const diaryTime = todayActivitiesProgress[ACTIVITY_IDS.THOUGHT_DIARY]?.timeSpent || 0;
  const totalMethodsTime = threeCategoryTime + diaryTime;
  const methodsGoalAchieved = totalMethodsTime >= METHODS_GOAL_SECONDS;

  const burnsStatus = checkBurnsStatus();

  // Используем утилиту форматирования времени
  const formatTime = formatTimeFromSeconds;

  // Создадим константы для внутренних идентификаторов
  const DAILY_MOOD_ID = 'daily-mood';
  const AUTOMATIC_THOUGHTS_ID = 'automatic-thoughts';

  const handleActivityClick = (activityId: string) => {
    switch (activityId) {
      case DAILY_MOOD_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.BURNS_CHECKLIST));
        break;
      case AUTOMATIC_THOUGHTS_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.THREE_COLUMNS_METHOD));
        break;
      case ACTIVITY_IDS.THOUGHT_DIARY:
        dispatch(setSpecialContent(ACTIVITY_IDS.THOUGHT_DIARY));
        break;
      default:
        // Для избранных активностей передаем идентификатор напрямую
        // Здесь мы знаем, что activityId является валидным идентификатором активности
        dispatch(setSpecialContent(activityId as ActivityId));
        break;
    }

    // Прокрутка страницы вверх
    window.scrollTo(0, 0);
  };

  // Функция для перехода к чтению избранной главы
  const handleFavoriteChapterClick = async (chapterId: string) => {
    try {
      // Используем экшен loadChapter для загрузки избранной главы
      await dispatch(loadChapter(chapterId));
    } catch (error) {
      console.error('Ошибка загрузки главы:', error);
      alert('Не удалось загрузить главу. Пожалуйста, попробуйте позже или обратитесь в поддержку.');
    }
  };

  // Подсчитываем общее время чтения за сегодня
  const getTotalReadingTime = () => {
    if (!todayProgress?.chapters) return 0;
    return Object.values(todayProgress.chapters).reduce(
      (total, chapter) => total + chapter.timeSpent,
      0
    );
  };

  const totalReadingTime = getTotalReadingTime();
  const readingGoalAchieved = totalReadingTime >= READING_GOAL_SECONDS;

  return (
    <div className={styles.container}>
      <h2>Задания на сегодня</h2>
      <div className={styles.tasksList}>
        <h3 className={styles.taskSectionTitle}>Ежедневное чтение</h3>
        <div
          className={`${styles.task} ${!readingGoalAchieved ? styles.clickable : ''}`}
          onClick={!readingGoalAchieved ? handleReadingClick : undefined}
        >
          <div className={styles.taskHeader}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={readingGoalAchieved}
                readOnly
              />
            </div>
            <span className={styles.taskTitle}>
              Чтение (минимум 5 минут)
            </span>
          </div>
          <div className={styles.taskProgress}>
            <span className={styles.timeSpent}>
              Время чтения: {formatTime(totalReadingTime)}
            </span>
            {!readingGoalAchieved && (
              <>
                <span className={styles.remainingTime}>
                  Осталось: {formatTime(READING_GOAL_SECONDS - totalReadingTime)}
                </span>
                <span 
                  className={styles.openLink} 
                  onClick={(e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    console.log('Клик на кнопке "Продолжить чтение"');
                    handleReadingClick();
                  }}
                >
                  Продолжить чтение →
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Компонент для отображения истории чтения */}
        <div className={styles.readingHistorySection}>
          <h4 className={styles.readingHistoryTitle}>Прогресс вашего чтения</h4>
          <ReadingHistoryBar />
        </div>

        <h3 className={styles.taskSectionTitle}>Работа с методами</h3>
        <div className={`${styles.task} ${!methodsGoalAchieved ? styles.clickable : ''}`}
             onClick={!methodsGoalAchieved ? () => handleActivityClick(AUTOMATIC_THOUGHTS_ID) : undefined}
        >
          <div className={styles.taskHeader}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={methodsGoalAchieved}
                readOnly
              />
            </div>
            <span className={styles.taskTitle}>
              Поработать с методом трёх колонок или Дневником автоматических мыслей (минимум 15 минут)
            </span>
          </div>
          <div className={styles.taskProgress}>
            <span className={styles.timeSpent}>
              Время работы: {formatTime(totalMethodsTime)}
            </span>
            {!methodsGoalAchieved && (
              <>
                <span className={styles.remainingTime}>
                  Осталось: {formatTime(METHODS_GOAL_SECONDS - totalMethodsTime)}
                </span>
                <div className={styles.methodLinks}>
                  <span
                    className={styles.openLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivityClick(AUTOMATIC_THOUGHTS_ID);
                    }}
                  >
                    Открыть метод трёх колонок
                  </span>
                  <span
                    className={styles.openLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivityClick(ACTIVITY_IDS.THOUGHT_DIARY);
                    }}
                  >
                    Открыть дневник мыслей
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Обновленная секция с историей методов */}
        <div className={styles.methodsHistorySection}>
          <h4 className={styles.methodsHistoryTitle}>История работы с методами</h4>
          <MethodsHistoryBar />
        </div>

        {/* Модифицированный блок опросника */}
        {burnsStatus && (
          <div
            className={`${styles.task} ${burnsStatus.needToComplete ? styles.clickable : ''}`}
            onClick={burnsStatus.needToComplete ? () => handleActivityClick(DAILY_MOOD_ID) : undefined}
          >
            <div className={styles.taskHeader}>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={!burnsStatus.needToComplete}
                  readOnly
                />
              </div>
              <span className={styles.taskTitle}>
                {burnsStatus.message}
              </span>
            </div>
            
            <div className={styles.taskProgress}>
              {/* Показываем информацию о последнем результате, если он есть */}
              {burnsStatus.lastScore !== null && (
                <div className={styles.burnsResultContainer}>
                  <div className={styles.burnsScoreInfo}>
                    <span className={styles.burnsScoreLabel}>Последний результат:</span>
                    <span className={styles.burnsScoreValue}>
                      {burnsStatus.lastScore} баллов
                      {burnsStatus.scorePercent !== null && ` (${burnsStatus.scorePercent}%)`}
                    </span>
                    <span className={styles.burnsScoreDate}>
                      {formatDateWithOptions(burnsStatus.completedAt || '')}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Показываем кнопку прохождения, если нужно */}
              {burnsStatus.needToComplete && (
                <span 
                  className={styles.openLink}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivityClick(DAILY_MOOD_ID);
                  }}
                >
                  Открыть опросник
                </span>
              )}
              
              {!burnsStatus.needToComplete && (
                <span className={styles.timeSpent}>
                  {burnsStatus.message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* График прогресса пользователя */}
      <div className={styles.chartsSection}>
        <h3 className={styles.chartTitle}>Ваш прогресс</h3>
        <SmartProgressChart useRealData={true} autoAdjust={true} />
      </div>

      {favoriteActivities.length > 0 && (
        <>
          <h2 className={styles.favoritesTitle}>Избранные задания</h2>
          <div className={styles.favoritesList}>
            {favoriteActivities.map(activity => (
              <div
                key={activity.id}
                className={`${styles.favoriteItem} ${styles.clickable}`}
                onClick={() => handleActivityClick(activity.id)}
              >
                <div className={styles.favoriteIcon}>★</div>
                <span className={styles.favoriteTitle}>{activity.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {favoriteChapters.length > 0 && (
        <>
          <h2 className={styles.favoritesTitle}>Избранные главы</h2>
          <div className={styles.favoritesList}>
            {favoriteChapters.map(chapter => (
              <div
                key={chapter.id}
                className={`${styles.favoriteItem} ${styles.clickable}`}
                onClick={() => handleFavoriteChapterClick(chapter.id)}
              >
                <div className={styles.favoriteIcon}>★</div>
                <span className={styles.favoriteTitle}>{chapter.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TodayTasks;
