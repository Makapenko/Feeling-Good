import React, { useState, useMemo } from 'react';
import styles from './DayDetails.module.css';
import { CalendarDayProgress } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

import { getStoredActivityTime } from '../../utils/activityTimerStorage';
import { formatDateWithOptions, formatTimeFromSeconds, getCurrentISOTimestamp } from '../../utils/dateUtils';
import { useAppDispatch } from '../../redux/hooks';
import { loadChapter } from '../../redux/actions';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../constants/activities';
import RenderExercises from './RenderExercises';
import RenderTests from './RenderTests';
import { DysfunctionalAttitudeScaleExercise } from '../Activities/DysfunctionalAttitudeScale/types';
import { IntimacyScaleExercise } from '../Activities/IntimacyScale/types';
import { getChapterTitle, getBookInfo } from '../../utils/chapterUtils';

interface DayDetailsProps {
  date: string;
  dayProgress: CalendarDayProgress;
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
  categoryResults?: Array<{ category: string; score: number; isStrength?: boolean; maxScore?: number }>;
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

export const DayDetails: React.FC<DayDetailsProps> = ({ date, dayProgress, onClose }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chapters');
  const [expandedTests, setExpandedTests] = useState<string[]>([]);

  const allTestResults = useMemo<TestResult[]>(() => {
    const testResults = [...(dayProgress.exercises.testResults || [])].map(result => ({
      ...result,
      type: result.content
    })) as TestResult[];

    if (!dayProgress.exercises.exercises) return testResults;

    const dasTestResults = dayProgress.exercises.exercises
      .filter(ex => ex.type === ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE)
      .map(exercise => {
        const dasExercise = exercise as DysfunctionalAttitudeScaleExercise;
        return {
          id: dasExercise.id,
          name: ACTIVITY_NAMES[ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE],
          type: ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE,
          completedAt: dasExercise.completedAt || getCurrentISOTimestamp(),
          categoryResults: dasExercise.categoryResults,
        } as TestResult;
      });

    const intimacyTestResults = dayProgress.exercises.exercises
      .filter(ex => ex.type === ACTIVITY_IDS.INTIMACY_SCALE)
      .map(exercise => {
        const intimacyExercise = exercise as IntimacyScaleExercise;
        return {
          id: intimacyExercise.id,
          name: ACTIVITY_NAMES[ACTIVITY_IDS.INTIMACY_SCALE],
          type: ACTIVITY_IDS.INTIMACY_SCALE,
          score: intimacyExercise.totalScore,
          maxScore: 180,
          completedAt: intimacyExercise.completedAt || getCurrentISOTimestamp(),
          categoryResults: intimacyExercise.categoryResults,
        } as TestResult;
      });

    return [...testResults, ...dasTestResults, ...intimacyTestResults];
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

  const groupChaptersByBook = (chapters: NonNullable<typeof dayProgress.chapters>) => {
    const books: { [bookIndex: number]: { name: string; chapters: typeof chapters } } = {};

    chapters.forEach(chapter => {
      const bookInfo = getBookInfo(chapter.parentChapter?.id || chapter.id);
      const bookIndex = bookInfo?.index ?? 0;
      if (!books[bookIndex]) {
        books[bookIndex] = { name: bookInfo?.name || `Книга ${bookIndex + 1}`, chapters: [] };
      }
      books[bookIndex].chapters.push(chapter);
    });

    return Object.entries(books).sort(([a], [b]) => Number(a) - Number(b));
  };

  const renderBookChapters = (chapters: NonNullable<typeof dayProgress.chapters>) => {
    const { grouped, standalone } = groupChaptersByParent(chapters);
    return (
      <>
        {standalone.map(chapter => (
          <div key={chapter.id} className={styles.chapterGroup}>
            <div className={styles.parentChapter}>
              <div className={styles.chapterInfo}>
                {chapter.title}
              </div>
            </div>
            <div className={styles.subChapter}>
              <div className={styles.chapterInfo}>
                <span>{formatTimeFromSeconds(chapter.timeSpent)}</span>
              </div>
              <div className={styles.chapterActions}>
                <ChapterButton chapterId={chapter.id} onClose={onClose} />
              </div>
            </div>
          </div>
        ))}
        {Object.entries(grouped).map(([parentId, subChapters]) => (
          <div key={parentId} className={styles.chapterGroup}>
            <div className={styles.parentChapter}>
              <div className={styles.chapterInfo}>
                {getChapterTitle(parentId)}
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

  const renderChaptersContent = () => {
    if (!dayProgress.chapters || dayProgress.chapters.length === 0) {
      return <div className={styles.emptyState}>Нет прочитанных глав за этот день</div>;
    }

    const bookEntries = groupChaptersByBook(dayProgress.chapters);

    // Если главы только из одной книги — без заголовка
    if (bookEntries.length === 1) {
      return renderBookChapters(bookEntries[0][1].chapters);
    }

    return (
      <>
        {bookEntries.map(([bookIndex, book]) => (
          <div key={bookIndex}>
            <h4 className={styles.bookTitle}>{book.name}</h4>
            {renderBookChapters(book.chapters)}
          </div>
        ))}
      </>
    );
  };
  
  // Фильтруем упражнения, исключая те, что показываются во вкладке Тесты
  const filteredExercises = {
    ...dayProgress.exercises,
    exercises: dayProgress.exercises.exercises?.filter(
      ex => ex.type !== ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE &&
            ex.type !== ACTIVITY_IDS.INTIMACY_SCALE
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
