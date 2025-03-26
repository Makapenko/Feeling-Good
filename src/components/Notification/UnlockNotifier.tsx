import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { resetNewlyUnlocked } from '../../redux/slices/progressSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import { ACTIVITY_NAMES } from '../../constants/activities';

// Компонент-наблюдатель, который отслеживает изменения в прогрессе
// и показывает уведомления, когда открываются новые активности
const UnlockNotifier = () => {
  const dispatch = useAppDispatch();
  const { lastUnlockedChapter, lastUnlockedActivities } = useAppSelector(state => state.progress);

  useEffect(() => {
    if (lastUnlockedChapter || (lastUnlockedActivities && lastUnlockedActivities.length > 0)) {
      // Задержка для отображения уведомлений после загрузки
      setTimeout(() => {
        if (lastUnlockedChapter) {
          dispatch(addNotification({
            type: 'success',
            message: `Открыта новая глава: ${lastUnlockedChapter}`,
            duration: 6000 // 6 секунд
          }));
        }

        // Если есть новые активности
        lastUnlockedActivities.forEach(activityId => {
          const activityName = ACTIVITY_NAMES[activityId] || activityId;
          dispatch(addNotification({
            type: 'success',
            message: `Открыто новое задание: ${activityName}`,
            duration: 6000 // 6 секунд
          }));
        });
        
        // Сбрасываем флаги разблокировки
        dispatch(resetNewlyUnlocked());
      }, 1000);
    }
  }, [lastUnlockedActivities, lastUnlockedChapter, dispatch]);

  return null; // Компонент не рендерит никакого UI
};

export default UnlockNotifier; 
