import { useEffect } from 'react';
import { useProgress } from '../../store/ProgressContext';
import { useNotification } from '../../store/NotificationContext';
import { activityLabels } from '../../data/activitiesLabels';

// Компонент-наблюдатель, который отслеживает изменения в прогрессе
// и показывает уведомления, когда открываются новые активности
const UnlockNotifier: React.FC = () => {
  const { progress, dispatch } = useProgress();
  const { addNotification } = useNotification();

  // Эффект для отслеживания новых разблокированных активностей
  useEffect(() => {
    // Проверяем, есть ли новые разблокированные активности
    if (progress.lastUnlockedActivities && progress.lastUnlockedActivities.length > 0) {
      // Для каждой разблокированной активности добавляем уведомление
      progress.lastUnlockedActivities.forEach(activityId => {
        const activityName = activityLabels[activityId] || activityId;
        addNotification({
          type: 'success',
          message: `Открыто новое задание: ${activityName}`,
          duration: 6000 // 6 секунд
        });
      });
      
      // Сбрасываем lastUnlockedActivities чтобы уведомления не показывались повторно
      // Создаем таймаут, чтобы дать время уведомлениям появиться
      setTimeout(() => {
        dispatch({ 
          type: 'RESET_NEWLY_UNLOCKED', 
        });
      }, 1000);
    }
  }, [progress.lastUnlockedActivities, addNotification, dispatch]);

  return null; // Компонент не рендерит никакого UI
};

export default UnlockNotifier; 
