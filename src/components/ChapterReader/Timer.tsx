import React, { useEffect, useState, useCallback } from 'react';
import styles from './ChapterReader.module.css';
import { getStoredTime, saveTime } from '../../utils/timerStorage';

interface TimerProps {
  onTimeUpdate: (time: number) => void;
  initialTime?: number;
  chapterId: string;
}

const Timer: React.FC<TimerProps> = React.memo(({ onTimeUpdate, chapterId }) => {
  const [seconds, setSeconds] = useState(() => {
    const initialTime = getStoredTime(chapterId);
    return initialTime;
  });

  const saveCurrentTime = useCallback((time: number) => {
    saveTime(chapterId, time);
    onTimeUpdate(time);
  }, [chapterId, onTimeUpdate]);

  // Сброс таймера при смене главы
  useEffect(() => {
    const storedTime = getStoredTime(chapterId);
    setSeconds(storedTime);
  }, [chapterId]);

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
    <div className={styles.timer}>
      Время чтения: {formatTime(seconds)}
    </div>
  );
});

export default Timer; 
