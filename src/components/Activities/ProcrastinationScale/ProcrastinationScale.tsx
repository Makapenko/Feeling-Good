import { useAppDispatch } from "../../../redux/hooks";
import Survey from "../Survey/Survey";
import { procrastinationConfig } from "./procrastinationConfig";
import { SurveyResult } from "../Survey/types";
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import styles from '../Survey/Survey.module.css';
import FavoriteButton from '../../shared/FavoriteButton';
import { saveTestResultWithNotification } from "../../../redux/actions";
import { useState, useRef } from "react";
import { useTestsByType } from "../../../redux/hooks";
import { formatDate } from "../../../utils/dateUtils";

const SHEET_ID = ACTIVITY_IDS.PROCRASTINATION_SCALE;

const ProcrastinationScale: React.FC = () => {
  const dispatch = useAppDispatch();
  const [surveyResult, setSurveyResult] = useState<SurveyResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  // Получаем историю результатов теста
  const procrastinationTestResults = useTestsByType('procrastination-scale');
  // Сохраняем ответы в ref
  const answersRef = useRef<Record<number, number>>({});

  const handleTestComplete = (result: SurveyResult) => {
    // Сохраняем результат в стейт для отображения
    setSurveyResult(result);
    // Показываем страницу с результатами
    setShowResults(true);
    
    // Отправляем результат в Redux
    dispatch(saveTestResultWithNotification({ 
      testResult: result, 
      showNotification: false 
    }));
  };

  // Функция для возврата к опроснику
  const handleBackToSurvey = () => {
    setShowResults(false);
    setSurveyResult(null);
    // Сбрасываем ответы при возврате к опроснику
    answersRef.current = {};
  };

  // Сохраняем выбранный ответ
  const handleAnswerChange = (questionId: string, value: string) => {
    const questionIndex = parseInt(questionId.replace('question-', ''));
    answersRef.current[questionIndex] = parseInt(value);
  };

  // Создаем компонент с кнопками действий
  const ActionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  // Компонент для отображения результатов
  const ResultsPage: React.FC = () => {
    if (!surveyResult) return null;

    // Получаем данные о результатах теста
    const { score, maxScore } = surveyResult;
    
    // Вычисляем процент
    const percentage = maxScore ? Math.round((score / maxScore) * 100) : null;

    // Находим интерпретацию результата на основе баллов
    const getResultInterpretation = () => {
      if (!maxScore) return '';
      
      // Ищем подходящую интерпретацию в конфигурации опросника
      const { results } = procrastinationConfig;
      const result = results.find(
        r => score >= r.minScore && score <= r.maxScore
      );
      
      return result ? result.description : 'Интерпретация не найдена';
    };

    const interpretation = getResultInterpretation();

    // Получаем предыдущие результаты (исключая текущий)
    const previousResults = procrastinationTestResults.slice(0, 5);

    return (
      <div className={styles.resultsContainer}>
        <h2>Результаты шкалы иррациональной прокрастинации</h2>
        
        <div className={styles.resultScore}>
          <h3>Ваш результат: {score} {maxScore && `из ${maxScore} баллов`} {percentage && `(${percentage}%)`}</h3>
        </div>
        
        <div className={styles.resultInterpretation}>
          <h3>Интерпретация результата:</h3>
          <p>{interpretation}</p>
        </div>
        
        {/* Секция с историей результатов */}
        {previousResults.length > 0 && (
          <div className={styles.historySection}>
            <h3>История ваших прохождений:</h3>
            <div className={styles.historyList}>
              {previousResults.map((result, index) => {
                const resultDate = formatDate(result.completedAt, 'ru-RU', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                // Проверка на существование score и maxScore
                const score = result.score ?? 0;
                const maxScore = result.maxScore;
                const historyPercentage = maxScore 
                  ? Math.round((score / maxScore) * 100) 
                  : null;

                return (
                  <div key={index} className={styles.historyItem}>
                    <div className={styles.historyDate}>
                      {resultDate}
                    </div>
                    <div className={styles.historyScore}>
                      <strong>{score}</strong> {maxScore && `из ${maxScore}`} 
                      {historyPercentage && ` (${historyPercentage}%)`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className={styles.resultActions}>
          {ActionButtons}
          <button 
            onClick={handleBackToSurvey} 
            className={styles.repeatButton}
          >
            Пройти опросник снова
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {!showResults ? (
        <Survey 
          config={procrastinationConfig} 
          onComplete={handleTestComplete}
          onAnswerChange={handleAnswerChange}
          actionButtons={ActionButtons} 
        />
      ) : (
        <ResultsPage />
      )}
    </>
  );
};

export default ProcrastinationScale; 
