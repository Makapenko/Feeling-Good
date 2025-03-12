import React from 'react';
import styles from './DayDetails.module.css';
import { ChapterMap } from './types';

interface DayDetailsProps {
  date: string;
  dayProgress: {
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
      id: string;
      name: string;
      result: number;
      score: number;
      maxScore?: number;
      title: string;
    }[];
  };
  chapterMap: ChapterMap;
  onClose: () => void;
}

const DayDetails: React.FC<DayDetailsProps> = ({ date, dayProgress, chapterMap, onClose }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const groupChaptersByParent = (chapters: typeof dayProgress.chapters) => {
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{new Date(date).toLocaleDateString('ru-RU', { 
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.summary}>
            <div className={styles.stat}>
              <span>Время чтения</span>
              <strong>{formatTime(dayProgress.chapters.reduce((total, chapter) => total + chapter.timeSpent, 0))}</strong>
            </div>
            {(dayProgress.tests?.length ?? 0) > 0 && (
              <div className={styles.stat}>
                <span>Пройдено тестов</span>
                <strong>{dayProgress.tests?.length}</strong>
              </div>
            )}
          </div>

          {dayProgress.chapters.length > 0 && (
            <div className={styles.section}>
              <h3>Прочитанные главы</h3>
              {(() => {
                const { grouped, standalone } = groupChaptersByParent(dayProgress.chapters);
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
            </div>
          )}

          {(dayProgress.tests?.length ?? 0) > 0 && (
            <div className={styles.section}>
              <h3>Тесты</h3>
              {(() => {
                console.log('Отображение тестов:', dayProgress.tests);
                return dayProgress.tests?.map(test => {
                  console.log('Тест для отображения:', test);
                  return (
                    <div key={test.id} className={styles.test}>
                      <span>{test.title}</span>
                      <span>Результат: {test.result} {test.maxScore ? `из ${test.maxScore}` : ''}</span>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayDetails; 
