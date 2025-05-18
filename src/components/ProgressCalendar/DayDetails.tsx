import React, { useState } from 'react';
import styles from './DayDetails.module.css';
import { ChapterMap } from './types';
import { CalendarDayProgress } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

import { getStoredActivityTime } from '../../utils/activityTimerStorage';
import { formatDateWithOptions, formatTimeFromSeconds } from '../../utils/dateUtils';
import { useAppDispatch } from '../../redux/hooks';
import { loadChapter } from '../../redux/actions/chapterActions';
import { ACTIVITY_IDS } from '../../constants/activities';
import RenderExercises from './RenderExercises';

interface DayDetailsProps {
  date: string;
  dayProgress: CalendarDayProgress;
  chapterMap: ChapterMap;
  onClose: () => void;
}

type ActiveTab = 'chapters' | 'tests' | 'exercises';

/**
 * Кнопка для перехода к главе
 */
const ChapterButton: React.FC<{ chapterId: string, onClose: () => void }> = ({ chapterId, onClose }) => {
  const dispatch = useAppDispatch();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    dispatch(loadChapter(chapterId));
    onClose(); // Закрываем модальное окно после перехода
  };
  
  return (
    <button
      className={styles.chapterButton}
      onClick={handleClick}
      aria-label="Открыть главу"
      title="Перейти к чтению главы"
    >
      <FontAwesomeIcon icon={faBook} />
    </button>
  );
};

export const DayDetails: React.FC<DayDetailsProps> = ({ date, dayProgress, chapterMap, onClose }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chapters');

  const groupChaptersByParent = (chapters: NonNullable<typeof dayProgress.chapters>) => {
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

  const renderChaptersContent = () => {
    if (!dayProgress.chapters || dayProgress.chapters.length === 0) {
      return <div className={styles.emptyState}>Нет прочитанных глав за этот день</div>;
    }

    const { grouped, standalone } = groupChaptersByParent(dayProgress.chapters);
    return (
      <>
        {standalone.map(chapter => (
          <div key={chapter.id} className={styles.chapter}>
            <div className={styles.chapterInfo}>
              <span>{chapter.title}</span>
              <span>{formatTimeFromSeconds(chapter.timeSpent)}</span>
            </div>
            <div className={styles.chapterActions}>
              <ChapterButton chapterId={chapter.id} onClose={onClose} />
            </div>
          </div>
        ))}
        {Object.entries(grouped).map(([parentId, subChapters]) => (
          <div key={parentId} className={styles.chapterGroup}>
            <div className={styles.parentChapter}>
              <div className={styles.chapterInfo}>
                {chapterMap[parentId]?.title}
              </div>
            </div>
            {subChapters.map(chapter => (
              <div key={chapter.id} className={styles.subChapter}>
                <div className={styles.chapterInfo}>
                  <span>{chapter.title}</span>
                  <span>{formatTimeFromSeconds(chapter.timeSpent)}</span>
                </div>
                <div className={styles.chapterActions}>
                  <ChapterButton chapterId={chapter.id} onClose={onClose} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  const renderTestsContent = () => {
    if (!dayProgress.exercises.testResults || dayProgress.exercises.testResults.length === 0) {
      return <div className={styles.emptyState}>Нет пройденных тестов за этот день</div>;
    }

    return dayProgress.exercises.testResults.map(test => (
      <div key={test.id} className={styles.test}>
        <span>{test.name}</span>
        <span>
          {test.score !== undefined && `Результат: ${test.score}`}
          {test.maxScore !== undefined && ` из ${test.maxScore}`}
        </span>
      </div>
    ));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{formatDateWithOptions(date, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.summary}>
            <div className={styles.stat}>
              <span>📖</span>
              <strong>{dayProgress.chapters && formatTimeFromSeconds(dayProgress.chapters.reduce((total, chapter) => total + chapter.timeSpent, 0))}</strong>
            </div>
            <div className={styles.stat}>
              <span>😎</span>
              <strong>{formatTimeFromSeconds(
                getStoredActivityTime(ACTIVITY_IDS.THREE_COLUMNS_METHOD) +
                getStoredActivityTime(ACTIVITY_IDS.THOUGHT_DIARY)
              )}</strong>
            </div>
            {dayProgress.exercises.testResults && dayProgress.exercises.testResults.length > 0 && (
              <div className={styles.stat}>
                <span>✍️</span>
                <strong>{dayProgress.exercises.testResults.length}</strong>
              </div>
            )}
            {dayProgress.exercises.exercises && dayProgress.exercises.exercises.length > 0 && (
              <div className={styles.stat}>
                <span>🎯</span>
                <strong>{dayProgress.exercises.exercises.length}</strong>
              </div>
            )}
          </div>

          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tabButton} ${activeTab === 'chapters' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('chapters')}
            >
              Главы
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'tests' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              Тесты
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'exercises' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('exercises')}
            >
              Упражнения
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'chapters' && renderChaptersContent()}
            {activeTab === 'tests' && renderTestsContent()}
            {activeTab === 'exercises' && <RenderExercises exercises={dayProgress.exercises} onClose={onClose} />}
          </div>
        </div>
      </div>
    </div>
  );
}; 
