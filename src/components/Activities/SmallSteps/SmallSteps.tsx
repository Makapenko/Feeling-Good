import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './SmallSteps.module.css';
import { SmallStep, SmallStepsTask } from './types';
import { useProgress } from '../../../store/ProgressContext';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
const SHEET_ID = ACTIVITY_IDS.SMALL_STEPS;

const SmallSteps: React.FC = () => {
  const { dispatch, progress } = useProgress();
  const [tasks, setTasks] = useState<SmallStepsTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskInputs, setTaskInputs] = useState<Record<string, { text: string; duration: number }>>({});
  const [editingStep, setEditingStep] = useState<{ taskId: string; stepId: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initialLoadDone = useRef(false);

  // Загружаем существующие задачи из прогресса только при первой загрузке
  useEffect(() => {
    if (!progress?.dailyProgress || initialLoadDone.current) return;

    // Собираем все задачи из разных дней
    const allTasks: SmallStepsTask[] = [];
    
    Object.values(progress.dailyProgress).forEach(dayProgress => {
      const exercises = dayProgress.exercises.exercises || [];
      exercises
        .filter(exercise => exercise.type === ACTIVITY_IDS.SMALL_STEPS && exercise.id === SHEET_ID)
        .forEach(exercise => {
          if ('records' in exercise && Array.isArray(exercise.records)) {
            allTasks.push(...exercise.records as SmallStepsTask[]);
          }
        });
    });

    // Дедупликация задач по ID
    const uniqueTasks = allTasks.reduce((acc: SmallStepsTask[], task) => {
      const existingTaskIndex = acc.findIndex(t => t.id === task.id);
      if (existingTaskIndex === -1) {
        acc.push(task);
      }
      return acc;
    }, []);

    // Если есть задачи, загружаем их
    if (uniqueTasks.length > 0) {
      setTasks(uniqueTasks);
      
      // Инициализируем состояния для ввода для каждой задачи
      const initialInputs: Record<string, { text: string; duration: number }> = {};
      uniqueTasks.forEach(task => {
        initialInputs[task.id] = { text: '', duration: 3 };
      });
      setTaskInputs(initialInputs);
    }
    
    initialLoadDone.current = true;
  }, [progress?.dailyProgress]);

  const saveToProgress = (updatedTasks: SmallStepsTask[]) => {
    dispatch({
      type: 'SAVE_EXERCISE',
      exercise: {
        type: ACTIVITY_IDS.SMALL_STEPS,
        id: SHEET_ID,
        name: ACTIVITY_NAMES[ACTIVITY_IDS.SMALL_STEPS],
        completed: true,
        completedAt: new Date().toISOString(),
        records: updatedTasks
      }
    });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTaskId = uuidv4();
    const newTask: SmallStepsTask = {
      id: newTaskId,
      title: newTaskTitle,
      steps: [],
      isActive: false
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskTitle('');
    saveToProgress(updatedTasks);
    
    // Добавляем состояние ввода для новой задачи
    setTaskInputs(prev => ({
      ...prev,
      [newTaskId]: { text: '', duration: 3 }
    }));
  };

  const addStep = (taskId: string) => {
    const taskInput = taskInputs[taskId];
    if (!taskInput || !taskInput.text.trim()) return;

    const newStep: SmallStep = {
      id: uuidv4(),
      text: taskInput.text,
      isCompleted: false,
      duration: taskInput.duration,
      isRest: false,
      timeLeft: taskInput.duration * 60,
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
    
    // Сбрасываем только текст, сохраняя последнюю использованную длительность
    setTaskInputs(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], text: '' }
    }));
    
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

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/notification.mp3" />
      <div className={styles.titleContainer}>
        <h2>Метод маленьких шагов</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>
      <div className={styles.description}>
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
              value={taskInputs[task.id]?.text || ''}
              onChange={(e) => setTaskInputs(prev => ({ 
                ...prev, 
                [task.id]: { ...prev[task.id], text: e.target.value } 
              }))}
              placeholder="Опишите маленький шаг..."
              className={styles.input}
            />
            <div className={styles.durationWrapper}>
              <input
                type="number"
                value={taskInputs[task.id]?.duration || 3}
                onChange={(e) => setTaskInputs(prev => ({ 
                  ...prev, 
                  [task.id]: { ...prev[task.id], duration: Number(e.target.value) } 
                }))}
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
