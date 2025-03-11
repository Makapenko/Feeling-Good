import { useProgress } from '../../store/ProgressContext';
import ChapterReader from './ChapterReader';
import Timer from './Timer';
import styles from './ChapterReader.module.css';

interface ChapterContainerProps {
  content: string;
  chapterId: string;
  onNext?: () => void;
}

const ChapterContainer: React.FC<ChapterContainerProps> = ({ content, chapterId, onNext }) => {
  const { progress, dispatch } = useProgress();
  const currentDate = new Date().toISOString().split('T')[0];
  const initialTime = progress.dailyProgress[currentDate]?.chapters[chapterId]?.timeSpent || 0;

  const handleTimeUpdate = (timeSpent: number) => {
    dispatch({ 
      type: 'UPDATE_CHAPTER_PROGRESS', 
      chapterId, 
      timeSpent 
    });
  };

  return (
    <div className={styles.chapterContainer}>
      <Timer 
        onTimeUpdate={handleTimeUpdate} 
        initialTime={initialTime}
        chapterId={chapterId}
      />
      <ChapterReader 
        content={content} 
        chapterId={chapterId}
        onNext={onNext}
      />
    </div>
  );
};

export default ChapterContainer; 
