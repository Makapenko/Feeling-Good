import { useState } from 'react';
import { useProgress } from '../../store/ProgressContext';
import styles from './ProgressCalendar.module.css';
import chaptersData from '../ListOfChapters/chapters.json';

interface CalendarDayProgress {
  date: string;
  chapters: {
    id: string;
    title: string;
    timeSpent: number;
    parentChapter?: {
      id: string;
      title: string;
      order: number;
    };
  }[];
  tests?: {
    type: string;
    result: number;
    title: string;
  }[];
}

interface ChapterMap {
  [key: string]: {
    id: string;
    title: string;
    order: number;
    sections: { id: string; title: string }[];
  };
}

const ProgressCalendar: React.FC = () => {
  const { progress } = useProgress();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
  const getDailyProgress = (): CalendarDayProgress[] => {
    const dailyProgress: { [key: string]: CalendarDayProgress } = {};

    // Обрабатываем прогресс чтения
    if (progress?.dailyProgress) {
      Object.entries(progress.dailyProgress).forEach(([date, dayProgress]) => {
        if (dayProgress.chapters && Object.keys(dayProgress.chapters).length > 0) {
          dailyProgress[date] = {
            date,
            chapters: []
          };

          Object.entries(dayProgress.chapters).forEach(([chapterId, chapterProgress]) => {
            // Находим информацию о главе или подглаве
            let chapterTitle = '';
            const parentChapter = findParentChapter(chapterId);
            
            if (parentChapter) {
              // Это подглава
              const section = chapterMap[parentChapter.id].sections.find(s => s.id === chapterId);
              chapterTitle = section?.title || chapterId;
            } else {
              // Это основная глава
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
            
            // Если это подглавы одной главы, сортируем по их порядку в sections
            if (a.parentChapter && b.parentChapter && a.parentChapter.id === b.parentChapter.id) {
              const sections = chapterMap[a.parentChapter.id].sections;
              const aIndex = sections.findIndex(s => s.id === a.id);
              const bIndex = sections.findIndex(s => s.id === b.id);
              return aIndex - bIndex;
            }
            return 0;
          });
        }
      });
    }

    // Обработка тестов остается без изменений
    if (progress?.testResults && progress.testResults.length > 0) {
      progress.testResults.forEach(test => {
        if (test.completedAt) {
          const testDate = test.completedAt.split('T')[0];
          if (!dailyProgress[testDate]) {
            dailyProgress[testDate] = {
              date: testDate,
              chapters: [],
              tests: []
            };
          }
          
          dailyProgress[testDate].tests = dailyProgress[testDate].tests || [];
          dailyProgress[testDate].tests.push({
            type: test.id,
            result: test.score || 0,
            title: test.name
          });
        }
      });
    }

    return Object.values(dailyProgress).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const dailyProgress = getDailyProgress();

  if (dailyProgress.length === 0) {
    return (
      <div className={styles.calendar}>
        <h2>Календарь прогресса</h2>
        <p className={styles.emptyMessage}>Пока нет данных о прогрессе</p>
      </div>
    );
  }

  // Группируем главы по родительским главам для отображения
  const groupChaptersByParent = (chapters: CalendarDayProgress['chapters']) => {
    const grouped: { [key: string]: typeof chapters } = {};
    const standalone: typeof chapters = [];

    chapters.forEach(chapter => {
      if (chapter.parentChapter) {
        const parentId = chapter.parentChapter.id;
        if (!grouped[parentId]) {
          grouped[parentId] = [];
        }
        grouped[parentId].push(chapter);
      } else {
        standalone.push(chapter);
      }
    });

    return { grouped, standalone };
  };

  return (
    <div className={styles.calendar}>
      <h2>Календарь прогресса</h2>
      <div className={styles.days}>
        {dailyProgress.map(day => (
          <div 
            key={day.date}
            className={`${styles.day} ${selectedDate === day.date ? styles.selected : ''}`}
            onClick={() => setSelectedDate(day.date === selectedDate ? null : day.date)}
          >
            <h3>{new Date(day.date).toLocaleDateString('ru-RU')}</h3>
            <div className={styles.dayContent}>
              {day.chapters.length > 0 && (
                <h4>Время чтения: {formatTime(day.chapters.reduce((total, chapter) => total + chapter.timeSpent, 0))}</h4>
              )}
              {(day.tests?.length ?? 0) > 0 && (
                <h4>Пройдено тестов: {day.tests?.length}</h4>
              )}
              {selectedDate === day.date && (
                <div className={styles.details}>
                  {day.chapters.length > 0 && (
                    <>
                      <h5>Главы:</h5>
                      {(() => {
                        const { grouped, standalone } = groupChaptersByParent(day.chapters);
                        return (
                          <>
                            {standalone.map(chapter => (
                              <div key={chapter.id} className={styles.chapter}>
                                <span>{chapter.title}</span>
                                <span>{formatTime(chapter.timeSpent)}</span>
                              </div>
                            ))}
                            {Object.entries(grouped).map(([parentId, subChapters]) => (
                              <div key={parentId} className={styles.chapterGroup}>
                                <div className={styles.parentChapter}>
                                  {chapterMap[parentId]?.title}
                                </div>
                                {subChapters.map(chapter => (
                                  <div key={chapter.id} className={styles.subChapter}>
                                    <span>{chapter.title}</span>
                                    <span>{formatTime(chapter.timeSpent)}</span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </>
                        );
                      })()}
                    </>
                  )}
                  {(day.tests?.length ?? 0) > 0 && (
                    <>
                      <h5>Тесты:</h5>
                      {day.tests?.map(test => (
                        <div key={test.type} className={styles.test}>
                          <span>{test.title}</span>
                          <span>Результат: {test.result}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCalendar; 
