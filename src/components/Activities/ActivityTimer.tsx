import React, { useEffect, useState, useCallback } from 'react';
import { getStoredActivityTime, saveActivityTime } from '../../utils/activityTimerStorage';
import styles from './Activities.module.css';

interface ActivityTimerProps {
  activityId: string;
  onTimeUpdate?: (time: number) => void;
}

const ActivityTimer: React.FC<ActivityTimerProps> = React.memo(({ activityId, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(() => {
    const initialTime = getStoredActivityTime(activityId);
    return initialTime;
  });

  const saveCurrentTime = useCallback((time: number) => {
    saveActivityTime(activityId, time);
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  }, [activityId, onTimeUpdate]);

  // Обновление времени
  useEffect(() => {
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
  }, [saveCurrentTime]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className={styles.activityTimer}>
      Время на странице: {formatTime(seconds)}
    </div>
  );
});

export default ActivityTimer; 
