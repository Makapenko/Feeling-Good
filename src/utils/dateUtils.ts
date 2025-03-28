export const getCurrentDate = () => new Date().toISOString().split('T')[0];

export const getCurrentISOTimestamp = () => new Date().toISOString();

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
 * Форматирует секунды в читаемый формат времени (минуты:секунды)
 */
export const formatTimeFromSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const compareDatesDesc = (dateA: string, dateB: string): number => {
  return new Date(dateB).getTime() - new Date(dateA).getTime();
};

export const generateTimeBasedId = (prefix: string = 'id'): string => {
  return `${prefix}-${new Date().getTime()}`;
};
