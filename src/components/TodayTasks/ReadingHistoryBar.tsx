import { useState, useEffect, useRef } from "react";
import { useDailyProgress } from "../../redux/hooks";
import { 
  formatTimeFromSeconds, 
  getCurrentDate, 
  formatDateWithOptions,
  formatDateToISO,
  getShortMonthName,
  getDayOfMonth 
} from "../../utils/dateUtils";
import styles from "./TodayTasks.module.css";

// Интерфейс для дневной статистики чтения
interface DayReadingStats {
  date: string;
  totalTime: number;
}

// Компонент для отображения истории чтения по дням
const ReadingHistoryBar: React.FC<{ readingGoalSeconds: number }> = ({ readingGoalSeconds }) => {
  const dailyProgress = useDailyProgress();
  const [dayStats, setDayStats] = useState<DayReadingStats[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Обработчик клика по квадратику
  const handleDayClick = (date: string) => {
    if (expandedDay === date) {
      setExpandedDay(null);
    } else {
      setExpandedDay(date);
    }
  };
  
  // Прокручиваем до сегодняшнего дня при монтировании и при изменении истории
  useEffect(() => {
    if (scrollContainerRef.current && dayStats.length > 0) {
      // Задержка перед прокруткой, чтобы дать время для рендеринга
      setTimeout(() => {
        if (scrollContainerRef.current) {
          // Прокрутка в самый конец
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [dayStats.length]);
  
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
        const dateString = formatDateToISO(currentDate);
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
    if (seconds < readingGoalSeconds) return styles.readingLow; // Желтый
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
    return dayStats.filter(day => day.totalTime >= readingGoalSeconds).length;
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
      <div className={styles.readingHistoryScroll} ref={scrollContainerRef}>
        {dayStats.map((day, index) => {
          const isToday = day.date === getCurrentDate();
          const dayNumber = getDayOfMonth(day.date);
          const hasReading = day.totalTime > 0;
          const isExpanded = expandedDay === day.date;
          const isFirstDayOfMonth = dayNumber === 1 || index === 0;
          
          return (
            <div key={index} className={styles.dayBlock}>
              <div 
                className={`${styles.daySquare} ${getColorByTime(day.totalTime)} ${isToday ? styles.today : ''} ${isExpanded ? styles.expanded : ''}`}
                onClick={() => handleDayClick(day.date)}
                title={`${formatDateWithOptions(day.date, {
                  day: 'numeric',
                  month: 'long'
                })}: ${hasReading ? formatTimeFromSeconds(day.totalTime) : 'нет чтения'}`}
              >
                {isFirstDayOfMonth && (
                  <span className={styles.monthLabel}>{getShortMonthName(day.date)}</span>
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

export default ReadingHistoryBar;
