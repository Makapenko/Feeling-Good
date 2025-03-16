import React, { useEffect } from 'react';
import styles from './ProgressCalendar.module.css';
import { ChapterMap, CalendarDayProgress } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface DayDetailsProps {
  date: string;
  dayProgress: CalendarDayProgress;
  chapterMap: ChapterMap;
  onClose: () => void;
}

export const DayDetails: React.FC<DayDetailsProps> = ({
  date,
  dayProgress,
  onClose
}) => {
  useEffect(() => {
    // Блокируем скролл на body при открытии модального окна
    document.body.style.overflow = 'hidden';
    return () => {
      // Возвращаем скролл при закрытии
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className={styles.detailsOverlay} onClick={handleOverlayClick}>
        <div className={styles.details}>
          <div className={styles.detailsHeader}>
            <h3>{formatDate(date)}</h3>
            <button className={styles.closeButton} onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {dayProgress.chapters && dayProgress.chapters.length > 0 && (
            <div className={styles.detailsSection}>
              <h4>Прочитано</h4>
              {dayProgress.chapters.map((chapter, index) => (
                <div key={index} className={styles.chapterGroup}>
                  {chapter.parentChapter ? (
                    <>
                      <div className={styles.parentChapter}>
                        {chapter.parentChapter.title}
                      </div>
                      <div className={styles.subChapter}>
                        <span>{chapter.title}</span>
                        <span>{formatTime(chapter.timeSpent)}</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.chapter}>
                      <span>{chapter.title}</span>
                      <span>{formatTime(chapter.timeSpent)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {dayProgress.exercises.testResults && dayProgress.exercises.testResults.length > 0 && (
            <div className={styles.detailsSection}>
              <h4>Тесты</h4>
              {dayProgress.exercises.testResults.map((test, index) => (
                <div key={index} className={styles.test}>
                  <span>{test.name}</span>
                  <span>{test.score}/{test.maxScore}</span>
                </div>
              ))}
            </div>
          )}

          {dayProgress.exercises.exercises && dayProgress.exercises.exercises.length > 0 && (
            <div className={styles.detailsSection}>
              <h4>Упражнения</h4>
              {dayProgress.exercises.exercises.map((exercise, index) => (
                <div key={index} className={styles.exercise}>
                  {exercise.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 
