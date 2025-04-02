import React, { useState } from 'react';
import { useDailyProgress } from '../../redux/hooks';
import styles from './ProgressCalendar.module.css';
import chaptersData from '../ListOfChapters/chapters.json';
import { DayDetails } from './DayDetails';
import { ChapterMap, CalendarDayProgress } from './types';
import { formatTimeFromSeconds, formatDateWithOptions, getCurrentDate, formatDateToISO } from '../../utils/dateUtils';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const ProgressCalendar: React.FC = () => {
  const dailyProgressData = useDailyProgress();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return formatDateToISO(today).substring(0, 7);
  });

  // Создаем карту глав для быстрого поиска
  const chapterMap: ChapterMap = {};
  chaptersData.chapters.forEach(chapter => {
    chapterMap[chapter.id] = {
      id: chapter.id,
      title: chapter.title,
      order: chapter.order,
      sections: chapter.sections || []
    };
  });

  // Определяем, является ли id подглавой и находим родительскую главу
  const findParentChapter = (id: string): { id: string; title: string; order: number } | undefined => {
    for (const chapter of chaptersData.chapters) {
      if (chapter.sections?.some(section => section.id === id)) {
        return {
          id: chapter.id,
          title: chapter.title,
          order: chapter.order
        };
      }
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
            let chapterTitle = '';
            const parentChapter = findParentChapter(chapterId);

            if (parentChapter) {
              const section = chapterMap[parentChapter.id].sections.find(s => s.id === chapterId);
              chapterTitle = section?.title || chapterId;
            } else {
              chapterTitle = chapterMap[chapterId]?.title || chapterId;
            }

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
              const aOrder = a.parentChapter?.order || chapterMap[a.id]?.order || 0;
              const bOrder = b.parentChapter?.order || chapterMap[b.id]?.order || 0;
              if (aOrder !== bOrder) return aOrder - bOrder;

              if (a.parentChapter && b.parentChapter && a.parentChapter.id === b.parentChapter.id) {
                const sections = chapterMap[a.parentChapter.id].sections;
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
    const lastDay = new Date(year, month, 0);

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
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(date);
    }

    return days;
  };

  const dailyProgress = getDailyProgress();
  const monthDays = getMonthDays();

  const changeMonth = (delta: number) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + delta, 1);
    setCurrentMonth(formatDateToISO(newDate).substring(0, 7));
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
                <h3>{new Date(date).getDate()}</h3>
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
          chapterMap={chapterMap}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default ProgressCalendar; 
