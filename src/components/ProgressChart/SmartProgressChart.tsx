import React, { useMemo, useState, useEffect } from 'react';
import ProgressChart, { ProgressChartProps } from './ProgressChart';

interface SmartProgressChartProps extends ProgressChartProps {
  // Количество дней для отображения в разных режимах
  weekMode?: number;  // Недельный режим (7-14 дней)
  monthMode?: number; // Месячный режим (15-45 дней)
  yearMode?: number;  // Годовой режим (больше 45 дней)
  autoAdjust?: boolean; // Автоматически настраивать режимы для мобильных устройств
}

/**
 * Умный компонент графика, который выбирает подходящий режим отображения
 * в зависимости от количества данных
 */
const SmartProgressChart: React.FC<SmartProgressChartProps> = ({
  data,
  title,
  description,
  useRealData = true,
  weekMode = 14,
  monthMode = 30,
  yearMode = 90,
  autoAdjust = true
}) => {
  // Определяем, является ли устройство мобильным
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);
  
  // Добавляем отслеживание изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Адаптируем режимы для мобильных устройств, если включен autoAdjust
  const adjustedModes = useMemo(() => {
    if (!autoAdjust) {
      return { weekMode, monthMode, yearMode };
    }
    
    if (isSmallMobile) {
      return {
        weekMode: 7,      // На маленьком мобильном только неделя
        monthMode: 14,    // На маленьком мобильном месячный режим - 2 недели
        yearMode: 30      // На маленьком мобильном годовой режим - месяц
      };
    }
    
    if (isMobile) {
      return {
        weekMode: 10,     // На мобильном недельный режим - 10 дней
        monthMode: 21,    // На мобильном месячный режим - 3 недели
        yearMode: 60      // На мобильном годовой режим - 2 месяца
      };
    }
    
    // Для десктопа используем исходные значения
    return { weekMode, monthMode, yearMode };
  }, [autoAdjust, weekMode, monthMode, yearMode, isMobile, isSmallMobile]);

  // Определяем режим отображения и количество дней для показа
  const { chartMode, daysToShow } = useMemo(() => {
    const { weekMode: adjustedWeekMode, 
            monthMode: adjustedMonthMode, 
            yearMode: adjustedYearMode } = adjustedModes;
    
    // Если данные явно переданы, проверяем их размер
    if (data) {
      if (data.length <= adjustedWeekMode) {
        return { chartMode: 'week', daysToShow: adjustedWeekMode };
      } else if (data.length <= adjustedMonthMode) {
        return { chartMode: 'month', daysToShow: adjustedMonthMode };
      } else {
        return { chartMode: 'year', daysToShow: adjustedYearMode };
      }
    }
    
    // По умолчанию используем месячный режим
    return { chartMode: 'month', daysToShow: adjustedMonthMode };
  }, [data, adjustedModes]);
  
  // Генерируем подходящие заголовки в зависимости от режима
  const smartTitle = useMemo(() => {
    if (title) return title;
    
    switch (chartMode) {
      case 'week':
        return isSmallMobile ? 'Недельный прогресс' : 'Прогресс за неделю';
      case 'month':
        return isSmallMobile ? 'Месячный прогресс' : 'Прогресс за месяц';
      case 'year':
        return isSmallMobile ? 'Долгосрочный прогресс' : 'Долгосрочный прогресс';
      default:
        return 'Динамика уровня депрессии и активности';
    }
  }, [chartMode, title, isSmallMobile]);
  
  // Генерируем описание в зависимости от режима
  const smartDescription = useMemo(() => {
    if (description) return description;
    
    const baseDesc = isSmallMobile 
      ? 'График показывает уровень депрессии по тесту Бернса и вашу активность.' 
      : 'График показывает изменение уровня депрессии по опроснику Бернса (проводится раз в неделю) ' +
        'и вашу активность в приложении. Чем ниже значение шкалы депрессии и выше ' +
        'время активности, тем лучше ваш прогресс.';
    
    switch (chartMode) {
      case 'week':
        return isSmallMobile 
          ? `${baseDesc} Данные за ${daysToShow} дней.` 
          : `${baseDesc} Данные показаны за последние ${daysToShow} дней.`;
      case 'month':
        return isSmallMobile 
          ? `${baseDesc} Данные за ${daysToShow} дней.` 
          : `${baseDesc} Данные показаны за последний месяц.`;
      case 'year':
        return isSmallMobile 
          ? `${baseDesc} Данные за ${daysToShow} дней.` 
          : `${baseDesc} Данные показаны в долгосрочной перспективе.`;
      default:
        return baseDesc;
    }
  }, [chartMode, description, daysToShow, isSmallMobile]);
  
  return (
    <ProgressChart
      data={data}
      title={smartTitle}
      description={smartDescription}
      useRealData={useRealData}
      daysToShow={daysToShow}
    />
  );
};

export default SmartProgressChart; 
