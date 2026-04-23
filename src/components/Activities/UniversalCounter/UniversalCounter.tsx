import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './UniversalCounter.module.css';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { CounterClick, UniversalCounterExercise } from './types';
import { counterConfigs } from './counterConfigs';
import { Exercise } from '../../../types/progress.types';
import { DayProgress } from '../../../redux/types';
import { ActivityId } from '../../../constants/activities';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate, getCurrentISOTimestamp, formatDateWithOptions, compareDatesDesc } from '../../../utils/dateUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';

interface UniversalCounterProps {
  counterId: ActivityId;
}

function findCounterExercise(
  dayProgress: DayProgress | undefined,
  counterId: ActivityId
): UniversalCounterExercise | undefined {
  return dayProgress?.exercises.exercises.find(
    (ex: Exercise): ex is UniversalCounterExercise =>
      ex.type === counterId && ex.id === counterId
  );
}

const UniversalCounter: React.FC<UniversalCounterProps> = ({ counterId }) => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [animating, setAnimating] = useState(false);

  const config = counterConfigs[counterId];

  const todayClicks = useMemo(() => {
    const exercise = findCounterExercise(dailyProgress[getCurrentDate()], counterId);
    return exercise?.clicks || [];
  }, [dailyProgress, counterId]);

  const trendData = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    const today = new Date();

    for (let i = 20; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const exercise = findCounterExercise(dailyProgress[dateStr], counterId);
      const count = exercise?.clicks?.length || 0;
      if (count > 0 || i <= 6) {
        days.push({
          date: formatDateWithOptions(dateStr, { day: 'numeric', month: 'short' }),
          count,
        });
      }
    }

    return days;
  }, [dailyProgress, counterId]);

  const hasTrendData = trendData.some(d => d.count > 0);

  const pastDays = useMemo(() => {
    const currentDate = getCurrentDate();

    return Object.entries(dailyProgress)
      .filter(([date]) => date !== currentDate)
      .sort(([a], [b]) => compareDatesDesc(a, b))
      .reduce<{ date: string; clicks: CounterClick[] }[]>((result, [date, progress]) => {
        const exercise = findCounterExercise(progress, counterId);
        if (exercise?.clicks?.length) {
          result.push({ date, clicks: exercise.clicks });
        }
        return result;
      }, [])
      .slice(0, 14);
  }, [dailyProgress, counterId]);

  const saveToProgress = (updatedClicks: CounterClick[]) => {
    dispatch(addExercise({
      exercise: { ...createBaseExercise(counterId), clicks: updatedClicks },
      showNotification: false,
    }));
  };

  const handleClick = () => {
    const trimmedNote = note.trim();
    const newClick: CounterClick = {
      id: uuidv4(),
      timestamp: getCurrentISOTimestamp(),
      ...(trimmedNote && { note: trimmedNote }),
    };
    saveToProgress([...todayClicks, newClick]);
    setNote('');
    setShowNote(false);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  const removeClick = (id: string) => {
    saveToProgress(todayClicks.filter(c => c.id !== id));
  };

  if (!config) return null;

  const isPositive = config.type === 'positive';

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>{config.title}</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={counterId} />
          <FavoriteButton activityId={counterId} />
        </div>
      </div>

      <div className={styles.description}>
        <p>{config.description}</p>
        <div className={styles.tips}>
          <h4>Рекомендации:</h4>
          <ul>
            {config.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Блок счётчика */}
      <div className={styles.counterSection}>
        <div className={`${styles.countDisplay} ${animating ? styles.pulse : ''}`}>
          <span className={styles.countNumber}>{todayClicks.length}</span>
          <span className={styles.countLabel}>сегодня</span>
        </div>

        <button
          className={`${styles.counterButton} ${isPositive ? styles.positive : styles.awareness}`}
          onClick={handleClick}
        >
          {config.buttonLabel}
        </button>

        <button
          className={styles.noteToggle}
          onClick={() => setShowNote(!showNote)}
        >
          {showNote ? 'Скрыть заметку' : 'Добавить заметку'}
        </button>

        {showNote && (
          <div className={styles.noteInput}>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClick()}
              placeholder={config.placeholder}
              className={styles.input}
            />
          </div>
        )}
      </div>

      {/* График тренда */}
      {hasTrendData && (
        <div className={styles.section}>
          <h3>Тренд за последние дни</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={30} />
                <Tooltip
                  formatter={(value: number) => [`${value}`, 'Нажатий']}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={isPositive ? '#27ae60' : '#e67e22'}
                  fill={isPositive ? 'rgba(39, 174, 96, 0.2)' : 'rgba(230, 126, 34, 0.2)'}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Сегодняшние записи */}
      {todayClicks.length > 0 && (
        <div className={styles.section}>
          <h3>Записи за сегодня</h3>
          <div className={styles.clicksList}>
            {todayClicks.map((click, index) => (
              <div key={click.id} className={styles.clickItem}>
                <span className={styles.clickNumber}>{index + 1}.</span>
                <span className={styles.clickTime}>
                  {new Date(click.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {click.note && <span className={styles.clickNote}>{click.note}</span>}
                <button
                  onClick={() => removeClick(click.id)}
                  className={styles.removeButton}
                  aria-label="Удалить"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* История прошлых дней */}
      {pastDays.length > 0 && (
        <div className={styles.section}>
          <h3>История</h3>
          <div className={styles.historyList}>
            {pastDays.map(({ date, clicks }) => (
              <div key={date} className={styles.historyDay}>
                <div className={styles.historyHeader}>
                  <span className={styles.historyDate}>
                    {formatDateWithOptions(date, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className={styles.historyCount}>{clicks.length} нажатий</span>
                </div>
                {clicks.some(c => c.note) && (
                  <div className={styles.historyNotes}>
                    {clicks.filter(c => c.note).map(c => (
                      <div key={c.id} className={styles.historyNote}>
                        {c.note}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.motivation}>
        <p>{config.motivation}</p>
      </div>
    </div>
  );
};

export default UniversalCounter;
