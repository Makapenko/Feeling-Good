import React, { useEffect, useState, useCallback } from 'react';
import { getStoredTime, saveTime } from '../../utils/universalTimerStorage';
import { formatTimeFromSeconds } from '../../utils/dateUtils';
import styles from './UniversalTimer.module.css';
import { ACTIVITY_IDS, ActivityId } from '../../constants/activities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

// Список компонентов, для которых таймер не отображается, но время считается
export const HIDDEN_TIMER_COMPONENTS: (ActivityId | string)[] = [
  ACTIVITY_IDS.WELCOME,
  ACTIVITY_IDS.PROGRESS_CALENDAR,
  ACTIVITY_IDS.TODAY_TASKS,
  // Добавьте другие активности, где не нужно показывать таймер, но нужно считать время
  ACTIVITY_IDS.BURNS_CHECKLIST,
  ACTIVITY_IDS.NOVACO_SCALE,
  ACTIVITY_IDS.COGNITIVE_BIASES,
  ACTIVITY_IDS.COGNITIVE_BIASES_TEST,
  ACTIVITY_IDS.DAILY_SCHEDULE,
  ACTIVITY_IDS.ANTI_PROCRASTINATION,
  ACTIVITY_IDS.PLEASURE_SHEET,
  ACTIVITY_IDS.NO_BUTS,
  ACTIVITY_IDS.SELF_SUPPORT,
  ACTIVITY_IDS.SELF_ACTIVATION,
  ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS,
  ACTIVITY_IDS.DISARMING_TECHNIQUE,
  ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION,
  ACTIVITY_IDS.NO_LOSE_TECHNIQUE,
  ACTIVITY_IDS.SMALL_STEPS,
  ACTIVITY_IDS.IMAGINE_SUCCESS,
  ACTIVITY_IDS.COUNT_ACHIEVEMENTS,
  ACTIVITY_IDS.CHECK_CANT_DO,
  ACTIVITY_IDS.HOT_COOL_THOUGHTS,
  ACTIVITY_IDS.REWRITE_SHOULD_RULES,
  ACTIVITY_IDS.RATIONAL_RESPONSES,
  ACTIVITY_IDS.DOWNWARD_ARROW,
  ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES,
  ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE,
  ACTIVITY_IDS.REWRITE_BELIEF, // Новый ID
  ACTIVITY_IDS.PROCRASTINATION_SCALE, // Новый ID
];

// Список компонентов, для которых таймер полностью отключен (не считает время)
export const EXCLUDED_TIMER_COMPONENTS: (ActivityId | string)[] = [
  ACTIVITY_IDS.WELCOME,
  ACTIVITY_IDS.PROGRESS_CALENDAR,
  ACTIVITY_IDS.TODAY_TASKS,
  // Добавьте другие активности, где полностью не нужен таймер
  'default' // Для случая, когда нет активного компонента
];

interface UniversalTimerProps {
  componentId: string; // Идентификатор компонента (активности или главы)
  onTimeUpdate?: (time: number) => void; // Опциональный колбэк для обновления времени
}

const UniversalTimer: React.FC<UniversalTimerProps> = React.memo(({ componentId, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(() => {
    const initialTime = getStoredTime(componentId);
    return initialTime;
  });
  const [isPaused, setIsPaused] = useState(false);

  const saveCurrentTime = useCallback((time: number) => {
    saveTime(componentId, time);
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  }, [componentId, onTimeUpdate]);

  // Обновление времени
  useEffect(() => {
    // Не запускаем обновление времени для исключенных компонентов
    if (EXCLUDED_TIMER_COMPONENTS.includes(componentId) || isPaused) {
      return;
    }
    
    console.log(`Таймер запущен для компонента ${componentId}. Начальное время:`, seconds);
    
    const interval = window.setInterval(() => {
      setSeconds(prev => {
        const newTime = prev + 1;
        saveCurrentTime(newTime);
        return newTime;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
      console.log(`Таймер остановлен для компонента ${componentId}. Конечное время:`, seconds);
    };
  }, [saveCurrentTime, componentId, isPaused]);

  // Сброс таймера при смене компонента
  useEffect(() => {
    const storedTime = getStoredTime(componentId);
    setSeconds(storedTime);
    setIsPaused(false); // Сбрасываем паузу при смене компонента
  }, [componentId]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Не показываем таймер для компонентов из списка скрытых
  if (HIDDEN_TIMER_COMPONENTS.includes(componentId)) {
    return null;
  }

  return (
    <div className={`${styles.universalTimer} ${isPaused ? styles.isPaused : ''}`}>
      <span className={styles.timerText}>
        {isPaused ? '⏸️ ' : ''}Время: {formatTimeFromSeconds(seconds)}
      </span>
      <button 
        className={styles.pauseButton} 
        onClick={togglePause}
        aria-label={isPaused ? 'Возобновить' : 'Пауза'}
      >
        <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
      </button>
    </div>
  );
});

export default UniversalTimer; 
