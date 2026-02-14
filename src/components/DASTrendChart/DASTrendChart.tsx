import React, { useMemo, useState } from 'react';
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
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
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

type ViewMode = 'trend' | 'comparison';

interface DASTrendChartProps {
  height?: number;
  showStats?: boolean;
}

export const DASTrendChart: React.FC<DASTrendChartProps> = ({
  height = 400,
  showStats = true
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('trend');

  const dasData = useAppSelector(getDASData);
  const stats = useAppSelector(getDASStats);

  const chartData = useMemo(() => formatDASDataForChart(dasData), [dasData]);

  // Все категории для отображения
  const categories = Object.values(DASCategory);

  // Данные для радиальной диаграммы: последний и предпоследний тесты
  const radarData = useMemo(() => {
    if (dasData.length < 1) return null;

    const latest = dasData[dasData.length - 1];
    const previous = dasData.length >= 2 ? dasData[dasData.length - 2] : null;

    // Recharts RadarChart нуждается в положительных значениях для радиуса,
    // поэтому сдвигаем шкалу: [-10..+10] → [0..20]
    return categories.map(category => {
      const latestCat = latest.categoryResults.find(
        (c: any) => c.category === category
      );
      const previousCat = previous?.categoryResults.find(
        (c: any) => c.category === category
      );

      return {
        category: CATEGORY_LABELS[category],
        latest: (latestCat?.score ?? 0) + 10,
        latestRaw: latestCat?.score ?? 0,
        ...(previous
          ? {
              previous: (previousCat?.score ?? 0) + 10,
              previousRaw: previousCat?.score ?? 0
            }
          : {})
      };
    });
  }, [dasData, categories]);

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

      <div className={styles.viewTabs}>
        <button
          className={`${styles.viewTab} ${viewMode === 'trend' ? styles.viewTabActive : ''}`}
          onClick={() => setViewMode('trend')}
        >
          Динамика
        </button>
        <button
          className={`${styles.viewTab} ${viewMode === 'comparison' ? styles.viewTabActive : ''}`}
          onClick={() => setViewMode('comparison')}
        >
          Сравнение
        </button>
      </div>

      {viewMode === 'trend' ? (
        <>
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
        </>
      ) : (
        <div className={styles.comparisonChart}>
          {radarData ? (
            <>
              <p className={styles.comparisonHint}>
                {dasData.length >= 2
                  ? 'Яркая область — последний тест, блеклая — предыдущий'
                  : 'Результаты последнего теста (пройдите ещё один для сравнения)'}
              </p>
              <ResponsiveContainer width="100%" height={height}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 13, fill: '#495057' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 20]}
                    tick={false}
                    axisLine={false}
                  />

                  {/* Предыдущий тест — блеклый */}
                  {dasData.length >= 2 && (
                    <Radar
                      name="Предыдущий"
                      dataKey="previous"
                      stroke="#667eea"
                      fill="#667eea"
                      strokeWidth={1.5}
                      strokeOpacity={0.35}
                      fillOpacity={0.1}
                    />
                  )}

                  {/* Последний тест — яркий */}
                  <Radar
                    name="Последний"
                    dataKey="latest"
                    stroke="#667eea"
                    fill="#667eea"
                    strokeWidth={2.5}
                    strokeOpacity={1}
                    fillOpacity={0.35}
                  />

                  <Tooltip
                    formatter={(value: number, name: string, props: any) => {
                      const rawKey = name === 'Последний' ? 'latestRaw' : 'previousRaw';
                      const raw = props.payload[rawKey];
                      return [`${raw > 0 ? '+' : ''}${raw}`, name];
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className={styles.comparisonLegend}>
                <div className={styles.comparisonLegendItem}>
                  <span
                    className={styles.comparisonLegendDot}
                    style={{ backgroundColor: '#667eea' }}
                  />
                  <span>Последний тест</span>
                </div>
                {dasData.length >= 2 && (
                  <div className={styles.comparisonLegendItem}>
                    <span
                      className={styles.comparisonLegendDot}
                      style={{ backgroundColor: '#667eea', opacity: 0.3 }}
                    />
                    <span>Предыдущий тест</span>
                  </div>
                )}
              </div>
              <div className={styles.interpretationNote}>
                <p>
                  <strong>Центр диаграммы:</strong> -10 (дисфункциональные убеждения)
                </p>
                <p>
                  <strong>Край диаграммы:</strong> +10 (здоровые убеждения)
                </p>
              </div>
            </>
          ) : (
            <div className={styles.noComparisonData}>
              Нет данных для сравнения. Пройдите тест.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
