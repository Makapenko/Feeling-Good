import { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './SmallSteps.module.css';
import { SmallStep, SmallStepsTask } from './types';
import { useProgress } from '../../../store/ProgressContext';

const SHEET_ID = 'small-steps';

const SmallSteps: React.FC = () => {
  const { dispatch, progress } = useProgress();
  const [tasks, setTasks] = useState<SmallStepsTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newStepText, setNewStepText] = useState('');
  const [newStepDuration, setNewStepDuration] = useState(3);
  const [editingStep, setEditingStep] = useState<{ taskId: string; stepId: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const saveToProgress = (updatedTasks: SmallStepsTask[]) => {
    dispatch({
      type: 'SAVE_EXERCISE',
      exercise: {
        type: 'small-steps',
        id: SHEET_ID,
        name: 'Метод маленьких шагов',
        completed: true,
        completedAt: new Date().toISOString(),
        records: updatedTasks
      }
    });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: SmallStepsTask = {
      id: uuidv4(),
      title: newTaskTitle,
      steps: [],
      isActive: false
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskTitle('');
    saveToProgress(updatedTasks);
  };

  const addStep = (taskId: string) => {
    if (!newStepText.trim()) return;

    const newStep: SmallStep = {
      id: uuidv4(),
      text: newStepText,
      isCompleted: false,
      duration: newStepDuration,
      isRest: false,
      timeLeft: newStepDuration * 60,
      timerEnded: false
    };

    const restStep: SmallStep = {
      id: uuidv4(),
      text: 'Отдых',
      isCompleted: false,
      duration: 1,
      isRest: true,
      timeLeft: 60,
      timerEnded: false
    };

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          steps: [...task.steps, newStep, restStep]
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setNewStepText('');
    setNewStepDuration(3);
    saveToProgress(updatedTasks);
  };

  const updateStep = (taskId: string, stepId: string, updates: Partial<SmallStep>) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          steps: task.steps.map(step => {
            if (step.id === stepId) {
              const updatedStep = { ...step, ...updates };
              if (updates.duration) {
                updatedStep.timeLeft = updates.duration * 60;
              }
              return updatedStep;
            }
            return step;
          })
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveToProgress(updatedTasks);
  };

  const startEditing = (taskId: string, stepId: string) => {
    setEditingStep({ taskId, stepId });
  };

  const stopEditing = () => {
    setEditingStep(null);
  };

  const toggleStep = (taskId: string, stepId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSteps = task.steps.map(step => {
          if (step.id === stepId && !step.isCompleted) {
            if (step.timerEnded && audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            return { ...step, isCompleted: true, timerEnded: false };
          }
          return step;
        });

        if (stepId === task.currentStepId) {
          const currentIndex = updatedSteps.findIndex(step => step.id === stepId);
          const nextStep = updatedSteps[currentIndex + 1];
          if (nextStep) {
            return {
              ...task,
              steps: updatedSteps,
              currentStepId: nextStep.id
            };
          } else {
            return {
              ...task,
              steps: updatedSteps,
              isActive: false,
              currentStepId: undefined,
              isCompleted: true
            };
          }
        }

        return {
          ...task,
          steps: updatedSteps
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveToProgress(updatedTasks);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const startTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const firstIncompleteStep = task.steps.find(step => !step.isCompleted);
        return {
          ...task,
          isActive: true,
          currentStepId: firstIncompleteStep?.id
        };
      }
      return {
        ...task,
        isActive: false,
        currentStepId: undefined
      };
    });

    setTasks(updatedTasks);
    saveToProgress(updatedTasks);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;

      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (!task.isActive) return task;

          const updatedSteps = task.steps.map(step => {
            if (step.id === task.currentStepId && !step.isCompleted && step.timeLeft && step.timeLeft > 0) {
              const newTimeLeft = step.timeLeft - 1;

              if (newTimeLeft === 0) {
                if (audioRef.current) {
                  audioRef.current.play();
                }
                return { ...step, timeLeft: 0, timerEnded: true };
              }

              return { ...step, timeLeft: newTimeLeft };
            }
            return step;
          });

          const allStepsCompleted = updatedSteps.every(step => step.isCompleted);
          if (allStepsCompleted) {
            return {
              ...task,
              steps: updatedSteps,
              isActive: false,
              currentStepId: undefined,
              isCompleted: true
            };
          }

          return {
            ...task,
            steps: updatedSteps
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds?: number) => {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Получаем статус избранного из Redux
  const isFavorite = useMemo(() => {
    return progress.favoriteActivities?.includes(SHEET_ID) || false;
  }, [progress.favoriteActivities]);

  // Добавление или удаление из избранного через Redux
  const toggleFavorite = () => {
    dispatch({
      type: 'TOGGLE_FAVORITE_ACTIVITY',
      activityId: SHEET_ID
    });
  };

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/notification.mp3" />
      <div className={styles.description}>
        <div className={styles.titleContainer}>
          <h2>Метод маленьких шагов</h2>
          <button
            className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            ★
          </button>
        </div>
        <p>
          Этот инструмент поможет вам разделить большую задачу на маленькие управляемые части.
          После каждого выполненного шага у вас будет минута отдыха.
          Это поможет:
        </p>
        <ul>
          <li>Справиться с перегрузкой от большой задачи</li>
          <li>Сохранять концентрацию в течение коротких периодов</li>
          <li>Регулярно делать перерывы для восстановления</li>
          <li>Отслеживать прогресс в выполнении задачи</li>
        </ul>
      </div>

      <div className={styles.newTask}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Введите название большой задачи..."
          className={styles.input}
        />
        <button onClick={addTask} className={styles.button}>
          Создать задачу
        </button>
      </div>

      {tasks.map(task => (
        <div key={task.id} className={styles.task}>
          <h3>{task.title}</h3>

          <div className={styles.steps}>
            {task.steps.map(step => (
              <div
                key={step.id}
                className={`${styles.step} 
                  ${step.isRest ? styles.restStep : ''} 
                  ${step.isCompleted ? styles.completed : ''} 
                  ${step.id === task.currentStepId ? styles.currentStep : ''}
                  ${step.timerEnded ? styles.timerEnded : ''}`}
              >
                <input
                  type="checkbox"
                  checked={step.isCompleted}
                  onChange={() => toggleStep(task.id, step.id)}
                  className={styles.checkbox}
                  disabled={false}
                />
                {editingStep?.taskId === task.id && editingStep?.stepId === step.id && !task.isActive ? (
                  <div className={styles.editStep}>
                    <input
                      type="text"
                      value={step.text}
                      onChange={(e) => updateStep(task.id, step.id, { text: e.target.value })}
                      className={styles.editInput}
                      onBlur={stopEditing}
                      autoFocus
                    />
                  </div>
                ) : (
                  <span
                    className={`${styles.stepText} ${!task.isActive ? styles.editable : ''}`}
                    onClick={() => !task.isActive && startEditing(task.id, step.id)}
                  >
                    {step.text}
                  </span>
                )}
                {!task.isActive && (
                  <input
                    type="number"
                    value={step.duration}
                    onChange={(e) => updateStep(task.id, step.id, { duration: Number(e.target.value) })}
                    min="1"
                    className={styles.editDuration}
                  />
                )}
                {task.isActive && (
                  <span className={styles.duration}>{step.duration} мин</span>
                )}
                <span className={styles.timer}>
                  {step.id === task.currentStepId ? formatTime(step.timeLeft) : '--:--'}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.newStep}>
            <input
              type="text"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              placeholder="Опишите маленький шаг..."
              className={styles.input}
            />
            <div className={styles.durationWrapper}>
              <input
                type="number"
                value={newStepDuration}
                onChange={(e) => setNewStepDuration(Number(e.target.value))}
                min="1"
                className={styles.durationInput}
              />
              <span className={styles.durationLabel}>мин</span>
            </div>
            <button onClick={() => addStep(task.id)} className={styles.button}>
              Добавить шаг
            </button>
          </div>

          {task.isActive && (
            <button
              onClick={() => togglePause()}
              className={`${styles.button} ${styles.pauseButton}`}
            >
              {isPaused ? 'Продолжить' : 'Пауза'}
            </button>
          )}

          {!task.isActive && task.steps.length > 0 && !task.isCompleted && (
            <button
              onClick={() => startTask(task.id)}
              className={styles.startButton}
            >
              Начать выполнение
            </button>
          )}
          {task.isCompleted && (
            <div className={styles.completionMessage}>
              Поздравляем! Задача успешно выполнена! 🎉
            </div>
          )}
        </div>

      ))}
    </div>
  );
};

export default SmallSteps; 
