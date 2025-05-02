import { createAsyncThunk } from '@reduxjs/toolkit';
import { SpecialContent, Exercise } from '../../types/progress.types';
import { TestResult } from '../types';
import {
  toggleFavoriteActivity as toggleFavorite,
  setSpecialContent as setContent,
  saveExercise,
  saveTestResult,
} from '../slices/progressSlice';
import { addNotification } from '../slices/notificationSlice';
import { RootState } from '../types';

/**
 * Переключает активность в избранное/из избранного
 */
export const toggleFavoriteActivity = createAsyncThunk(
  'progress/toggleFavoriteActivity',
  async (
    {
      activityId,
      showNotification = true,
    }: { activityId: string; showNotification?: boolean },
    { dispatch, getState }
  ) => {
    // Переключаем статус избранного
    dispatch(toggleFavorite(activityId));

    if (showNotification) {
      // Проверяем, добавлена ли активность в избранное
      const state = getState() as RootState;
      const isFavorite = state.progress.favoriteActivities.includes(activityId);

      // Отправляем уведомление в зависимости от статуса
      dispatch(
        addNotification({
          message: isFavorite
            ? 'Задание добавлено в избранное'
            : 'Задание удалено из избранного',
          type: 'success',
          duration: 2000,
        })
      );
    }

    return activityId;
  }
);

/**
 * Устанавливает текущий специальный контент (навигация)
 */
export const setSpecialContent = createAsyncThunk(
  'progress/setSpecialContent',
  async (
    {
      content,
      showNotification = true,
    }: { content: SpecialContent; showNotification?: boolean },
    { dispatch }
  ) => {
    // Устанавливаем контент
    dispatch(setContent(content));

    if (showNotification) {
      // Отправляем уведомление о переходе к активности
      dispatch(
        addNotification({
          message: 'Переход к новой активности',
          type: 'info',
          duration: 2000,
        })
      );
    }

    return content;
  }
);

/**
 * Сохраняет упражнение и показывает уведомление
 */
export const addExercise = createAsyncThunk(
  'progress/addExercise',
  async (
    {
      exercise,
      showNotification = true,
    }: { exercise: Exercise; showNotification?: boolean },
    { dispatch }
  ) => {
    // Сохраняем упражнение
    dispatch(saveExercise(exercise));

    if (showNotification) {
      // Отправляем уведомление о сохранении
      dispatch(
        addNotification({
          message: 'Результаты упражнения сохранены',
          type: 'success',
          duration: 3000,
        })
      );
    }

    return exercise;
  }
);

/**
 * Сохраняет результат теста и показывает уведомление
 */
export const saveTestResultWithNotification = createAsyncThunk(
  'progress/saveTestResultWithNotification',
  async (
    {
      testResult,
      showNotification = true,
    }: {
      testResult: TestResult;
      showNotification?: boolean;
    },
    { dispatch }
  ) => {
    // Сохраняем результат теста
    dispatch(saveTestResult(testResult));

    if (showNotification) {
      // Отправляем уведомление о сохранении
      dispatch(
        addNotification({
          message: 'Результаты теста сохранены',
          type: 'success',
          duration: 3000,
        })
      );
    }

    return testResult;
  }
);
