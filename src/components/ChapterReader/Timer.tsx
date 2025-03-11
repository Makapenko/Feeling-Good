import { useEffect, useState } from 'react';
import styles from './ChapterReader.module.css';

interface TimerProps {
  onTimeUpdate: (time: number) => void;
}

const Timer: React.FC<TimerProps> = ({ onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        const newTime = prev + 1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUpdate]);

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
