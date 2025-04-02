import ChapterReader from './ChapterReader';
import styles from './ChapterReader.module.css';
import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { loadChapter } from '../../redux/actions';

interface ChapterContainerProps {
  content: string;
  chapterId: string;
  onNext?: () => void;
}

const ChapterContainer: React.FC<ChapterContainerProps> = ({ content, chapterId, onNext }) => {
  const dispatch = useAppDispatch();

  // Проверяем, есть ли текст главы, и если нет - загружаем его
  useEffect(() => {
    if (chapterId && (!content || content.trim() === '')) {
      console.log('Загружаем содержимое главы:', chapterId);
      dispatch(loadChapter(chapterId));
    }
  }, [chapterId, content, dispatch]);

  // Если контент отсутствует, показываем заглушку загрузки
  if (!content || content.trim() === '') {
    return (
      <div className={styles.chapterContainer}>
        <div className={styles.loadingContainer}>
          <p>Загрузка содержимого главы...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chapterContainer}>
      <ChapterReader 
        content={content} 
        chapterId={chapterId}
        onNext={onNext}
      />
    </div>
  );
};

export default ChapterContainer; 
