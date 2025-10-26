import React, { useMemo } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getMoodTrendData, formatMoodDataForChart, getMoodStats, getBurnsInterpretation } from '../../utils/moodTrendUtils';
import styles from './MoodTrendChart.module.css';

interface MoodTrendChartProps {
  height?: number;
  showStats?: boolean;
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({
  height = 400,
  showStats = true
}) => {
  const moodData = useAppSelector(getMoodTrendData);
  const stats = useAppSelector(getMoodStats);

  const chartData = useMemo(() => formatMoodDataForChart(moodData), [moodData]);

  if (moodData.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>Нет данных о настроении</h3>
        <p>Пройдите тест Бернса, чтобы отследить динамику вашего настроения</p>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'improving':
        return '📈';
      case 'worsening':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '📊';
    }
  };

  const getTrendMessage = () => {
    if (!stats.improvement) return 'Недостаточно данных для анализа тренда';

    const absImprovement = Math.abs(stats.improvement);
    if (stats.improvement > 0) {
      return `Ваше настроение улучшилось на ${absImprovement} баллов! 🎉`;
    } else if (stats.improvement < 0) {
      return `Настроение снизилось на ${absImprovement} баллов. Продолжайте практиковать упражнения.`;
    } else {
      return 'Ваше настроение стабильно';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const interpretation = getBurnsInterpretation(data.score);

    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipDate}>
          {new Date(data.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
        <p className={styles.tooltipScore}>
          <strong>Балл:</strong> {data.score} из {data.maxScore}
        </p>
        <p className={styles.tooltipInterpretation} style={{ color: interpretation.color }}>
          {interpretation.label}
        </p>
        <p className={styles.tooltipTest}>Тест #{data.index}</p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {getTrendIcon()} Динамика настроения
        </h2>
        <p className={styles.subtitle}>
          График показывает изменение баллов по опроснику депрессии Бернса
        </p>
      </div>

      {showStats && (
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalTests}</div>
            <div className={styles.statLabel}>Тестов пройдено</div>
          </div>

          {stats.latestScore !== null && (
            <div className={styles.statCard}>
              <div
                className={styles.statValue}
                style={{ color: getBurnsInterpretation(stats.latestScore).color }}
              >
                {stats.latestScore}
              </div>
              <div className={styles.statLabel}>Последний балл</div>
            </div>
          )}

          {stats.averageScore !== null && (
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.averageScore}</div>
              <div className={styles.statLabel}>Средний балл</div>
            </div>
          )}

          {stats.bestScore !== null && (
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: '#28a745' }}>
                {stats.bestScore}
              </div>
              <div className={styles.statLabel}>Лучший результат</div>
            </div>
          )}
        </div>
      )}

      {stats.improvement !== null && (
        <div className={`${styles.trendMessage} ${stats.improvement > 0 ? styles.improving : stats.improvement < 0 ? styles.worsening : ''}`}>
          {getTrendMessage()}
        </div>
      )}

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              stroke="#666"
              style={{ fontSize: '0.875rem' }}
            />
            <YAxis
              stroke="#666"
              style={{ fontSize: '0.875rem' }}
              domain={[0, 60]}
              label={{ value: 'Балл депрессии', angle: -90, position: 'insideLeft', style: { fontSize: '0.875rem' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.875rem' }}
              formatter={(value) => value === 'score' ? 'Балл по шкале Бернса' : value}
            />

            {/* Reference lines для интерпретации */}
            <ReferenceLine y={5} stroke="#28a745" strokeDasharray="3 3" label={{ value: 'Норма', position: 'right', fill: '#28a745', fontSize: 12 }} />
            <ReferenceLine y={10} stroke="#90EE90" strokeDasharray="3 3" />
            <ReferenceLine y={25} stroke="#ffc107" strokeDasharray="3 3" label={{ value: 'Умеренная', position: 'right', fill: '#ffc107', fontSize: 12 }} />
            <ReferenceLine y={45} stroke="#fd7e14" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ fill: '#667eea', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        <h4>Интерпретация баллов:</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: '#28a745' }}></span>
            <span>0-5: Минимальная или отсутствует</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: '#90EE90' }}></span>
            <span>6-10: Легкая депрессия</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: '#ffc107' }}></span>
            <span>11-25: Умеренная депрессия</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: '#fd7e14' }}></span>
            <span>26-45: Тяжелая депрессия</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: '#dc3545' }}></span>
            <span>46-60: Крайне тяжелая депрессия</span>
          </div>
        </div>
      </div>
    </div>
  );
};
