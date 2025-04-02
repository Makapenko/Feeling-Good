import React, { useMemo, useState, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Bar, Line, ReferenceLine
} from 'recharts';
import { useTestsByType, useDailyProgress } from '../../redux/hooks';
import { formatDateWithOptions } from '../../utils/dateUtils';
import styles from './ProgressChart.module.css';
import { ChartDataPoint } from '../../types/charts.types';

export interface ProgressChartProps {
  // Можно передать готовые данные для графика
  data?: ChartDataPoint[];
  // Или заголовок и описание
  title?: string;
  description?: string;
  // Если не передавать данные, компонент будет использовать реальные данные из Redux
  useRealData?: boolean;
  // Количество дней для отображения (по умолчанию 30)
  daysToShow?: number;
}

// Компонент для отображения особых точек на графике
interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ChartDataPoint;
  stroke?: string;
  value?: number;
  index?: number;
}

const CustomDot: React.FC<CustomDotProps> = (props) => {
  const { cx, cy, payload, stroke } = props;
  
  // Если координаты не определены или нет данных, не отображаем точку
  if (!cx || !cy || !payload) return null;
  
  // Отображаем точку только если это день с пройденным опросником
  if (payload.hasDepressionTest) {
    return (
      <circle cx={cx} cy={cy} r={5} stroke={stroke} fill={stroke} />
    );
  }
  
  return null;
};

/**
 * Компонент для отображения графика прогресса уровня депрессии и активности пользователя
 */
