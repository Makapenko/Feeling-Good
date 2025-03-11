import { useEffect, useState } from 'react';
import styles from './ChapterReader.module.css';
import { getStoredTime, saveTime } from '../../utils/timerStorage';

interface TimerProps {
  onTimeUpdate: (time: number) => void;
  initialTime?: number;
  chapterId: string;
}

const Timer: React.FC<TimerProps> = ({ onTimeUpdate, chapterId }) => {
  const [seconds, setSeconds] = useState(() => {
    const initialTime = getStoredTime(chapterId);
    console.log('Initial time for chapter', chapterId, ':', initialTime);
    return initialTime;
  });

  // Сброс таймера при смене главы
  useEffect(() => {
    const storedTime = getStoredTime(chapterId);
    console.log('Chapter changed, stored time:', storedTime);
    setSeconds(storedTime);
  }, [chapterId]);

  // Обновление времени
  useEffect(() => {
    console.log('Starting timer for chapter', chapterId);
    let isMounted = true;

    const saveCurrentTime = (time: number) => {
      if (isMounted) {
        console.log('Saving time for chapter', chapterId, ':', time);
        saveTime(chapterId, time);
        onTimeUpdate(time);
      }
    };

    const interval = window.setInterval(() => {
      setSeconds(prev => {
        const newTime = prev + 1;
        saveCurrentTime(newTime);
        return newTime;
      });
    }, 1000);

    return () => {
      isMounted = false;
      console.log('Cleaning up timer for chapter', chapterId);
      window.clearInterval(interval);
      saveCurrentTime(seconds);
    };
  }, [chapterId, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.timer}>
      Время чтения: {formatTime(seconds)}
    </div>
  );
};

export default Timer; 
