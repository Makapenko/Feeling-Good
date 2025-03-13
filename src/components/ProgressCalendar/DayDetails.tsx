import React from 'react';
import styles from './DayDetails.module.css';
import { ChapterMap } from './types';
import { CalendarDayProgress } from './types';
import { Exercise, ThreeColumnsExercise, ThoughtDiaryExercise, DailyScheduleExercise, AntiProcrastinationExercise, PleasureSheetExercise, NoButsExercise, SelfSupportExercise, SmallStepsExercise, MotivationWithoutCoercionExercise } from '../../types/progress.types';

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

  const renderAntiProcrastinationExercise = (exercise: AntiProcrastinationExercise) => {
    return (
      <div key={exercise.id} className={styles.exerciseSection}>
        <h4>{exercise.name}</h4>
        <div className={styles.tasksList}>
          {exercise.records.map((task, index) => (
            <div key={index} className={styles.task}>
              <div className={styles.taskContent}>
                <p className={styles.taskText}>{task.text}</p>
                <div className={styles.taskRatings}>
                  <div>
                    <strong>Ожидаемая сложность:</strong> {task.expectedDifficulty}%
                  </div>
                  <div>
                    <strong>Ожидаемое удовольствие:</strong> {task.expectedPleasure}%
                  </div>
                  {task.completed && (
                    <>
                      <div>
                        <strong>Реальная сложность:</strong> {task.actualDifficulty ?? '-'}%
                      </div>
                      <div>
                        <strong>Реальное удовольствие:</strong> {task.actualPleasure ?? '-'}%
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getComparisonClass = (actual: number | null, expected: number) => {
    if (actual === null) return '';
    if (actual === expected) return styles.same;
    return actual > expected ? styles.better : styles.worse;
  };

  const renderPleasureSheetExercise = (exercise: PleasureSheetExercise) => {
    return (
      <div key={exercise.id} className={styles.exerciseSection}>
        <h4>{exercise.name}</h4>
        <div className={styles.activityList}>
          {exercise.records.map((activity, index) => (
            <div key={index} className={styles.activity}>
              <div className={styles.activityContent}>
                <div className={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className={styles.activityDetails}>
                  <p><strong>Занятие:</strong> {activity.text}</p>
                  <p><strong>С кем:</strong> {activity.participants}</p>
                  <div className={styles.activityRatings}>
                    <div>
                      <strong>Предполагаемое удовольствие:</strong> 
                      <span>{activity.expectedPleasure}%</span>
                    </div>
                    {activity.actualPleasure !== null && (
                      <div>
                        <strong>Реальное удовольствие:</strong> 
                        <span className={getComparisonClass(activity.actualPleasure, activity.expectedPleasure)}>
                          {activity.actualPleasure}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNoButsExercise = (exercise: NoButsExercise) => {
    return (
      <div key={exercise.id} className={styles.exerciseSection}>
        <h4>{exercise.name}</h4>
        <div className={styles.pairsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.butColumn}>Отговорка</div>
            <div className={styles.arrowColumn}></div>
            <div className={styles.noButColumn}>Альтернатива</div>
          </div>
          <div className={styles.tableBody}>
            {exercise.records.map((pair, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.butColumn}>
                  <p>{pair.but}</p>
                </div>
                <div className={styles.arrowColumn}>→</div>
                <div className={styles.noButColumn}>
                  <p>{pair.noBut}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSelfSupportExercise = (exercise: SelfSupportExercise) => {
    return (
      <div key={exercise.id} className={styles.exerciseSection}>
        <h4>{exercise.name}</h4>
        <div className={styles.statementsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.devaluingColumn}>Обесценивающее утверждение</div>
            <div className={styles.arrowColumn}></div>
            <div className={styles.supportingColumn}>Поддерживающее утверждение</div>
          </div>
          <div className={styles.tableBody}>
            {exercise.records.map((statement, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.devaluingColumn}>
                  <p>{statement.devaluing}</p>
                </div>
                <div className={styles.arrowColumn}>→</div>
                <div className={styles.supportingColumn}>
                  <p>{statement.supporting}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSmallStepsExercise = (exercise: SmallStepsExercise) => {
    return (
      <div key={exercise.id} className={styles.exerciseSection}>
        <h4>{exercise.name}</h4>
        <div className={styles.tasksList}>
          {exercise.records.map((task, index) => (
            <div key={index} className={styles.task}>
              <div className={styles.taskContent}>
                <h5>{task.title}</h5>
                <div className={styles.stepsList}>
                  {task.steps.map((step, stepIndex) => (
                    <div 
                      key={stepIndex} 
                      className={`${styles.step} ${step.isCompleted ? styles.completed : ''} ${step.isRest ? styles.restStep : ''}`}
                    >
                      <div className={styles.stepContent}>
                        <span className={styles.stepText}>{step.text}</span>
                        <span className={styles.stepDuration}>{step.duration} мин</span>
                      </div>
                    </div>
                  ))}
                </div>
                {task.isCompleted && (
                  <div className={styles.completionMessage}>
                    Задача выполнена
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMotivationWithoutCoercionExercise = (exercise: MotivationWithoutCoercionExercise) => {
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
                  <strong>Мысль:</strong>
                  <p>{record.thought}</p>
                </div>
                <div className={styles.columnsContainer}>
                  <div className={styles.column}>
                    <strong>Преимущества:</strong>
                    <ul>
                      {record.advantages.map((advantage, i) => (
                        <li key={i}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.column}>
                    <strong>Недостатки:</strong>
                    <ul>
                      {record.disadvantages.map((disadvantage, i) => (
                        <li key={i}>{disadvantage}</li>
                      ))}
                    </ul>
                  </div>
                </div>
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
        case 'anti-procrastination':
          return renderAntiProcrastinationExercise(exercise);
        case 'pleasure-sheet':
          return renderPleasureSheetExercise(exercise);
        case 'no-buts':
          return renderNoButsExercise(exercise);
        case 'self-support':
          return renderSelfSupportExercise(exercise);
        case 'small-steps':
          return renderSmallStepsExercise(exercise);
        case 'motivation-without-coercion':
          return renderMotivationWithoutCoercionExercise(exercise);
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
