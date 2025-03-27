import { useEffect } from 'react';
import { useAppDispatch, useLastUnlockedChapter, useLastUnlockedActivities } from '../../redux/hooks';
import { resetNewlyUnlocked } from '../../redux/slices/progressSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import { ACTIVITY_NAMES } from '../../constants/activities';

// Компонент-наблюдатель, который отслеживает изменения в прогрессе
// и показывает уведомления о разблокировке новых глав и заданий
const UnlockNotifier = () => {
  const dispatch = useAppDispatch();
  const lastUnlockedChapter = useLastUnlockedChapter();
  const lastUnlockedActivities = useLastUnlockedActivities();

  useEffect(() => {
    if (lastUnlockedChapter || (lastUnlockedActivities && lastUnlockedActivities.length > 0)) {
      // Задержка для отображения уведомлений после завершения операций
      setTimeout(() => {
        // Одно объединенное уведомление для всех разблокированных заданий
        if (lastUnlockedActivities && lastUnlockedActivities.length > 0) {
          if (lastUnlockedActivities.length === 1) {
            const activityName = ACTIVITY_NAMES[lastUnlockedActivities[0]] || lastUnlockedActivities[0];
            dispatch(addNotification({
              type: 'success',
              message: `Открыто новое задание: ${activityName}`,
              duration: 6000
            }));
          } else {
            dispatch(addNotification({
              type: 'success',
              message: `Открыты новые задания: ${lastUnlockedActivities.length} шт.`,
              duration: 6000
            }));
          }
        }
        
        // Сбрасываем флаги разблокировки
        dispatch(resetNewlyUnlocked());
      }, 1000);
    }
  }, [lastUnlockedActivities, lastUnlockedChapter, dispatch]);

  return null; // Компонент не рендерит никакого UI
};

export default UnlockNotifier; 
