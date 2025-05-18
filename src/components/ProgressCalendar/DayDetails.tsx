import React, { useState, useEffect } from 'react';
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
import RenderTests from './RenderTests';
import { DysfunctionalAttitudeScaleExercise } from '../Activities/DysfunctionalAttitudeScale/types';

interface DayDetailsProps {
  date: string;
  dayProgress: CalendarDayProgress;
  chapterMap: ChapterMap;
  onClose: () => void;
}

// Интерфейс для объекта результата теста
interface TestResult {
  id: string;
  name?: string;
  type?: string;
  score?: number;
  maxScore?: number;
  completedAt: string;
  content?: string;
  categoryResults?: Array<{category: string, score: number, isStrength: boolean}>;
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
  const [expandedTests, setExpandedTests] = useState<string[]>([]);
  const [allTestResults, setAllTestResults] = useState<TestResult[]>([]);

  // Обрабатываем все типы тестов, включая шкалу дисфункциональных убеждений
  useEffect(() => {
    const testResults = [...(dayProgress.exercises.testResults || [])].map(result => ({
      ...result,
      type: result.content
    })) as TestResult[];
    
    // Добавляем упражнения шкалы дисфункциональных убеждений к тестам
    if (dayProgress.exercises.exercises) {
      const dasExercises = dayProgress.exercises.exercises.filter(
        ex => ex.type === ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE
      );
      
      // Преобразуем упражнения в формат тестов
      const dasTestResults = dasExercises.map(exercise => {
        const dasExercise = exercise as DysfunctionalAttitudeScaleExercise;
        return {
          id: dasExercise.id,
          name: 'Шкала дисфункциональных убеждений',
          type: ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE,
          completedAt: dasExercise.completedAt || new Date().toISOString(),
          categoryResults: dasExercise.categoryResults
        } as TestResult;
      });
      
      setAllTestResults([...testResults, ...dasTestResults]);
    } else {
      setAllTestResults(testResults);
    }
  }, [dayProgress]);

  const toggleTest = (testId: string) => {
    setExpandedTests(prev => 
      prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
    );
  };

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
  
  // Фильтруем упражнения, исключая шкалу дисфункциональных убеждений
  const filteredExercises = {
    ...dayProgress.exercises,
    exercises: dayProgress.exercises.exercises?.filter(
      ex => ex.type !== ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE
    )
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
            {allTestResults.length > 0 && (
              <div className={styles.stat}>
                <span>✍️</span>
                <strong>{allTestResults.length}</strong>
              </div>
            )}
            {filteredExercises.exercises && filteredExercises.exercises.length > 0 && (
              <div className={styles.stat}>
                <span>🎯</span>
                <strong>{filteredExercises.exercises.length}</strong>
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
            {activeTab === 'tests' && (
              <RenderTests 
                testResults={allTestResults} 
                expandedTests={expandedTests}
                toggleTest={toggleTest}
              />
            )}
            {activeTab === 'exercises' && <RenderExercises exercises={filteredExercises} onClose={onClose} />}
          </div>
        </div>
      </div>
    </div>
  );
}; 
