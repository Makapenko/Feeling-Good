import { UserProgress } from '../types/progress.types';
import { Notification } from './slices/notificationSlice';
import { MobileTab } from './slices/mobileSlice';
import { store } from './store';

// Определяем тип для корневого состояния Redux
export interface RootState {
  progress: UserProgress;
  mobile: {
    activeTab: MobileTab;
  };
  notification: {
    notifications: Notification[];
  };
}

// Тип диспетчера
export type AppDispatch = typeof store.dispatch; 
