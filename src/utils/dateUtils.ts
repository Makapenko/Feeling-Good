import { DayProgress } from '../redux/types';

export const getCurrentDate = () => new Date().toISOString().split('T')[0];

export const getCurrentISOTimestamp = () => new Date().toISOString();

/**
 * Получить текущее время в миллисекундах с момента начала эпохи
 * @returns время в миллисекундах
 */
export const getCurrentTimestamp = () => new Date().getTime();

/**
 * Преобразует дату в формат YYYY-MM-DD
 * @param date объект Date для форматирования
 * @returns строка в формате YYYY-MM-DD
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Получает текущий год и месяц в формате YYYY-MM
 * @returns строка в формате YYYY-MM
 */
export const getCurrentYearMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

/**
 * Получает количество дней в месяце
 * @param year Год
 * @param month Месяц (1-12)
 * @returns Количество дней в месяце
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * Получает день месяца из строки с датой
 * @param dateString строка с датой
 * @returns день месяца
 */
export const getDayOfMonth = (dateString: string): number => {
  return new Date(dateString).getDate();
};

/**
 * Изменяет год и месяц на заданное количество месяцев (дельта)
 * @param currentYearMonth Строка в формате YYYY-MM
 * @param delta Количество месяцев для добавления (может быть отрицательным)
 * @returns Новая строка в формате YYYY-MM
 */
export const getUpdatedYearMonth = (currentYearMonth: string, delta: number): string => {
  const [year, month] = currentYearMonth.split('-').map(Number);
  // Месяцы в JavaScript начинаются с 0
  const newDate = new Date(year, month - 1 + delta, 1);
  const newYear = newDate.getFullYear();
  const newMonth = newDate.getMonth() + 1;
  return `${newYear}-${String(newMonth).padStart(2, '0')}`;
};

/**
 * Вычисляет разницу между двумя датами в днях
 * @param dateA первая дата (более поздняя)
 * @param dateB вторая дата (более ранняя)
 * @returns количество дней между датами
 */
export const getDaysDifference = (dateA: Date, dateB: Date): number => {
  return Math.floor((dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatDate = (
  dateString: string, 
  format: string = 'ru-RU', 
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Date(dateString).toLocaleDateString(format, options);
};

export const formatDateWithOptions = (
  dateString: string, 
  options?: Intl.DateTimeFormatOptions,
  format: string = 'ru-RU'
): string => {
  return new Date(dateString).toLocaleDateString(format, options || {
    day: 'numeric',
    month: 'long'
  });
};

export const formatTime = (
  dateString: string, 
  format: string = 'ru-RU'
): string => {
  return new Date(dateString).toLocaleTimeString(format, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Форматирует дату и время в локализованный формат
 * @param dateString строка с датой
 * @param format локаль
 * @param options опции форматирования
 * @returns отформатированная строка даты и времени
 */
export const formatDateTime = (
  dateString: string,
  format: string = 'ru-RU',
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Date(dateString).toLocaleString(format, options);
};

/**
 * Форматирует секунды в читаемый формат времени
 * @param seconds Количество секунд
 * @param showHours Нужно ли всегда показывать часы (даже если они равны 0)
 * @returns Отформатированная строка времени (часы:минуты:секунды или минуты:секунды)
 */
export const formatTimeFromSeconds = (seconds: number, showHours: boolean = false): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0 || showHours) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const compareDatesDesc = (dateA: string, dateB: string): number => {
  return new Date(dateB).getTime() - new Date(dateA).getTime();
};

/**
 * Создает идентификатор на основе текущего времени
 * @param prefix префикс для идентификатора
 * @returns строка в формате prefix-timestamp
 */
export const generateTimeBasedId = (prefix: string = 'id'): string => {
  return `${prefix}-${getCurrentTimestamp()}`;
};

/**
 * Форматирует дату в короткий формат дд.мм
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`;
};

/**
 * Создает пустую структуру ежедневного прогресса
 */
export const createEmptyDayProgress = (): DayProgress => ({
  chapters: {},
  activities: {},
  exercises: {
    testResults: [],
    exercises: []
  }
});
