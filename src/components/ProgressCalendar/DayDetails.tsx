import React from 'react';
import styles from './DayDetails.module.css';
import { ChapterMap } from './types';
import { CalendarDayProgress } from './types';
import { Exercise, ThreeColumnsExercise, ThoughtDiaryExercise, DailyScheduleExercise } from '../../types/progress.types';

interface DayDetailsProps {
  date: string;
  dayProgress: CalendarDayProgress;
  chapterMap: ChapterMap;
  onClose: () => void;
}

const DayDetails: React.FC<DayDetailsProps> = ({ date, dayProgress, chapterMap, onClose }) => {
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

  const renderThreeColumnsExercise = (exercise: ThreeColumnsExercise) => {
    return (
      <div key={exercise.id} className={styles.exerciseSection}>
        <h4>{exercise.name}</h4>
        <div className={styles.recordsList}>
          {exercise.records.map((record, index) => (
            <div key={index} className={styles.record}>
              <div className={styles.recordTime}>
                {new Date(record.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className={styles.recordContent}>
                <div className={styles.column}>
                  <strong>Автоматическая мысль:</strong>
                  <p>{record.leftColumn}</p>
                </div>
                {record.cognitiveDistortion.length > 0 && (
                  <div className={styles.column}>
                    <strong>Когнитивные искажения:</strong>
                    <p>{record.cognitiveDistortion.join(', ')}</p>
                  </div>
                )}
                <div className={styles.column}>
                  <strong>Рациональный ответ:</strong>
                  <p>{record.rightColumn}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderThoughtDiaryExercise = (exercise: ThoughtDiaryExercise) => {
    return (
      <div key={exercise.id} className={styles.exerciseSection}>
        <h4>{exercise.name}</h4>
        <div className={styles.recordsList}>
          {exercise.records.map((record, index) => (
            <div key={index} className={styles.record}>
              <div className={styles.recordTime}>
                {new Date(record.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className={styles.recordContent}>
                <div className={styles.column}>
                  <strong>Ситуация:</strong>
                  <p>{record.situation}</p>
                </div>
                <div className={styles.column}>
                  <strong>Эмоции:</strong>
                  <ul>
                    {record.emotions.map((emotion, i) => (
                      <li key={i}>{emotion.name} - {emotion.intensity}%</li>
                    ))}
                  </ul>
                </div>
                {record.automaticThoughts.map((thought, i) => (
                  <div key={i} className={styles.thought}>
                    <p><strong>Автоматическая мысль:</strong> {thought.thought}</p>
                    <p><strong>Когнитивные искажения:</strong> {thought.cognitiveDistortions.join(', ')}</p>
                    <p><strong>Рациональный ответ:</strong> {thought.rationalResponse}</p>
                  </div>
                ))}
                {record.result.emotions.length > 0 && (
                  <div className={styles.column}>
                    <strong>Результат:</strong>
                    <ul>
                      {record.result.emotions.map((emotion, i) => (
                        <li key={i}>{emotion.name} - {emotion.intensity}%</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDailyScheduleExercise = (exercise: DailyScheduleExercise) => {
    return (
      <div key={exercise.id} className={styles.exerciseSection}>
        <h4>{exercise.name}</h4>
        <div className={styles.scheduleTable}>
          <div className={styles.scheduleHeaders}>
            <div className={styles.timeHeader}>Время</div>
            <div className={styles.columnHeader}>План</div>
            <div className={styles.columnHeader}>Факт</div>
          </div>
          {exercise.timeSlots.map((slot, index) => (
            <div key={index} className={styles.scheduleRow}>
              <div className={styles.timeCell}>{slot.time}</div>
              <div className={styles.activityCell}>
                {slot.planned && (
                  <div className={styles.activity}>
                    <p>{slot.planned.text}</p>
                    <div className={styles.ratings}>
                      {slot.planned.type.isTask && (
                        <span className={styles.rating}>⚡ {slot.planned.ratings.task}</span>
                      )}
                      {slot.planned.type.isPleasure && (
                        <span className={styles.rating}>😊 {slot.planned.ratings.pleasure}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.activityCell}>
                {slot.actual && (
                  <div className={styles.activity}>
                    <p>{slot.actual.text}</p>
                    <div className={styles.ratings}>
                      {slot.actual.type.isTask && (
                        <span className={styles.rating}>⚡ {slot.actual.ratings.task}</span>
                      )}
                      {slot.actual.type.isPleasure && (
                        <span className={styles.rating}>😊 {slot.actual.ratings.pleasure}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExercises = (exercises: Exercise[]) => {
    return exercises.map(exercise => {
      switch (exercise.type) {
        case 'three-columns-method':
          return renderThreeColumnsExercise(exercise);
        case 'thought-diary':
          return renderThoughtDiaryExercise(exercise);
        case 'daily-schedule':
          return renderDailyScheduleExercise(exercise);
        default:
          return null;
      }
    });
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

          {dayProgress.exercises.testResults && dayProgress.exercises.testResults.length > 0 && (
            <div className={styles.section}>
              <h3>Тесты</h3>
              {dayProgress.exercises.testResults.map(test => (
                <div key={test.id} className={styles.test}>
                  <span>{test.name}</span>
                  <span>
                    {test.score !== undefined && `Результат: ${test.score}`}
                    {test.maxScore !== undefined && ` из ${test.maxScore}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {dayProgress.exercises.exercises && dayProgress.exercises.exercises.length > 0 && (
            <div className={styles.section}>
              <h3>Упражнения</h3>
              {renderExercises(dayProgress.exercises.exercises)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayDetails; 
