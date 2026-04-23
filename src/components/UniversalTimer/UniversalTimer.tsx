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
  ACTIVITY_IDS.RATIONAL_RESPONSES,
  ACTIVITY_IDS.DOWNWARD_ARROW,
  ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES,
  ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE,
  ACTIVITY_IDS.SELF_ACTIVATION,
  ACTIVITY_IDS.IMAGERY_SCENES_DIARY, // Новый дневник воображаемых сцен
  ACTIVITY_IDS.REWRITE_BELIEF, // Новый ID
  ACTIVITY_IDS.PROCRASTINATION_SCALE, // Новый ID
  ACTIVITY_IDS.REASONS_SHOULD_REFUTATION, // Для упражнения по главе 7-9
];

// Список компонентов, для которых таймер полностью отключен (не считает время)
export const EXCLUDED_TIMER_COMPONENTS: (ActivityId | string)[] = [
  ACTIVITY_IDS.WELCOME,
  ACTIVITY_IDS.PROGRESS_CALENDAR,
  ACTIVITY_IDS.TODAY_TASKS,
  ACTIVITY_IDS.ANGER_PROS_CONS, // Добавляем упражнение "Преимущества и недостатки гнева"
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

  // Пауза при переключении на другую вкладку браузера
  const [isTabHidden, setIsTabHidden] = useState(document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Обновление времени
  useEffect(() => {
    // Не запускаем обновление времени для исключенных компонентов
    if (EXCLUDED_TIMER_COMPONENTS.includes(componentId) || isPaused || isTabHidden) {
      return;
    }


    const interval = window.setInterval(() => {
      setSeconds(prev => {
        const newTime = prev + 1;
        saveCurrentTime(newTime);
        return newTime;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [saveCurrentTime, componentId, isPaused, isTabHidden]);

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
