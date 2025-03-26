import ChapterReader from './ChapterReader';
import Timer from './Timer';
import styles from './ChapterReader.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateChapterProgress } from '../../redux/slices/progressSlice';

interface ChapterContainerProps {
  content: string;
  chapterId: string;
  onNext?: () => void;
}

const ChapterContainer: React.FC<ChapterContainerProps> = ({ content, chapterId, onNext }) => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(state => state.progress);
  const currentDate = new Date().toISOString().split('T')[0];
  const initialTime = progress.dailyProgress[currentDate]?.chapters[chapterId]?.timeSpent || 0;

  const handleTimeUpdate = (timeSpent: number) => {
    dispatch(updateChapterProgress({ chapterId, timeSpent })); 
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
