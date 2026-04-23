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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  getIntimacyData,
  formatIntimacyDataForChart,
  getIntimacyStats,
  INTIMACY_CATEGORY_COLORS,
  INTIMACY_CATEGORY_LABELS,
  getIntimacyInterpretation,
  MAX_CATEGORY_SCORE
} from '../../utils/intimacyTrendUtils';
import { IntimacyCategory } from '../Activities/IntimacyScale/types';
import styles from '../DASTrendChart/DASTrendChart.module.css';

type ViewMode = 'trend' | 'comparison';

const categories = Object.values(IntimacyCategory);

interface IntimacyTrendChartProps {
  height?: number;
  showStats?: boolean;
}

export const IntimacyTrendChart: React.FC<IntimacyTrendChartProps> = ({
  height = 400,
  showStats = true
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('trend');

  const intimacyData = useAppSelector(getIntimacyData);
  const stats = useAppSelector(getIntimacyStats);

  const chartData = useMemo(() => formatIntimacyDataForChart(intimacyData), [intimacyData]);

  const radarData = useMemo(() => {
    if (intimacyData.length < 1) return null;

    const latest = intimacyData[intimacyData.length - 1];
    const previous = intimacyData.length >= 2 ? intimacyData[intimacyData.length - 2] : null;

    return categories.map(category => {
      const latestCat = latest.categoryResults.find(
        c => c.category === category
      );
      const previousCat = previous?.categoryResults.find(
        c => c.category === category
      );

      return {
        category: INTIMACY_CATEGORY_LABELS[category],
        latest: MAX_CATEGORY_SCORE - (latestCat?.score ?? 0),
        ...(previous
          ? { previous: MAX_CATEGORY_SCORE - (previousCat?.score ?? 0) }
          : {})
      };
    });
  }, [intimacyData]);

  if (intimacyData.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>Нет данных теста на способность к близости</h3>
        <p>Пройдите тест, чтобы отследить динамику</p>
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
      return `Ваши показатели улучшились на ${absImprovement} баллов! 🎉`;
    } else if (stats.improvement < 0) {
      return `Показатели выросли на ${absImprovement} баллов. Продолжайте работать над собой.`;
    } else {
      return 'Ваши показатели стабильны';
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
            const invertedScore = data[category];
            if (invertedScore === undefined) return null;

            const rawScore = data[`${category}_raw`] as number;

            return (
              <div key={category} className={styles.tooltipCategory}>
                <span
                  className={styles.tooltipCategoryDot}
                  style={{ backgroundColor: INTIMACY_CATEGORY_COLORS[category] }}
                />
                <span className={styles.tooltipCategoryName}>
                  {INTIMACY_CATEGORY_LABELS[category]}:
                </span>
                <span
                  className={styles.tooltipCategoryScore}
                  style={{
                    color: invertedScore >= 8 ? '#28a745' : invertedScore >= 4 ? '#ffc107' : '#dc3545'
                  }}
                >
                  {invertedScore}/{MAX_CATEGORY_SCORE}
                </span>
                <span style={{ color: '#999', fontSize: '0.75rem', marginLeft: 4 }}>
                  (исх. {rawScore})
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
          {getTrendIcon()} Динамика способности к близости
        </h2>
        <p className={styles.subtitle}>
          График показывает изменение способности к близости по 15 категориям (выше = лучше)
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
                style={{ color: getIntimacyInterpretation(stats.latestScore).color }}
              >
                {stats.latestScore}
              </div>
              <div className={styles.statLabel}>Последний балл</div>
            </div>
          )}

          {stats.averageScore !== null && (
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.averageScore}
              </div>
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
        <div
          className={[
            styles.trendMessage,
            stats.improvement > 0 && styles.improving,
            stats.improvement < 0 && styles.worsening,
          ].filter(Boolean).join(' ')}
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
                  domain={[0, MAX_CATEGORY_SCORE]}
                  label={{
                    value: 'Способность к близости',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: '0.875rem' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '0.75rem', paddingTop: '20px' }}
                  formatter={(value) => INTIMACY_CATEGORY_LABELS[value as IntimacyCategory] || value}
                />

                {categories.map(category => (
                  <Line
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={INTIMACY_CATEGORY_COLORS[category]}
                    strokeWidth={2}
                    dot={{ fill: INTIMACY_CATEGORY_COLORS[category], r: 4 }}
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
                    style={{ backgroundColor: INTIMACY_CATEGORY_COLORS[category] }}
                  />
                  <span>{INTIMACY_CATEGORY_LABELS[category]}</span>
                </div>
              ))}
            </div>
            <div className={styles.interpretationNote}>
              <p>
                <strong>Высокие баллы (8–12):</strong> Здоровые установки, хорошая способность к близости
              </p>
              <p>
                <strong>Низкие баллы (0–4):</strong> Установки, мешающие близости
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.comparisonChart}>
          {radarData ? (
            <>
              <p className={styles.comparisonHint}>
                {intimacyData.length >= 2
                  ? 'Яркая область — последний тест, блеклая — предыдущий'
                  : 'Результаты последнего теста (пройдите ещё один для сравнения)'}
              </p>
              <ResponsiveContainer width="100%" height={height}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: '#495057' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, MAX_CATEGORY_SCORE]}
                    tick={false}
                    axisLine={false}
                  />

                  {intimacyData.length >= 2 && (
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
                    formatter={(value: number, name: string) => {
                      return [value, name];
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
                {intimacyData.length >= 2 && (
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
                  <strong>Край диаграммы:</strong> {MAX_CATEGORY_SCORE} (здоровые установки)
                </p>
                <p>
                  <strong>Центр диаграммы:</strong> 0 (серьёзные трудности)
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
