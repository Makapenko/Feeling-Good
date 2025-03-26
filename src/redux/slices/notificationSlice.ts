import { createSlice, PayloadAction, Middleware } from '@reduxjs/toolkit';

// Определяем тип для уведомления
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // Длительность в мс
}

// Определяем интерфейс состояния
interface NotificationState {
  notifications: Notification[];
}

// Начальное состояние
const initialState: NotificationState = {
  notifications: []
};

// Создаем слайс
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Экшен для добавления нового уведомления
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      const notification: Notification = {
        ...action.payload,
        id,
        duration: action.payload.duration || 5000 // По умолчанию 5 секунд
      };
      state.notifications.push(notification);
    },
    
    // Экшен для удаления уведомления по id
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    }
  }
});

// Middleware для автоматического удаления уведомлений
export const notificationMiddleware: Middleware = store => next => action => {
  const result = next(action);
  
  // Безопасно проверяем тип действия
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const actionWithType = action as { type: string };
    
    // Если добавляется новое уведомление
    if (actionWithType.type === 'notification/addNotification') {
      const state = store.getState().notification as NotificationState;
      const lastNotification = state.notifications[state.notifications.length - 1];
      
      if (lastNotification && lastNotification.duration) {
        setTimeout(() => {
          store.dispatch(removeNotification(lastNotification.id));
        }, lastNotification.duration);
      }
    }
  }
  
  return result;
};

// Экспортируем actions и reducer
export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 
