import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Определяем тип для мобильной вкладки
export type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

// Определяем интерфейс состояния
interface MobileState {
  activeTab: MobileTab;
}

// Начальное состояние
const initialState: MobileState = {
  activeTab: 'today'
};

// Создаем слайс
const mobileSlice = createSlice({
  name: 'mobile',
  initialState,
  reducers: {
    // Экшен для изменения активной вкладки
    setActiveTab: (state, action: PayloadAction<MobileTab>) => {
      state.activeTab = action.payload;
    }
  }
});

// Экспортируем actions и reducer
export const { setActiveTab } = mobileSlice.actions;
export default mobileSlice.reducer; 
