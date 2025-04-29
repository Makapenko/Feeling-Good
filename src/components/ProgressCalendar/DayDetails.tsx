import React, { useState } from 'react';
import styles from './DayDetails.module.css';
import { ChapterMap } from './types';
import { CalendarDayProgress } from './types';
import { Exercise } from '../../types/progress.types';
import { ThreeColumnsExercise } from '../Activities/ThreeColumnsBase/types';
import { ThoughtDiaryExercise } from '../Activities/ThoughtDiaryBase/types';
import { DailyScheduleExercise } from '../Activities/DailySchedule/types';
import { AntiProcrastinationExercise } from '../Activities/AntiProcrastinationSheet/types';
import { PleasureSheetExercise } from '../Activities/PleasureSheet/types';
import { NoButsExercise } from '../Activities/NoButsSheet/types';

import { getStoredActivityTime } from '../../utils/activityTimerStorage';
import { formatDateWithOptions, formatTimeFromSeconds } from '../../utils/dateUtils';
import { useAppDispatch } from '../../redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import ThreeColumnsExerciseComponent from './render/ThreeColumnsExerciseComponent';
import ThoughtDiaryExerciseComponent from './render/ThoughtDiaryExerciseComponent';
import DailyScheduleExerciseComponent from './render/DailyScheduleExerciseComponent';
import AntiProcrastinationExerciseComponent from './render/AntiProcrastinationExerciseComponent';
import SmallStepsExerciseComponent from './render/SmallStepsExerciseComponent';
import SelfSupportExerciseComponent from './render/SelfSupportExerciseComponent';
import NoButsExerciseComponent from './render/NoButsExerciseComponent';
import MotivationWithoutCoercionExerciseComponent from './render/MotivationWithoutCoercionExerciseComponent';
import ImagineSuccessExerciseComponent from './render/ImagineSuccessExerciseComponent';
import NoLoseTechniqueExerciseComponent from './render/NoLoseTechniqueExerciseComponent';
import PleasureSheetExerciseComponent from './render/PleasureSheetExerciseComponent';
import CheckCantDoExerciseComponent from './render/CheckCantDoExerciseComponent';
import CountAchievementsExerciseComponent from './render/CountAchievementsExerciseComponent'
import DownwardArrowExerciseComponent from './render/DownwardArrowExerciseComponent';
import DysfunctionalAttitudeScaleExerciseComponent from './render/DysfunctionalAttitudeScale/DysfunctionalAttitudeScaleExerciseComponent';
import { ACTIVITY_IDS } from '../../constants/activities';
import { loadChapter } from '../../redux/actions/chapterActions';
import { SelfSupportExercise } from '../Activities/SelfSupport/types';
import { MotivationWithoutCoercionExercise } from '../Activities/MotivationWithoutCoercion/types';
import { SmallStepsExercise } from '../Activities/SmallSteps/types';
import { CountAchievementsExercise } from '../Activities/CountAchievements/types';
import { ImagineSuccessExercise } from '../Activities/ImagineSuccess/types';
import { DownwardArrowExercise } from '../Activities/DownwardArrow/types';
import { CheckCantDoExercise } from '../Activities/CheckCantDo/types';
import { NoLoseTechniqueExercise } from '../Activities/NoLoseTechnique/types';
import { DysfunctionalAttitudeScaleExercise } from '../Activities/DysfunctionalAttitudeScale/types';
import ProcrastinationScaleExerciseComponent from './render/ProcrastinationScale/ProcrastinationScaleExerciseComponent';
import { ProcrastinationScaleExercise } from './render/ProcrastinationScale/ProcrastinationScaleExerciseComponent';

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
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chapters');

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
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

  const renderExercises = (exercises: Exercise[]) => {
    return exercises.map((exercise) => {
      switch (exercise.type) {
        case ACTIVITY_IDS.THREE_COLUMNS_METHOD:
          return <ThreeColumnsExerciseComponent
            key={exercise.id}
            exercise={exercise as ThreeColumnsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.THOUGHT_DIARY:
          return <ThoughtDiaryExerciseComponent
            key={exercise.id}
            exercise={exercise as ThoughtDiaryExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.PROCRASTINATION_DIARY:
          return <ThoughtDiaryExerciseComponent
            key={exercise.id}
            exercise={exercise as ThoughtDiaryExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
            customTitle="Дневник прокрастинации"
            showCognitiveDistortions={false}
            showEmotionIntensity={false}
            showResultIntensity={false}
          />;
        case ACTIVITY_IDS.DAILY_SCHEDULE:
          return <DailyScheduleExerciseComponent
            key={exercise.id}
            exercise={exercise as DailyScheduleExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.ANTI_PROCRASTINATION:
          return <AntiProcrastinationExerciseComponent
            key={exercise.id}
            exercise={exercise as AntiProcrastinationExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.PLEASURE_SHEET:
          return <PleasureSheetExerciseComponent
            key={exercise.id}
            exercise={exercise as PleasureSheetExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.NO_BUTS:
          return <NoButsExerciseComponent
            key={exercise.id}
            exercise={exercise as NoButsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.SELF_SUPPORT:
          return <SelfSupportExerciseComponent
            key={exercise.id}
            exercise={exercise as SelfSupportExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.SMALL_STEPS:
          return <SmallStepsExerciseComponent
            key={exercise.id}
            exercise={exercise as SmallStepsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION:
          return <MotivationWithoutCoercionExerciseComponent
            key={exercise.id}
            exercise={exercise as MotivationWithoutCoercionExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.IMAGINE_SUCCESS:
          return <ImagineSuccessExerciseComponent
            key={exercise.id}
            exercise={exercise as ImagineSuccessExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.COUNT_ACHIEVEMENTS:
          return <CountAchievementsExerciseComponent
            key={exercise.id}
            exercise={exercise as CountAchievementsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.CHECK_CANT_DO:
          return <CheckCantDoExerciseComponent
            key={exercise.id}
            exercise={exercise as CheckCantDoExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.NO_LOSE_TECHNIQUE:
          return <NoLoseTechniqueExerciseComponent
            key={exercise.id}
            exercise={exercise as NoLoseTechniqueExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.DOWNWARD_ARROW:
          return <DownwardArrowExerciseComponent
            key={exercise.id}
            exercise={exercise as DownwardArrowExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE:
          return <DysfunctionalAttitudeScaleExerciseComponent
            key={exercise.id}
            exercise={exercise as DysfunctionalAttitudeScaleExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case ACTIVITY_IDS.PROCRASTINATION_SCALE:
          return <ProcrastinationScaleExerciseComponent
            key={exercise.id}
            exercise={exercise as ProcrastinationScaleExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        default:
          return null;
      }
    });
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

  const renderExercisesContent = () => {
    if (!dayProgress.exercises.exercises || dayProgress.exercises.exercises.length === 0) {
      return <div className={styles.emptyState}>Нет выполненных упражнений за этот день</div>;
    }

    return renderExercises(dayProgress.exercises.exercises);
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
            {activeTab === 'exercises' && renderExercisesContent()}
          </div>
        </div>
      </div>
    </div>
  );
}; 
