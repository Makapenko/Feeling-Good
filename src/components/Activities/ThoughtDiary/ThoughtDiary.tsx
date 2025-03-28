import { useState, useMemo } from 'react';
import styles from './ThoughtDiary.module.css';
import { ThoughtInput } from './ThoughtInput/ThoughtInput';
import { AutomaticThought } from './types';
import { RecordsList } from './RecordsList/RecordsList';
import { SituationInput } from './SituationInput/SituationInput';
import { EmotionsSection } from './EmotionsSection/EmotionsSection';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { ThoughtDiaryRecord, ThoughtDiaryExercise } from '../../../types/progress.types';
import ActivityTimer from '../ActivityTimer/ActivityTimer';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { getCurrentDate, getCurrentISOTimestamp } from '../../../utils/dateUtils';
import { getAllRecordsFromProgress } from '../../../utils/recordsUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';

const SHEET_ID = ACTIVITY_IDS.THOUGHT_DIARY;

// TODO валидация перед сохранением, стили, сохранение 

const ThoughtDiary: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  const [currentRecord, setCurrentRecord] = useState<Omit<ThoughtDiaryRecord, 'timestamp'>>({
    situation: '',
    emotions: [],
    automaticThoughts: [{
      thought: '',
      cognitiveDistortions: [],
      rationalResponse: ''
    }],
    result: {
      emotions: []
    }
  });

  // Получаем все записи из прогресса, используя новую утилиту
  const allRecords = useMemo(() => {
    // Фильтр для проверки правильного формата записей
    const filterValidRecord = (record: unknown): record is ThoughtDiaryRecord => {
      return typeof record === 'object' && 
        record !== null && 
        'situation' in record &&
        'emotions' in record &&
        'automaticThoughts' in record &&
        'result' in record;
    };
    
    return getAllRecordsFromProgress<ThoughtDiaryRecord>(
      dailyProgress,
      ACTIVITY_IDS.THOUGHT_DIARY,
      SHEET_ID,
      filterValidRecord
    );
  }, [dailyProgress]);

  const [newEmotion, setNewEmotion] = useState({ name: '', intensity: 0 });
  const [resultEmotion, setResultEmotion] = useState({ name: '', intensity: 0 });

  const [showValidation, setShowValidation] = useState(false);

  const getValidationErrors = () => {
    const errors: string[] = [];

    if (!currentRecord.situation) {
      errors.push('ситуация');
    }
    if (currentRecord.emotions.length === 0) {
      errors.push('эмоции');
    }

    const invalidThoughts = currentRecord.automaticThoughts.reduce((acc, thought, index) => {
      if (!thought.thought) {
        acc.push(`мысль ${index + 1}`);
      }
      if (thought.cognitiveDistortions.length === 0) {
        acc.push(`когнитивные искажения для мысли ${index + 1}`);
      }
      if (!thought.rationalResponse) {
        acc.push(`рациональный ответ для мысли ${index + 1}`);
      }
      return acc;
    }, [] as string[]);

    return [...errors, ...invalidThoughts];
  };

  const handleSaveAttempt = () => {
    const errors = getValidationErrors();
    if (errors.length === 0) {
      handleAddRecord();
    } else {
      setShowValidation(true);
    }
  };

  const handleAddEmotion = () => {
    if (newEmotion.name) {
      setCurrentRecord(prev => ({
        ...prev,
        emotions: [...prev.emotions, newEmotion]
      }));
      setNewEmotion({ name: '', intensity: 0 });
    }
  };

  const handleAddResultEmotion = () => {
    if (resultEmotion.name) {
      setCurrentRecord(prev => ({
        ...prev,
        result: {
          emotions: [...prev.result.emotions, resultEmotion]
        }
      }));
      setResultEmotion({ name: '', intensity: 0 });
    }
  };

  const handleEditEmotion = (index: number) => {
    const emotionToEdit = currentRecord.emotions[index];
    setNewEmotion(emotionToEdit);
    setCurrentRecord(prev => ({
      ...prev,
      emotions: prev.emotions.filter((_, i) => i !== index)
    }));
  };

  const handleEditResultEmotion = (index: number) => {
    const emotionToEdit = currentRecord.result.emotions[index];
    setResultEmotion(emotionToEdit);
    setCurrentRecord(prev => ({
      ...prev,
      result: {
        emotions: prev.result.emotions.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddRecord = () => {
    if (
      currentRecord.situation &&
      currentRecord.emotions.length > 0 &&
      currentRecord.automaticThoughts[0].thought &&
      currentRecord.automaticThoughts[0].cognitiveDistortions.length > 0 &&
      currentRecord.automaticThoughts[0].rationalResponse
    ) {
      const newRecord: ThoughtDiaryRecord = {
        ...currentRecord,
        timestamp: getCurrentISOTimestamp()
      };

      // Получаем текущую дату
      const today = getCurrentDate();

      // Получаем существующие записи за сегодня
      const todayExercise = dailyProgress[today]?.exercises.exercises?.find(
        exercise => exercise.type === ACTIVITY_IDS.THOUGHT_DIARY && exercise.id === SHEET_ID
      );

      // Фильтруем существующие записи, чтобы убедиться, что они правильного типа
      let existingRecords: ThoughtDiaryRecord[] = [];
      if (todayExercise && 'records' in todayExercise && todayExercise.type === ACTIVITY_IDS.THOUGHT_DIARY) {
        // Сначала приводим к unknown, затем фильтруем
        const records = todayExercise.records as unknown as Record<string, unknown>[];
        existingRecords = records.filter(record =>
          'situation' in record &&
          'emotions' in record &&
          'automaticThoughts' in record &&
          'result' in record
        ) as unknown as ThoughtDiaryRecord[];
      }

      // Объединяем с новой записью
      const updatedRecords: ThoughtDiaryRecord[] = [...existingRecords, newRecord];

      // Создаем объект упражнения
      const exercise: ThoughtDiaryExercise = {
        ...createBaseExercise(SHEET_ID),
        records: updatedRecords
      };

      // Сохраняем в Redux
      dispatch(addExercise({ 
        exercise, 
        showNotification: false 
      }));

      // Очищаем форму
      setCurrentRecord({
        situation: '',
        emotions: [],
        automaticThoughts: [{
          thought: '',
          cognitiveDistortions: [],
          rationalResponse: ''
        }],
        result: {
          emotions: []
        }
      });
      setShowValidation(false);
    }
  };

  const handleAddThought = () => {
    setCurrentRecord(prev => ({
      ...prev,
      automaticThoughts: [
        ...prev.automaticThoughts,
        {
          thought: '',
          cognitiveDistortions: [],
          rationalResponse: ''
        }
      ]
    }));
  };

  const handleUpdateThought = (field: keyof AutomaticThought, value: string | string[], index: number) => {
    setCurrentRecord(prev => ({
      ...prev,
      automaticThoughts: prev.automaticThoughts.map((thought, i) =>
        i === index
          ? { ...thought, [field]: value }
          : thought
      )
    }));
  };

  const handleDeleteThought = (index: number) => {
    setCurrentRecord(prev => ({
      ...prev,
      automaticThoughts: prev.automaticThoughts.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.container}>
      <ActivityTimer activityId={SHEET_ID} />
      <div className={styles.titleContainer}>
        <h2>Дневник автоматических мыслей</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>

      <div className={styles.diaryGrid}>
        {/* Первая строка: Ситуация и эмоции */}
        <div className={styles.topRow}>
          <SituationInput
            situation={currentRecord.situation}
            onChange={(situation) => setCurrentRecord({
              ...currentRecord,
              situation
            })}
            isValid={!!currentRecord.situation}
            showValidation={showValidation}
          />

          <EmotionsSection
            title="Эмоции"
            titleTooltip="1. Определите характер эмоции: грусть, волнение, злость и т.д. 2. Оцените интенсивность эмоции от 1 до 100%"

            emotion={newEmotion}
            emotions={currentRecord.emotions}
            onEmotionChange={setNewEmotion}
            onAdd={handleAddEmotion}
            onEdit={handleEditEmotion}
          />
        </div>

        {/* Вторая строка: Мысли, искажения, ответ */}
        <div className={styles.middleRow}>
          <div className={styles.thoughtsSection}>
            <ThoughtInput
              thoughts={currentRecord.automaticThoughts}
              onThoughtChange={handleUpdateThought}
              onAddThought={handleAddThought}
              onDeleteThought={handleDeleteThought}
            />
          </div>
        </div>

        {/* Третья строка: Результат */}
        <div className={styles.bottomRow}>
          <EmotionsSection
            title="Результат"
            titleTooltip="Определите ваши эмоции и их интенсивность после проведенной работы от 0 до 100%"
            emotion={resultEmotion}
            emotions={currentRecord.result.emotions}
            onEmotionChange={setResultEmotion}
            onAdd={handleAddResultEmotion}
            onEdit={handleEditResultEmotion}
          />
        </div>
      </div>

      <button
        className={styles.addButton}
        onClick={handleSaveAttempt}
      >
        Сохранить запись
      </button>

      {showValidation && getValidationErrors().length > 0 && (
        <div className={styles.validationSummary}>
          Пожалуйста, заполните следующие поля: {getValidationErrors().join(', ')}
        </div>
      )}

      <RecordsList records={allRecords} />
    </div>
  );
};

export default ThoughtDiary
