import React, { useState, useEffect, useRef } from 'react';
import styles from './TodayTasks.module.css';
import { useTestsByType, useDailyProgress } from "../../redux/hooks";
import { 
  formatTimeFromSeconds, 
  getCurrentDate, 
  formatDateWithOptions,
  formatDateToISO,
  getShortMonthName,
  getDayOfMonth
} from "../../utils/dateUtils";

// Интерфейс для дневной статистики активностей
interface DayActivityStats {
  date: string;
  totalTime: number;
  testScore?: number | null;
}

// Интерфейс для конфигурации компонента
interface ActivityHistoryConfig {
  title: string;
  emptyHistoryText: string;
  activityIds: string[];
  testActivityId: string;
  testScoreBadgeLabel?: string;
}

// Хук для получения истории работы с определенными активностями
const useActivityHistory = (config: ActivityHistoryConfig): DayActivityStats[] => {
  const [stats, setStats] = useState<DayActivityStats[]>([]);
  const dailyProgress = useDailyProgress();
  const testResults = useTestsByType(config.testActivityId);
  
  useEffect(() => {
    if (!dailyProgress) return;
    
    // Словарь для хранения статистики активностей по дням
    const activityStats: Record<string, DayActivityStats> = {};
    
    // Сначала найдем все дни с работой над активностями
    Object.entries(dailyProgress).forEach(([date, dayData]) => {
      // Считаем работу с активностями
      let totalActivityTime = 0;
      
      // Проверяем активности за день (новый способ хранения времени)
      if (dayData?.activities) {
        // Суммируем времена из требуемых активностей
        config.activityIds.forEach(activityId => {
          const activities = dayData.activities || {};
          const activityTime = activities[activityId]?.timeSpent || 0;
          totalActivityTime += activityTime;
        });
      }
      
      // Проверяем упражнения за день (старый способ хранения времени)
      if (dayData?.exercises?.exercises) {
        config.activityIds.forEach(activityId => {
          const exercises = dayData.exercises.exercises.filter(
            ex => ex.type === activityId
          );
          
          // Суммируем время для всех упражнений
          exercises.forEach(exercise => {
            if ('timeSpent' in exercise) {
              totalActivityTime += (exercise.timeSpent || 0) as number;
            }
          });
        });
      }
      
      // Сохраняем запись для непрерывности истории
      activityStats[date] = {
        date,
        totalTime: totalActivityTime,
        testScore: null // Изначально нет данных опросника
      };
    });
    
    // Добавляем результаты тестов
    testResults.forEach(result => {
      const completionDate = result.completedAt.split('T')[0];
      
      if (activityStats[completionDate]) {
        activityStats[completionDate].testScore = result.score;
      } else {
        // Если еще не было записи для этой даты, создаем новую
        activityStats[completionDate] = {
          date: completionDate,
          totalTime: 0,
          testScore: result.score
        };
      }
    });
    
    // Сортируем дни и заполняем пропуски
    const sortedDays = Object.keys(activityStats).sort();
    
    if (sortedDays.length > 0) {
      // Найдем первый день с активностью
      const firstDay = sortedDays[0];
      const lastDay = getCurrentDate();
      
      // Создаем массив всех дней между первым и последним
      const allDays: DayActivityStats[] = [];
      const currentDate = new Date(firstDay);
      const endDate = new Date(lastDay);
      
      while (currentDate <= endDate) {
        const dateString = formatDateToISO(currentDate);
        
        if (activityStats[dateString]) {
          allDays.push(activityStats[dateString]);
        } else {
          // Заполняем пропущенные дни
          allDays.push({
            date: dateString,
            totalTime: 0,
            testScore: null
          });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setStats(allDays);
    }
  }, [dailyProgress, testResults, config.activityIds, config.testActivityId]);
  
  return stats;
};

// Компонент для отображения истории работы с активностями
const ActivityHistoryBar: React.FC<{ 
  goalSeconds: number;
  config: ActivityHistoryConfig;
}> = ({ goalSeconds, config }) => {
  const activityHistory = useActivityHistory(config);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [showTestsMode, setShowTestsMode] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Прокручиваем до сегодняшнего дня при монтировании и при изменении истории
  useEffect(() => {
    if (scrollContainerRef.current && activityHistory.length > 0) {
      // Задержка перед прокруткой, чтобы дать время для рендеринга
      setTimeout(() => {
        if (scrollContainerRef.current) {
          // Прокрутка в самый конец
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [activityHistory.length]);
  
  // Обработчик клика по квадратику
  const handleDayClick = (date: string) => {
    if (expandedDay === date) {
      setExpandedDay(null);
    } else {
      setExpandedDay(date);
    }
  };
  
  // Определяем цвет квадратика в зависимости от времени работы
  const getColorByTime = (seconds: number) => {
    if (seconds === 0) return styles.methodsNone; // Серый
    if (seconds < goalSeconds) return styles.methodsLow; // Желтый
    return styles.methodsGood; // Зеленый (>=15 минут)
  };
  
  // Подсчитываем общее время работы
  const getTotalActivityTime = (): number => {
    return activityHistory.reduce((total, day) => total + day.totalTime, 0);
  };
  
  // Находим текущую серию дней с работой
  const getCurrentStreak = (): number => {
    if (activityHistory.length === 0) return 0;
    
    let streak = 0;
    const today = getCurrentDate();
    const todayIndex = activityHistory.findIndex(day => day.date === today);
    
    if (todayIndex < 0) return 0;
    
    // Проверяем текущий день
    if (activityHistory[todayIndex].totalTime > 0) {
      streak = 1;
      
      // Проверяем предыдущие дни
      for (let i = todayIndex - 1; i >= 0; i--) {
        if (activityHistory[i].totalTime > 0) {
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
    return activityHistory.filter(day => day.totalTime >= goalSeconds).length;
  };
  
  // Функция для получения дней в режиме отображения тестов
  const getTestsAndIntervalsDays = (): React.ReactNode[] => {
    // Отфильтруем дни с результатами теста
    const daysWithTests = activityHistory.filter(day => day.testScore !== null);
    
    if (daysWithTests.length === 0) {
      return [
        <div key="no-tests" className={styles.noMethodsHistory}>
          Результаты {config.testScoreBadgeLabel || "теста"} отсутствуют
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
            title={`${formatDateWithOptions(testDay.date)}: ${testDay.totalTime > 0 ? formatTimeFromSeconds(testDay.totalTime) : 'нет активности'} ${testDay.testScore !== null ? `, Тест: ${testDay.testScore} баллов` : ''}`}
          >
            {showMonthLabel && (
              <span className={styles.monthLabel}>{getShortMonthName(testDay.date)}</span>
            )}
            <span className={styles.dayNumber}>{getDayOfMonth(testDay.date)}</span>
            
            {/* Показываем индикатор прохождения теста */}
            <span className={styles.burnsScoreBadge}>
              {testDay.testScore}
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
          const daysAfterLastTest = activityHistory.filter(day => {
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
                    title={`Время активностей после последнего теста (${formatDateWithOptions(testDay.date)}): ${formatTimeFromSeconds(afterTestTime)}`}
                  >
                    {showMonthLabel && (
                      <span className={styles.monthLabel}>{getShortMonthName(firstDayAfterTest.date)}</span>
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
        const intervalDays = activityHistory.filter(day => {
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
                  <span className={styles.monthLabel}>{getShortMonthName(intervalDays[0].date)}</span>
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
  
  const activityStreak = getCurrentStreak();
  const totalActivityTime = getTotalActivityTime();
  const goodActivityDays = getGoodDays();
  
  if (activityHistory.length === 0) {
    return <div className={styles.noMethodsHistory}>{config.emptyHistoryText}</div>;
  }
  
  return (
    <div className={styles.methodsHistoryContainer}>
      <div className={styles.methodsStats}>
        <div className={styles.methodsStatItem}>
          <span className={styles.methodsStatValue}>{activityStreak}</span>
          <span className={styles.methodsStatLabel}>Дней подряд</span>
        </div>
        <div className={styles.methodsStatItem}>
          <span className={styles.methodsStatValue}>{formatTimeFromSeconds(totalActivityTime, true)}</span>
          <span className={styles.methodsStatLabel}>Всего практики</span>
        </div>
        <div className={styles.methodsStatItem}>
          <span className={styles.methodsStatValue}>{goodActivityDays}</span>
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
          <span>Режим результатов {config.testScoreBadgeLabel || "теста"}</span>
        </label>
      </div>
      
      {showTestsMode && (
        <div className={styles.modeLegend}>
          <div className={styles.legendItem}>
            <span className={styles.burnsScoreBadgeSmall}>№</span> 
            <span>Результаты {config.testScoreBadgeLabel || "теста"} (баллы)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.sumSymbol}>∑</span> 
            <span>Суммарное время работы между тестами</span>
          </div>
        </div>
      )}
      
      <div className={styles.methodsHistoryScroll} ref={scrollContainerRef}>
        {showTestsMode ? (
          // Показываем только дни с тестами и интервалы между ними
          getTestsAndIntervalsDays()
        ) : (
          // Стандартное отображение - все дни
          activityHistory.map((day, index) => {
            const isToday = day.date === getCurrentDate();
            const dayNumber = getDayOfMonth(day.date);
            const isExpanded = expandedDay === day.date;
            const isFirstDayOfMonth = dayNumber === 1 || index === 0;
            
            return (
              <div key={index} className={styles.dayBlock}>
                <div 
                  className={`${styles.daySquare} ${getColorByTime(day.totalTime)} ${isToday ? styles.today : ''} ${isExpanded ? styles.expanded : ''} ${day.testScore !== null ? styles.hasBurnsScore : ''}`}
                  onClick={() => handleDayClick(day.date)}
                  title={`${formatDateWithOptions(day.date)}: ${day.totalTime > 0 ? formatTimeFromSeconds(day.totalTime) : 'нет активности'} ${day.testScore !== null ? `, Тест: ${day.testScore} баллов` : ''}`}
                >
                  {isFirstDayOfMonth && (
                    <span className={styles.monthLabel}>{getShortMonthName(day.date)}</span>
                  )}
                  <span className={styles.dayNumber}>{dayNumber}</span>
                  
                  {/* Показываем время практики */}
                  {day.totalTime > 0 && (
                    <span className={styles.dayTime}>
                      {formatTimeFromSeconds(day.totalTime, false)}
                    </span>
                  )}
                  
                  {/* Показываем индикатор прохождения теста */}
                  {day.testScore !== null && (
                    <span className={styles.burnsScoreBadge}>
                      {day.testScore}
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

export default ActivityHistoryBar; 
