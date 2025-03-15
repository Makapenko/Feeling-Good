import React, { useState } from 'react';
import styles from './DayDetails.module.css';
import { ChapterMap } from './types';
import { CalendarDayProgress } from './types';
import { Exercise, ThreeColumnsExercise, DailyScheduleExercise, AntiProcrastinationExercise, PleasureSheetExercise, NoButsExercise, SelfSupportExercise, SmallStepsExercise, MotivationWithoutCoercionExercise, ImagineSuccessExercise, CountAchievementsExercise, CheckCantDoExercise, NoLoseTechniqueExercise, ThoughtDiaryExercise } from '../../types/progress.types';
import { getStoredActivityTime } from '../../utils/activityTimerStorage';
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
interface DayDetailsProps {
  date: string;
  dayProgress: CalendarDayProgress;
  chapterMap: ChapterMap;
  onClose: () => void;
}

export const DayDetails: React.FC<DayDetailsProps> = ({ date, dayProgress, chapterMap, onClose }) => {
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['chapters', 'tests', 'exercises']);

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        case 'three-columns-method':
          return <ThreeColumnsExerciseComponent
            key={exercise.id}
            exercise={exercise as ThreeColumnsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'thought-diary':
          return <ThoughtDiaryExerciseComponent
            key={exercise.id}
            exercise={exercise as ThoughtDiaryExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'daily-schedule':
          return <DailyScheduleExerciseComponent
            key={exercise.id}
            exercise={exercise as DailyScheduleExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'anti-procrastination':
          return <AntiProcrastinationExerciseComponent
            key={exercise.id}
            exercise={exercise as AntiProcrastinationExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'pleasure-sheet':
          return <PleasureSheetExerciseComponent
            key={exercise.id}
            exercise={exercise as PleasureSheetExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'no-buts':
          return <NoButsExerciseComponent
            key={exercise.id}
            exercise={exercise as NoButsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'self-support':
          return <SelfSupportExerciseComponent
            key={exercise.id}
            exercise={exercise as SelfSupportExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'small-steps':
          return <SmallStepsExerciseComponent
            key={exercise.id}
            exercise={exercise as SmallStepsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'motivation-without-coercion':
          return <MotivationWithoutCoercionExerciseComponent
            key={exercise.id}
            exercise={exercise as MotivationWithoutCoercionExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'imagine-success':
          return <ImagineSuccessExerciseComponent
            key={exercise.id}
            exercise={exercise as ImagineSuccessExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'count-achievements':
          return <CountAchievementsExerciseComponent
          key={exercise.id}
          exercise={exercise as CountAchievementsExercise}
          expandedExercises={expandedExercises}
          toggleExercise={toggleExercise}
        />;
        case 'check-cant-do':
          return <CheckCantDoExerciseComponent
            key={exercise.id}
            exercise={exercise as CheckCantDoExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case 'no-lose-technique':
          return <NoLoseTechniqueExerciseComponent
            key={exercise.id}
            exercise={exercise as NoLoseTechniqueExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        default:
          return null;
      }
    });
  };

  const renderSectionWrapper = (sectionId: string, title: string, content: React.ReactNode) => {
    const isExpanded = expandedSections.includes(sectionId);
    return (
      <div className={styles.section}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection(sectionId)}
        >
          <h3>{title}</h3>
          <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▼</span>
        </div>
        <div className={`${styles.sectionContent} ${isExpanded ? styles.expanded : ''}`}>
          {content}
        </div>
      </div>
    );
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
              <strong>{dayProgress.chapters && formatTime(dayProgress.chapters.reduce((total, chapter) => total + chapter.timeSpent, 0))}</strong>
            </div>
            <div className={styles.stat}>
              <span>Время работы с самооценкой</span>
              <strong>{formatTime(getStoredActivityTime('three-columns-method') + getStoredActivityTime('thought-diary'))}</strong>
            </div>
            {dayProgress.exercises.testResults && dayProgress.exercises.testResults.length > 0 && (
              <div className={styles.stat}>
                <span>Пройдено тестов</span>
                <strong>{dayProgress.exercises.testResults.length}</strong>
              </div>
            )}
            {dayProgress.exercises.exercises && dayProgress.exercises.exercises.length > 0 && (
              <div className={styles.stat}>
                <span>Выполнено упражнений</span>
                <strong>{dayProgress.exercises.exercises.length}</strong>
              </div>
            )}
          </div>

          {dayProgress.chapters && dayProgress.chapters.length > 0 && (
            renderSectionWrapper(
              'chapters',
              'Прочитанные главы',
              (() => {
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
              })()
            )
          )}

          {dayProgress.exercises.testResults && dayProgress.exercises.testResults.length > 0 && (
            renderSectionWrapper(
              'tests',
              'Тесты',
              dayProgress.exercises.testResults.map(test => (
                <div key={test.id} className={styles.test}>
                  <span>{test.name}</span>
                  <span>
                    {test.score !== undefined && `Результат: ${test.score}`}
                    {test.maxScore !== undefined && ` из ${test.maxScore}`}
                  </span>
                </div>
              ))
            )
          )}

          {dayProgress.exercises.exercises && dayProgress.exercises.exercises.length > 0 && (
            renderSectionWrapper(
              'exercises',
              'Упражнения',
              renderExercises(dayProgress.exercises.exercises)
            )
          )}
        </div>
      </div>
    </div>
  );
}; 
