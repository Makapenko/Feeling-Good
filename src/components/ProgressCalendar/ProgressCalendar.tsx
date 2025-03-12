import { useState } from 'react';
import { useProgress } from '../../store/ProgressContext';
import styles from './ProgressCalendar.module.css';
import chaptersData from '../ListOfChapters/chapters.json';
import DayDetails from './DayDetails';
import { ChapterMap, CalendarDayProgress } from './types';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const ProgressCalendar: React.FC = () => {
  const { progress } = useProgress();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
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
    const dailyProgress: { [key: string]: CalendarDayProgress } = {};

    // Обрабатываем прогресс чтения
    if (progress?.dailyProgress) {
      Object.entries(progress.dailyProgress).forEach(([date, dayProgress]) => {
        if (dayProgress.chapters && Object.keys(dayProgress.chapters).length > 0) {
          dailyProgress[date] = {
            date,
            chapters: [],
            exercises: {
              testResults: []
            }
          };

          Object.entries(dayProgress.chapters).forEach(([chapterId, chapterProgress]) => {
            let chapterTitle = '';
            const parentChapter = findParentChapter(chapterId);

            if (parentChapter) {
              const section = chapterMap[parentChapter.id].sections.find(s => s.id === chapterId);
              chapterTitle = section?.title || chapterId;
            } else {
              chapterTitle = chapterMap[chapterId]?.title || chapterId;
            }

            if (chapterProgress) {
              dailyProgress[date].chapters.push({
                id: chapterId,
                title: chapterTitle,
                timeSpent: chapterProgress.timeSpent,
                parentChapter: parentChapter
              });
            }
          });

          // Сортируем главы по порядку в книге
          dailyProgress[date].chapters.sort((a, b) => {
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

        // Обработка тестов
        if (dayProgress.exercises.testResults && dayProgress.exercises.testResults.length > 0) {
          dayProgress.exercises.testResults.forEach(test => {
            // if (test.completedAt) {
              if (!dailyProgress[date]) {
                dailyProgress[date] = {
                  date,
                  chapters: [],
                  exercises: {
                    testResults: []
                  }
              }

              dailyProgress[date].exercises.testResults = dailyProgress[date].exercises.testResults || [];
              dailyProgress[date].exercises.testResults.push({
                id,
                name,
                completed,
                score,
                maxScore,
                completedAt,
              });
            // }
          });
        }
      });
    }
    return dailyProgress;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    setCurrentMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const formatMonthTitle = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
  };

  if (!progress) {
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

          return (
            <div
              key={date}
              className={`${styles.day} ${dayProgress ? styles.hasContent : ''}`}
              onClick={() => dayProgress && setSelectedDate(date)}
            >
              <div className={styles.dayHeader}>
                <h3>{new Date(date).getDate()}</h3>
                {dayProgress && (
                  <span>{formatTime(dayProgress.chapters.reduce((total, chapter) => total + chapter.timeSpent, 0))}</span>
                )}
              </div>

              {dayProgress && (
                <div className={styles.dayContent}>
                  {dayProgress.chapters.length > 0 && (
                    <div className={styles.indicator}>
                      <span>Глав: {dayProgress.chapters.length}</span>
                    </div>
                  )}
                  {(dayProgress.tests?.length ?? 0) > 0 && (
                    <div className={styles.indicator}>
                      <span>Тестов: {dayProgress.exercises.testResults.length}</span>
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
