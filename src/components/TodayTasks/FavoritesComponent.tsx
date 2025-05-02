import { useMemo } from 'react';
import { useAppDispatch, useFavoriteActivities, useFavoriteChapters } from '../../redux/hooks';
import styles from './TodayTasks.module.css';
import { loadChapter } from '../../redux/actions/chapterActions';
import { ACTIVITY_NAMES } from '../../constants/activities';

const FavoritesComponent: React.FC<{ onActivityClick: (activityId: string) => void }> = ({ onActivityClick }) => {
  const dispatch = useAppDispatch();

  const favoriteActivitiesIds = useFavoriteActivities();
  const favoriteChapters = useFavoriteChapters();
  // Функция для получения имени активности по ID
  function getActivityNameById(id: string): string {
    return ACTIVITY_NAMES[id as keyof typeof ACTIVITY_NAMES] || '';
  }
  // Получаем избранные активности напрямую из Redux
  const favoriteActivities = useMemo(() => {
    const favoriteIds = favoriteActivitiesIds || [];
    return favoriteIds.map(id => ({
      id,
      name: getActivityNameById(id)
    })).filter(activity => activity.name); // Фильтруем по наличию имени
  }, [favoriteActivitiesIds]);

  // Функция для перехода к чтению избранной главы
  const handleFavoriteChapterClick = async (chapterId: string) => {
    try {
      // Используем экшен loadChapter для загрузки избранной главы
      await dispatch(loadChapter(chapterId));
    } catch (error) {
      console.error('Ошибка загрузки главы:', error);
    }
  };

  return (
    <>
      {favoriteActivities.length > 0 && (
        <>
          <h2 className={styles.favoritesTitle}>Избранные задания</h2>
          <div className={styles.favoritesList}>
            {favoriteActivities.map(activity => (
              <div
                key={activity.id}
                className={`${styles.favoriteItem} ${styles.clickable}`}
                onClick={() => onActivityClick(activity.id)}
              >
                <div className={styles.favoriteIcon}>★</div>
                <span className={styles.favoriteTitle}>{activity.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {favoriteChapters.length > 0 && (
        <>
          <h2 className={styles.favoritesTitle}>Избранные главы</h2>
          <div className={styles.favoritesList}>
            {favoriteChapters.map(chapter => (
              <div
                key={chapter.id}
                className={`${styles.favoriteItem} ${styles.clickable}`}
                onClick={() => handleFavoriteChapterClick(chapter.id)}
              >
                <div className={styles.favoriteIcon}>★</div>
                <span className={styles.favoriteTitle}>{chapter.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default FavoritesComponent;
