import { useState, useMemo } from 'react';
import styles from './ThoughtDiary.module.css';
import { ThoughtInput } from './ThoughtInput/ThoughtInput';
import { ThoughtRecord, AutomaticThought } from './types';
import { RecordsList } from './RecordsList/RecordsList';
import { SituationInput } from './SituationInput/SituationInput';
import { EmotionsSection } from './EmotionsSection/EmotionsSection';
import { useProgress } from '../../../store/ProgressContext';
import { ThoughtDiaryRecord } from '../../../types/progress.types';

const DIARY_ID = 'thought-diary';

// TODO валидация перед сохранением, стили, сохранение 

const ThoughtDiary: React.FC = () => {
  const { progress, dispatch } = useProgress();
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

  // Получаем все записи из прогресса
  const allRecords = useMemo(() => {
    if (!progress?.dailyProgress) return [];
    
    const allDayRecords: Array<ThoughtDiaryRecord & { date: string }> = [];
    
    Object.entries(progress.dailyProgress).forEach(([date, dayProgress]) => {
      const exercises = dayProgress.exercises.exercises || [];
      exercises
        .filter(exercise => exercise.type === 'thought-diary' && exercise.id === DIARY_ID)
        .forEach(exercise => {
          if ('records' in exercise) {
            allDayRecords.push(...exercise.records.map(record => ({
              ...record,
              date
            })));
          }
        });
    });
    
    // Сортируем по дате и времени (новые сверху)
    return allDayRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [progress]);

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
        timestamp: new Date().toISOString()
      };

      // Получаем текущую дату
      const today = new Date().toISOString().split('T')[0];
      
      // Получаем существующие записи за сегодня
      const todayExercise = progress?.dailyProgress[today]?.exercises.exercises?.find(
        exercise => exercise.type === 'thought-diary' && exercise.id === DIARY_ID
      );
      
      // Объединяем существующие записи с новой
      const updatedRecords = todayExercise && 'records' in todayExercise
        ? [...todayExercise.records, newRecord]
        : [newRecord];

      // Сохраняем в редюсер
      dispatch({
        type: 'SAVE_EXERCISE',
        exercise: {
          type: 'thought-diary',
          id: DIARY_ID,
          name: 'Дневник автоматических мыслей',
          completed: true,
          completedAt: new Date().toISOString(),
          records: updatedRecords
        }
      });

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
      <h2>Дневник автоматических мыслей</h2>

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
