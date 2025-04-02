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
