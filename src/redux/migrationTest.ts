/**
 * Файл для проверки корректности миграции с Context API на Redux
 * 
 * Этот файл создается только для документирования изменений и проверки,
 * что все компоненты успешно мигрированы на Redux.
 */

import { UserProgress } from '../types/progress.types';
import { store } from './store';

/**
 * Проверяет, что данные могут быть корректно загружены в Redux
 */
export const testMigration = () => {
  try {
    // Получаем текущее состояние из Redux
    const state = store.getState();
    console.log('Текущее состояние Redux:', state);
    
    // Проверяем, что состояние содержит все необходимые слайсы
    if ('progress' in state && 'mobile' in state && 'notification' in state) {
      console.log('✅ Миграция успешна: Все слайсы Redux присутствуют');
    } else {
      console.log('❌ Ошибка миграции: Не все слайсы Redux присутствуют');
    }
    
    // Проверяем, что progress содержит ожидаемые поля
    const progress = state.progress as UserProgress;
    const requiredFields = [
      'dailyProgress', 
      'chapters', 
      'unlockedContent', 
      'completedChapters', 
      'favoriteActivities'
    ];
    
    const missingFields = requiredFields.filter(field => !(field in progress));
    
    if (missingFields.length === 0) {
      console.log('✅ Миграция успешна: Все поля прогресса присутствуют');
    } else {
      console.log('❌ Ошибка миграции: Отсутствуют поля:', missingFields.join(', '));
    }

    // Проверяем actions из redux/actions
    console.log('🔍 Проверка наличия actions для уведомлений:');
    import('../redux/actions')
      .then(actions => {
        const requiredActions = [
          'addExercise',
          'toggleFavoriteActivity',
          'saveTestResultWithNotification',
          'setSpecialContent',
          'unlockAll',
          'unlockContentAfterChapter',
          'completeChapter',
          'loadChapter'
        ];
        
        const missingActions = requiredActions.filter(action => !(action in actions));
        
        if (missingActions.length === 0) {
          console.log('✅ Миграция успешна: Все необходимые actions присутствуют');
        } else {
          console.log('❌ Ошибка миграции: Отсутствуют actions:', missingActions.join(', '));
        }
      })
      .catch(error => {
        console.error('❌ Ошибка при проверке actions:', error);
      });
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка при тестировании миграции:', error);
    return false;
  }
};

// Файл можно использовать для тестирования путем раскомментирования следующей строки и запуска
// testMigration(); 
