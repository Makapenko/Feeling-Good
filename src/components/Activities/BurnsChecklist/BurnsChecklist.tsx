import { useAppDispatch } from "../../../redux/hooks";
import Survey from "../Survey";
import { burnsConfig } from "../Survey/configs";
import { SurveyResult } from "../Survey/types";
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import styles from '../Survey/Survey.module.css';
import FavoriteButton from '../../shared/FavoriteButton';
import { saveTestResultWithNotification } from "../../../redux/actions";
import { useState } from "react";
import { useTestsByType } from "../../../redux/hooks";
import { formatDate } from "../../../utils/dateUtils";

const SHEET_ID = ACTIVITY_IDS.BURNS_CHECKLIST;

// TODO Удалить уведомления из saveTestResultWithNotification

const BurnsChecklist: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showSuicideWarning, setShowSuicideWarning] = useState(false);
  const [surveyResult, setSurveyResult] = useState<SurveyResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  // Получаем историю результатов теста Бернса
  const burnsTestResults = useTestsByType('burns-checklist');

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
    setShowSuicideWarning(false);
  };

  // Обработчик для проверки наличия суицидальных наклонностей
  const handleSurveySubmit = (answers: Record<number, number>) => {
    // Находим индекс секции "Суицидальные побуждения" (последняя секция, индекс 3)
    const suicidalSectionIndex = 3;
    
    // Вычисляем базовый индекс для вопросов в этой секции
    const suicidalQuestionsBaseIndex = suicidalSectionIndex * 10;
    
    // Проверяем, есть ли ответы со значениями > 0 в секции суицидальных побуждений
    let hasSuicidalThoughts = false;
    for (let i = 0; i < 3; i++) {
      const questionIndex = suicidalQuestionsBaseIndex + i;
      if (answers[questionIndex] && answers[questionIndex] > 0) {
        hasSuicidalThoughts = true;
        break;
      }
    }
    
    setShowSuicideWarning(hasSuicidalThoughts);
  };

  // Создаем компонент с кнопками действий
  const ActionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  // Расширяем компонент Survey для перехвата ответов
  const SurveyWithSuicideCheck: React.FC = () => {
    const handleSurveyComplete = (result: SurveyResult, answers?: Record<number, number>) => {
      if (answers) {
        handleSurveySubmit(answers);
      }
      handleTestComplete(result);
    };

    return (
      <Survey 
        config={burnsConfig} 
        onComplete={(result) => {
          // Получаем доступ к внутреннему состоянию через DOM
          const answerInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked');
          
          const answers: Record<number, number> = {};
          answerInputs.forEach(input => {
            const name = input.name;
            const questionIndex = parseInt(name.replace('question-', ''));
            answers[questionIndex] = parseInt(input.value);
          });
          
          handleSurveyComplete(result, answers);
        }} 
        actionButtons={ActionButtons} 
      />
    );
  };

  // Компонент для отображения результатов
  const ResultsPage: React.FC = () => {
    if (!surveyResult) return null;

    // Получаем данные о результатах теста
    const { score, maxScore } = surveyResult;
    
    // Вычисляем процент только если maxScore определен
    const percentage = maxScore ? Math.round((score / maxScore) * 100) : null;

    // Находим интерпретацию результата на основе баллов
    const getResultInterpretation = () => {
      if (!maxScore) return '';
      
      // Ищем подходящую интерпретацию в конфигурации опросника
      const { results } = burnsConfig;
      const result = results.find(
        r => score >= r.minScore && score <= r.maxScore
      );
      
      return result ? result.description : 'Интерпретация не найдена';
    };

    const interpretation = getResultInterpretation();

    // Получаем предыдущие результаты (исключая текущий)
    const previousResults = burnsTestResults.slice(0, 5);

    return (
      <div className={styles.resultsContainer}>
        <h2>Результаты опросника Бернса</h2>
        
        {/* Отображаем предупреждение, если необходимо */}
        {showSuicideWarning && (
          <div className={styles.warningMessage}>
            <strong>** При наличии суицидальных побуждений необходимо обратиться за помощью к профессионалу в области психического здоровья.</strong>
          </div>
        )}
        
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
      {!showResults ? <SurveyWithSuicideCheck /> : <ResultsPage />}
    </>
  );
};

export default BurnsChecklist; 
