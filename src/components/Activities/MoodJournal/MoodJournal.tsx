import React, { useState, useMemo } from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult, ThreeColumnsExercise } from '../ThreeColumnsBase/types';
import { SpecialContent } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import journalStyles from './MoodJournal.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { useDailyProgress } from '../../../redux/hooks';
import { getAllRecordsFromProgress } from '../../../utils/recordsUtils';

const SHEET_ID: SpecialContent = ACTIVITY_IDS.MOOD_JOURNAL;

interface EmotionEntry {
  name: string;
  score: number;
}

const MoodJournal: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();

  const [situation, setSituation] = useState('');
  const [emotions, setEmotions] = useState<EmotionEntry[]>([{ name: '', score: 50 }]);
  const [resultFeeling, setResultFeeling] = useState<string>('');

  // Получаем историю для отображения ситуаций и эмоций из метаданных
  const allRecords = useMemo(() => {
    return getAllRecordsFromProgress<any>(
      dailyProgress,
      [ACTIVITY_IDS.MOOD_JOURNAL],
      SHEET_ID
    );
  }, [dailyProgress]);

  const actionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  const addEmotion = () => {
    setEmotions([...emotions, { name: '', score: 50 }]);
  };

  const removeEmotion = (index: number) => {
    if (emotions.length > 1) {
      setEmotions(emotions.filter((_, i) => i !== index));
    }
  };

  const updateEmotion = (index: number, field: 'name' | 'score', value: string | number) => {
    const updated = [...emotions];
    updated[index] = { ...updated[index], [field]: value };
    setEmotions(updated);
  };

  const handleSave = (result: ThreeColumnsMethodResult) => {
    const exercise: ThreeColumnsExercise = {
      ...createBaseExercise(SHEET_ID, result.id),
      records: result.records,
      metadata: {
        situation,
        emotions: JSON.stringify(emotions.filter(e => e.name.trim())),
        resultFeeling: resultFeeling,
      }
    };

    dispatch(addExercise({
      exercise,
      showNotification: false
    }));
  };

  return (
    <div className={journalStyles.wrapper}>
      {/* Заголовок с кнопками */}
      <div className={styles.titleContainer}>
        <h2>Журнал настроения</h2>
        {actionButtons}
      </div>

      {/* Верхняя секция: Ситуация */}
      <div className={journalStyles.section}>
        <h3 className={journalStyles.sectionTitle}>Опишите ситуацию</h3>
        <textarea
          className={journalStyles.situationInput}
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Опишите, что вас расстраивает. Например: «Кэти отклонила моё предложение»"
          rows={3}
        />
      </div>

      {/* Верхняя секция: Негативные чувства */}
      <div className={journalStyles.section}>
        <h3 className={journalStyles.sectionTitle}>Негативные чувства</h3>
        <p className={journalStyles.sectionHint}>
          Запишите свои чувства и оцените их от 1 (самое слабое) до 100 (самое сильное).
          Используйте такие слова, как «грусть», «тревога», «злость», «вина», «одиночество», «безнадежность», «фрустрация».
        </p>
        <div className={journalStyles.emotionsList}>
          {emotions.map((emotion, index) => (
            <div key={index} className={journalStyles.emotionRow}>
              <span className={journalStyles.emotionNumber}>{index + 1}.</span>
              <input
                type="text"
                className={journalStyles.emotionName}
                value={emotion.name}
                onChange={(e) => updateEmotion(index, 'name', e.target.value)}
                placeholder="Название чувства"
              />
              <input
                type="number"
                className={journalStyles.emotionScore}
                value={emotion.score}
                onChange={(e) => updateEmotion(index, 'score', Math.min(100, Math.max(1, Number(e.target.value))))}
                min={1}
                max={100}
              />
              {emotions.length > 1 && (
                <button
                  className={journalStyles.removeEmotionBtn}
                  onClick={() => removeEmotion(index)}
                  title="Удалить"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            className={journalStyles.addEmotionBtn}
            onClick={addEmotion}
          >
            + Добавить чувство
          </button>
        </div>
      </div>

      {/* Основная секция: Метод трёх колонок */}
      <ThreeColumnsBase
        title="Работа с мыслями"
        description={
          "Запишите негативные автоматические мысли в левой колонке. " +
          "Определите когнитивные искажения в каждой из них. " +
          "Напишите более реалистичные и позитивные мысли в правой колонке."
        }
        leftColumnTitle="Автоматические мысли"
        leftColumnPlaceholder="Например: «Я не смогу без неё жить»"
        rightColumnTitle="Рациональные ответы"
        rightColumnPlaceholder="Например: «Отказ приносит разочарование. Мне обидно, но это не значит, что жизнь кончена!»"
        showCognitiveDistortions={true}
        methodId={SHEET_ID}
        onSave={handleSave}
      />

      {/* Нижняя секция: Результат */}
      <div className={journalStyles.section}>
        <h3 className={journalStyles.sectionTitle}>Результат</h3>
        <p className={journalStyles.sectionHint}>
          Перечитайте свои рациональные ответы и отметьте, как вы себя чувствуете сейчас:
        </p>
        <div className={journalStyles.resultOptions}>
          {['совсем не лучше', 'немного лучше', 'лучше', 'намного лучше'].map((option) => (
            <label key={option} className={journalStyles.resultOption}>
              <input
                type="radio"
                name="resultFeeling"
                value={option}
                checked={resultFeeling === option}
                onChange={(e) => setResultFeeling(e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodJournal;