const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data: propData,
  title,
  description,
  useRealData = true,
  daysToShow = 30
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

  // Получаем результаты теста Бернса
  const burnsResults = useTestsByType('burns-checklist');
  // Получаем данные о ежедневном прогрессе
  const dailyProgressData = useDailyProgress();

  // Обрабатываем данные для графика из Redux, если не переданы готовые
  const chartData = useMemo(() => {
    // Если переданы готовые данные, используем их
    if (propData) {
      return propData;
    }
    
    // Если не нужно использовать реальные данные, возвращаем пустой массив
    if (!useRealData) {
      return [];
    }

    // Дальше идет оригинальная логика обработки реальных данных
    if (!burnsResults || !dailyProgressData) return [];

    // Создаем карту дат для быстрого доступа к результатам тестов
    const testResultsByDate = new Map();
    burnsResults.forEach(result => {
      // Получаем дату без времени
      const date = result.completedAt.split('T')[0];
      testResultsByDate.set(date, { score: result.score, maxScore: result.maxScore });
    });

    // Собираем данные о времени чтения и выполнения упражнений
    const progressByDate = new Map();
    
    Object.entries(dailyProgressData).forEach(([date, dayProgress]) => {
      let readingTime = 0;
      let exerciseTime = 0; // Время, потраченное на выполнение упражнений
      
      // Считаем время чтения
      if (dayProgress.chapters) {
        Object.values(dayProgress.chapters).forEach(chapter => {
          readingTime += chapter.timeSpent;
        });
      }
      
      // Считаем время упражнений (пока используем заглушку)
      // В будущем здесь должна быть логика подсчета времени из упражнений
      // Сейчас просто оценим время по количеству упражнений (15 минут на упражнение)
      const exercisesCount = 
        (dayProgress.exercises?.exercises?.length || 0) + 
        (dayProgress.exercises?.testResults?.length || 0);
      exerciseTime = exercisesCount * 15 * 60; // Примерно 15 минут на упражнение в секундах

      progressByDate.set(date, {
        readingTime,
        exerciseTime
      });
    });

    // Объединяем все даты (из тестов и прогресса)
    const allDates = [...new Set([
      ...testResultsByDate.keys(),
      ...progressByDate.keys()
    ])].sort(); // Сортируем даты по возрастанию

    // Если есть данные за более чем daysToShow дней, ограничиваем диапазон
    let datesToShow = allDates;
    if (allDates.length > daysToShow) {
      datesToShow = allDates.slice(-daysToShow);
    }

    // Формируем итоговые данные для графика
    return datesToShow.map(date => {
      const testResult = testResultsByDate.get(date);
      const progress = progressByDate.get(date);
      
      return {
        date,
        formattedDate: formatDateWithOptions(date, { 
          day: 'numeric', 
          month: isSmallMobile ? 'numeric' : 'short' 
        }),
        // Баллы по Бернсу (если есть)
        depressionScore: testResult ? testResult.score : undefined,
        // Процент от максимального балла (для нормализации)
        depressionPercentage: testResult 
          ? Math.round((testResult.score / testResult.maxScore) * 100) 
          : undefined,
        // Указываем, был ли пройден тест в этот день (для маркера на графике)
        hasDepressionTest: !!testResult,
        // Время чтения (в минутах)
        readingTime: progress ? Math.round(progress.readingTime / 60) : 0,
        // Время упражнений (в минутах)
        exerciseTime: progress ? Math.round(progress.exerciseTime / 60) : 0,
        // Общее время активности в приложении (в минутах)
        totalActivityTime: progress 
          ? Math.round((progress.readingTime + progress.exerciseTime) / 60) 
          : 0
      };
    });
  }, [burnsResults, dailyProgressData, propData, useRealData, daysToShow, isSmallMobile]);

  // Проверяем, достаточно ли данных для графика
  if (chartData.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>Недостаточно данных для отображения графика прогресса</p>
        <p>Пройдите опросник Бернса и поработайте с приложением, чтобы увидеть изменения</p>
      </div>
    );
  }

  // Определяем заголовок и описание
  const chartTitle = title || 'Динамика уровня депрессии и активности';
  const chartDescription = description || 
    'График показывает изменение уровня депрессии по опроснику Бернса (проводится раз в неделю) ' +
    'и вашу активность в приложении. Чем ниже значение шкалы депрессии и выше ' +
    'время активности, тем лучше ваш прогресс.';

  // Находим дни, когда был пройден опросник Бернса
  const testDays = chartData
    .filter(point => point.hasDepressionTest)
    .map(point => point.formattedDate);

  // Расчёт интервала для меток оси X в зависимости от количества данных и размера экрана
  const calculateXAxisInterval = () => {
    if (isSmallMobile) {
      return chartData.length <= 7 ? 1 : Math.ceil(chartData.length / 3);
    }
    if (isMobile) {
      return chartData.length <= 10 ? 1 : Math.ceil(chartData.length / 4);
    }
    return chartData.length > 14 ? Math.floor(chartData.length / 7) : 0;
  };

  // Расчёт размера столбцов в зависимости от количества данных и размера экрана
  const calculateBarSize = () => {
    if (isSmallMobile) {
      return chartData.length > 7 ? 4 : 10;
    }
    if (isMobile) {
      return chartData.length > 10 ? 6 : 15;
    }
    return chartData.length > 14 ? 8 : 20;
  };

  // Определяем высоту графика в зависимости от экрана
  const chartHeight = isSmallMobile ? 250 : isMobile ? 280 : 300;
  
  // Размер точек активности на графике
  const activeDotSize = isSmallMobile ? 6 : 8;

  return (
    <div className={styles.chartContainer}>
      <h3>{chartTitle}</h3>
      
      <div className={styles.chartDescription}>
        <p>{chartDescription}</p>
      </div>
      
      <ResponsiveContainer width="100%" height={chartHeight}>
        <ComposedChart data={chartData} margin={{ 
          top: 5, 
          right: isMobile ? 30 : 20, 
          bottom: 5, 
          left: isMobile ? -15 : 0
        }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedDate" 
            interval={calculateXAxisInterval()}
            tick={{ fontSize: isSmallMobile ? 10 : 12 }}
            tickMargin={isSmallMobile ? 5 : 8}
          />
          
          {/* Шкала для депрессии (слева) */}
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#8884d8" 
            label={isMobile ? { 
              value: 'Уровень, %', 
              angle: -90, 
              position: 'insideLeft', 
              fontSize: isSmallMobile ? 10 : 11,
              offset: isSmallMobile ? 0 : 5
            } : {
              value: 'Уровень депрессии (%)', 
              angle: -90, 
              position: 'insideLeft', 
              fontSize: 12
            }}
            domain={[0, 100]}
            tick={{ fontSize: isSmallMobile ? 10 : 12 }}
            tickMargin={isSmallMobile ? 2 : 5}
            width={isMobile ? 30 : 60}
          />
          
          {/* Шкала для времени активности (справа) */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#82ca9d" 
            label={isMobile ? { 
              value: 'Мин', 
              angle: -90, 
              position: 'insideRight', 
              fontSize: isSmallMobile ? 10 : 11,
              offset: isSmallMobile ? 0 : 5
            } : {
              value: 'Время активности (мин)', 
              angle: -90, 
              position: 'insideRight', 
              fontSize: 12
            }}
            tick={{ fontSize: isSmallMobile ? 10 : 12 }}
            tickMargin={isSmallMobile ? 2 : 5}
            width={isMobile ? 30 : 60}
          />
          
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Уровень депрессии') return [`${value}%`, name];
              if (name === 'Время чтения' || name === 'Время упражнений' || name === 'Общее время') {
                return [`${value} мин`, name];
              }
              return [value, name];
            }}
            labelFormatter={(label) => {
              const isTestDay = testDays.includes(label);
              return `${label}${isTestDay ? ' (пройден тест)' : ''}`;
            }}
            contentStyle={{ fontSize: isSmallMobile ? 10 : 12 }}
          />
          <Legend 
            wrapperStyle={{ fontSize: isSmallMobile ? 10 : 12 }}
            iconSize={isSmallMobile ? 8 : 10}
            verticalAlign={isSmallMobile ? 'bottom' : 'top'}
            height={isSmallMobile ? 36 : 30}
          />
          
          {/* Линия уровня депрессии */}
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="depressionPercentage" 
            name="Уровень депрессии" 
            stroke="#8884d8" 
            strokeWidth={isSmallMobile ? 1.5 : 2}
            activeDot={{ r: activeDotSize }} 
            connectNulls
            dot={<CustomDot />}
          />
          
          {/* Столбцы для времени чтения */}
          <Bar 
            yAxisId="right" 
            dataKey="readingTime" 
            name="Время чтения" 
            fill="#82ca9d" 
            opacity={0.8}
            barSize={calculateBarSize()}
          />
          
          {/* Столбцы для времени упражнений */}
          <Bar 
            yAxisId="right" 
            dataKey="exerciseTime" 
            name="Время упражнений" 
            fill="#ff9f7f"
            opacity={0.8}
            barSize={calculateBarSize()}
          />
          
          {/* Линия общего времени активности - скрываем на маленьких экранах */}
          {!isSmallMobile && (
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="totalActivityTime" 
              name="Общее время" 
              stroke="#ff7300"
              strokeWidth={isMobile ? 1.5 : 2}
              connectNulls
            />
          )}
          
          {/* Опциональные референсные линии для дней прохождения теста */}
          {!isSmallMobile && testDays.map((day, index) => (
            <ReferenceLine
              key={`test-day-${index}`}
              x={day}
              yAxisId="left"
              stroke="#8884d8"
              strokeDasharray="3 3"
              opacity={0.7}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendMarker} style={{ backgroundColor: '#8884d8' }}></span>
          <span>Дни прохождения опросника Бернса (раз в неделю)</span>
        </span>
      </div>
      
      {chartData.length === 1 && useRealData && (
        <div className={styles.singleDataPoint}>
          <p>Пройдите опросник Бернса через неделю, чтобы увидеть динамику изменений</p>
        </div>
      )}
    </div>
  );
};

export default ProgressChart; 
