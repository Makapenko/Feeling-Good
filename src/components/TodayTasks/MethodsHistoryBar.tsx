import { useTestsByType } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { useDailyProgress } from "../../redux/hooks";
import { ACTIVITY_IDS } from "../../constants/activities";
import { formatTimeFromSeconds, getCurrentDate, formatDateWithOptions } from "../../utils/dateUtils";
import styles from "./TodayTasks.module.css";

// Интерфейс для дневной статистики методов
interface DayMethodsStats {
  date: string;
  totalTime: number;
  burnsScore?: number | null;
}

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
        const threeColumnsTime = dayData.activities[ACTIVITY_IDS.THREE_COLUMNS_METHOD]?.timeSpent || 0;
        
        // Получаем время для дневника мыслей
        const diaryTime = dayData.activities[ACTIVITY_IDS.THOUGHT_DIARY]?.timeSpent || 0;
        
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
const MethodsHistoryBar: React.FC<{ readingGoalSeconds: number }> = ({ readingGoalSeconds }) => {
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
    if (seconds < readingGoalSeconds) return styles.methodsLow; // Желтый
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
    return methodsHistory.filter(day => day.totalTime >= readingGoalSeconds).length;
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

export default MethodsHistoryBar;
