import React, { useMemo } from 'react';
import { useAppSelector } from '../../redux/hooks';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  getDASData,
  formatDASDataForChart,
  getDASStats,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  getDASInterpretation
} from '../../utils/dasTrendUtils';
import { DASCategory } from '../Activities/DysfunctionalAttitudeScale/types';
import styles from './DASTrendChart.module.css';

interface DASTrendChartProps {
  height?: number;
  showStats?: boolean;
}

export const DASTrendChart: React.FC<DASTrendChartProps> = ({
  height = 400,
  showStats = true
}) => {
  const dasData = useAppSelector(getDASData);
  const stats = useAppSelector(getDASStats);

  const chartData = useMemo(() => formatDASDataForChart(dasData), [dasData]);

  // Все категории для отображения
  const categories = Object.values(DASCategory);

  if (dasData.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>Нет данных о шкале дисфункциональных убеждений</h3>
        <p>Пройдите тест, чтобы отследить динамику ваших убеждений</p>
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
      return `Ваши убеждения улучшились на ${absImprovement} баллов! 🎉`;
    } else if (stats.improvement < 0) {
      return `Показатели снизились на ${absImprovement} баллов. Продолжайте работать над убеждениями.`;
    } else {
      return 'Ваши убеждения стабильны';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipDate}>
          {new Date(data.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
        <div className={styles.tooltipCategories}>
          {categories.map(category => {
            const score = data[category];
            if (score === undefined) return null;

            return (
              <div key={category} className={styles.tooltipCategory}>
                <span
                  className={styles.tooltipCategoryDot}
                  style={{ backgroundColor: CATEGORY_COLORS[category] }}
                />
                <span className={styles.tooltipCategoryName}>
                  {CATEGORY_LABELS[category]}:
                </span>
                <span
                  className={styles.tooltipCategoryScore}
                  style={{
                    color: score >= 0 ? '#28a745' : '#dc3545'
                  }}
                >
                  {score > 0 ? '+' : ''}
                  {score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {getTrendIcon()} Динамика убеждений
        </h2>
        <p className={styles.subtitle}>
          График показывает изменение баллов по шкале дисфункциональных убеждений (7 категорий)
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
                style={{ color: getDASInterpretation(stats.latestScore).color }}
              >
                {stats.latestScore > 0 ? '+' : ''}
                {stats.latestScore}
              </div>
              <div className={styles.statLabel}>Последний балл</div>
            </div>
          )}

          {stats.averageScore !== null && (
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.averageScore > 0 ? '+' : ''}
                {stats.averageScore}
              </div>
              <div className={styles.statLabel}>Средний балл</div>
            </div>
          )}

          {stats.bestScore !== null && (
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: '#28a745' }}>
                {stats.bestScore > 0 ? '+' : ''}
                {stats.bestScore}
              </div>
              <div className={styles.statLabel}>Лучший результат</div>
            </div>
          )}
        </div>
      )}

      {stats.improvement !== null && (
        <div
          className={`${styles.trendMessage} ${
            stats.improvement > 0
              ? styles.improving
              : stats.improvement < 0
              ? styles.worsening
              : ''
          }`}
        >
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
              domain={[-10, 10]}
              label={{
                value: 'Баллы по категориям',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '0.875rem' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.875rem', paddingTop: '20px' }}
              formatter={(value) => CATEGORY_LABELS[value as DASCategory] || value}
            />

            {/* Нулевая линия (граница между здоровыми и дисфункциональными убеждениями) */}
            <ReferenceLine
              y={0}
              stroke="#6c757d"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: 'Нейтральная зона',
                position: 'right',
                fill: '#6c757d',
                fontSize: 12
              }}
            />

            {/* Линии для каждой категории */}
            {categories.map(category => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={CATEGORY_COLORS[category]}
                strokeWidth={2}
                dot={{ fill: CATEGORY_COLORS[category], r: 4 }}
                activeDot={{ r: 6 }}
                name={category}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        <h4>Интерпретация баллов:</h4>
        <div className={styles.legendItems}>
          {categories.map(category => (
            <div key={category} className={styles.legendItem}>
              <span
                className={styles.legendColor}
                style={{ backgroundColor: CATEGORY_COLORS[category] }}
              />
              <span>{CATEGORY_LABELS[category]}</span>
            </div>
          ))}
        </div>
        <div className={styles.interpretationNote}>
          <p>
            <strong>Положительные баллы (0 до +10):</strong> Здоровые убеждения, сила
          </p>
          <p>
            <strong>Отрицательные баллы (0 до -10):</strong> Дисфункциональные убеждения,
            слабость
          </p>
        </div>
      </div>
    </div>
  );
};
