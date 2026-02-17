import React, { useState } from 'react';
import { useDailyProgress } from '../../redux/hooks';
import styles from './ProgressCalendar.module.css';
import { DayDetails } from './DayDetails';
import { CalendarDayProgress } from './types';
import { getChapterTitle, findChapterData } from '../../utils/chapterUtils';
import { 
  formatTimeFromSeconds, 
  formatDateWithOptions, 
  getCurrentDate, 
  getCurrentYearMonth, 
  getDaysInMonth,
  getDayOfMonth,
  getUpdatedYearMonth
} from '../../utils/dateUtils';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const ProgressCalendar: React.FC = () => {
  const dailyProgressData = useDailyProgress();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(getCurrentYearMonth);

  // Находим родительскую главу по ID подглавы (поиск по всем книгам)
  const findParentChapter = (id: string): { id: string; title: string; order: number } | undefined => {
    const data = findChapterData(id);
    if (data && !data.isMainChapter) {
      return {
        id: data.chapter.id,
        title: data.chapter.title,
        order: data.chapter.order
      };
    }
    return undefined;
  };

  // Группируем прогресс по датам
  const getDailyProgress = (): { [key: string]: CalendarDayProgress } => {
    const processedDailyProgress: { [key: string]: CalendarDayProgress } = {};

    // Обрабатываем прогресс чтения
    if (dailyProgressData) {
      Object.entries(dailyProgressData).forEach(([date, dayProgress]) => {
        // Инициализируем структуру для текущей даты
        processedDailyProgress[date] = {
          date,
          chapters: [],
          exercises: {
            testResults: []
          }
        };

        // Обрабатываем прогресс по главам
        if (dayProgress.chapters && Object.keys(dayProgress.chapters).length > 0) {
          Object.entries(dayProgress.chapters).forEach(([chapterId, chapterProgress]) => {
            const chapterTitle = getChapterTitle(chapterId);
            const parentChapter = findParentChapter(chapterId);

            processedDailyProgress[date].chapters?.push({
              id: chapterId,
              title: chapterTitle,
              timeSpent: chapterProgress.timeSpent,
              parentChapter: parentChapter
            });
          });

          // Сортируем главы по порядку в книге
          if (processedDailyProgress[date].chapters) {
            processedDailyProgress[date].chapters.sort((a, b) => {
              const aData = findChapterData(a.id);
              const bData = findChapterData(b.id);
              const aOrder = a.parentChapter?.order || aData?.chapter.order || 0;
              const bOrder = b.parentChapter?.order || bData?.chapter.order || 0;
              if (aOrder !== bOrder) return aOrder - bOrder;

              if (a.parentChapter && b.parentChapter && a.parentChapter.id === b.parentChapter.id) {
                const parentData = findChapterData(a.parentChapter.id);
                const sections = parentData?.chapter.sections || [];
                const aIndex = sections.findIndex(s => s.id === a.id);
                const bIndex = sections.findIndex(s => s.id === b.id);
                return aIndex - bIndex;
              }
              return 0;
            });
          }
        }

        // Обработка тестов
        if (dayProgress.exercises.testResults && dayProgress.exercises.testResults.length > 0) {
          processedDailyProgress[date].exercises.testResults = dayProgress.exercises.testResults.map(test => ({
            id: test.id,
            name: test.name,
            completed: test.completed,
            score: test.score,
            maxScore: test.maxScore,
            completedAt: test.completedAt
          }));
        }

        // Обработка упражнений
        if (dayProgress.exercises.exercises && dayProgress.exercises.exercises.length > 0) {
          processedDailyProgress[date].exercises.exercises = dayProgress.exercises.exercises;
        }
      });
    }
    return processedDailyProgress;
  };

  const getMonthDays = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const daysInMonth = getDaysInMonth(year, month);

    // Получаем день недели для первого дня месяца (0 = воскресенье)
    let firstDayOfWeek = firstDay.getDay();
    // Преобразуем в формат, где понедельник = 0
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];

    // Добавляем пустые дни в начале месяца
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Добавляем дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(date);
    }

    return days;
  };

  const dailyProgress = getDailyProgress();
  const monthDays = getMonthDays();

  const changeMonth = (delta: number) => {
    setCurrentMonth(getUpdatedYearMonth(currentMonth, delta));
  };

  const formatMonthTitle = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    return formatDateWithOptions(`${year}-${String(month).padStart(2, '0')}-01`, {
      month: 'long',
      year: 'numeric'
    });
  };

  if (!dailyProgressData) {
    return (
      <div className={styles.calendar}>
        <h2>Календарь прогресса</h2>
        <p className={styles.emptyMessage}>Пока нет данных о прогрессе</p>
      </div>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.monthHeader}>
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h2 className={styles.monthTitle}>{formatMonthTitle()}</h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>

      <div className={styles.weekDays}>
        {WEEKDAYS.map(day => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
      </div>

      <div className={styles.days}>
        {monthDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className={styles.emptyDay} />;
          }

          const dayProgress = dailyProgress[date];
          const isCurrentDay = date === getCurrentDate();

          return (
            <div
              key={date}
              className={`${styles.day} ${dayProgress ? styles.hasContent : ''} ${isCurrentDay ? styles.currentDay : ''}`}
              onClick={() => dayProgress && setSelectedDate(date)}
            >
              <div className={styles.dayHeader}>
                <h3>{getDayOfMonth(date)}</h3>
                {dayProgress && dayProgress.chapters && (
                  <span>{formatTimeFromSeconds(dayProgress.chapters.reduce((total, chapter) => total + chapter.timeSpent, 0))}</span>
                )}
              </div>

              {dayProgress && (
                <div className={styles.dayContent}>
                  {dayProgress.chapters && dayProgress.chapters.length > 0 && (
                    <div className={styles.indicator}>
                      <span>📖 {dayProgress.chapters.length}</span>
                    </div>
                  )}
                  {dayProgress.exercises.testResults && dayProgress.exercises.testResults.length > 0 && (
                    <div className={styles.indicator}>
                      <span>✍️ {dayProgress.exercises.testResults.length}</span>
                    </div>
                  )}
                  {dayProgress.exercises.exercises && dayProgress.exercises.exercises.length > 0 && (
                    <div className={styles.indicator}>
                      <span>🎯 {dayProgress.exercises.exercises.length}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && dailyProgress[selectedDate] && (
        <DayDetails
          date={selectedDate}
          dayProgress={dailyProgress[selectedDate]}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default ProgressCalendar; 
