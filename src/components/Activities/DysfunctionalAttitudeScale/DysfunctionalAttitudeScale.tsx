import React, { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { DASCategory, DASCategoryResult, DASState, DysfunctionalAttitudeScaleExercise } from './types';
import { DAS_ANSWERS, DAS_STATEMENTS } from './dasConfig';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { addExercise } from '../../../redux/actions';
import { useIsMobile } from '../../../utils/deviceUtils';
import { getCurrentISOTimestamp } from '../../../utils/dateUtils';
import ResultsChart from './ResultsChart';
import CategoryResults from './CategoryResults';
import styles from './DysfunctionalAttitudeScale.module.css';


const DysfunctionalAttitudeScale: React.FC = () => {
  const [state, setState] = useState<DASState>({
    answers: {},
    step: 'instructions',
    categoryResults: []
  });
  
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  
  // Функция для обработки изменения ответа
  const handleAnswerChange = (statementId: number, value: number) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [statementId]: value
      }
    }));
  };
  
  // Функция для расчета результатов по категориям
  const calculateCategoryResults = (): DASCategoryResult[] => {
    const results: Record<DASCategory, number> = {
      [DASCategory.APPROVAL]: 0,
      [DASCategory.LOVE]: 0,
      [DASCategory.ACHIEVEMENT]: 0,
      [DASCategory.PERFECTIONISM]: 0,
      [DASCategory.ENTITLEMENT]: 0,
      [DASCategory.OMNIPOTENCE]: 0,
      [DASCategory.AUTONOMY]: 0,
    };
    
    // Считаем сумму по каждой категории
    Object.entries(state.answers).forEach(([statementIdStr, value]) => {
      const statementId = parseInt(statementIdStr, 10);
      const statement = DAS_STATEMENTS.find(s => s.id === statementId);
      
      if (statement) {
        results[statement.category] += value;
      }
    });
    
    // Преобразуем в массив результатов по категориям
    return Object.entries(results).map(([category, score]) => ({
      category: category as DASCategory,
      score,
      isStrength: score >= 0 // Считаем силой, если балл положительный или нулевой
    }));
  };
  
  // Функция для отправки результатов
  const handleSubmit = () => {
    const categoryResults = calculateCategoryResults();
    
    // Сохраняем результаты
    const exercise: DysfunctionalAttitudeScaleExercise = {
      ...createBaseExercise(ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE),
      answers: state.answers,
      categoryResults,
      timestamp: getCurrentISOTimestamp()
    };
    
    dispatch(addExercise({ exercise }));
    
    // Переходим к отображению результатов
    setState(prev => ({
      ...prev,
      step: 'results',
      categoryResults
    }));
  };
  
  // Функция для перезапуска теста
  const handleRestart = () => {
    setState({
      answers: {},
      step: 'instructions',
      categoryResults: []
    });
  };
  
  // Рендер инструкций
  const renderInstructions = () => (
    <div className={styles.instructions}>
      <h3>Инструкция</h3>
      <p>
        Этот опросник поможет вам выявить, какие дисфункциональные убеждения влияют на ваше
        эмоциональное состояние. Для каждого утверждения выберите степень своего согласия или несогласия.
      </p>
      <button 
        className={styles.startButton}
        onClick={() => setState(prev => ({ ...prev, step: 'survey' }))}
      >
        Начать
      </button>
    </div>
  );
  
  // Рендер опросника (версия для компьютера)
  const renderDesktopSurvey = () => (
    <div className={styles.surveyContainer}>
      <table className={styles.surveyTable}>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Утверждение</th>
            {DAS_ANSWERS.map(answer => (
              <th key={answer.value}>{answer.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAS_STATEMENTS.map(statement => (
            <tr key={statement.id}>
              <td className={styles.statementText}>{statement.text}</td>
              {DAS_ANSWERS.map(answer => (
                <td key={answer.value} className={styles.answerCell}>
                  <input
                    type="radio"
                    name={`statement-${statement.id}`}
                    value={answer.value}
                    checked={state.answers[statement.id] === answer.value}
                    onChange={() => handleAnswerChange(statement.id, answer.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  // Рендер опросника (мобильная версия)
  const renderMobileSurvey = () => (
    <div className={styles.mobileSurvey}>
      {DAS_STATEMENTS.map(statement => (
        <div key={statement.id} className={styles.mobileStatement}>
          <p className={styles.mobileStatementText}>{statement.text}</p>
          <div className={styles.mobileAnswers}>
            {DAS_ANSWERS.map(answer => (
              <label key={answer.value} className={styles.mobileAnswerLabel}>
                <input
                  type="radio"
                  name={`statement-${statement.id}`}
                  value={answer.value}
                  checked={state.answers[statement.id] === answer.value}
                  onChange={() => handleAnswerChange(statement.id, answer.value)}
                />
                <span>{answer.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  
  // Рендер результатов
  const renderResults = () => (
    <div className={styles.resultsContainer}>
      <h3>Результаты теста</h3>
      
      <ResultsChart categoryResults={state.categoryResults} />
      <CategoryResults categoryResults={state.categoryResults} />
      
      <button 
        className={styles.restartButton}
        onClick={handleRestart}
      >
        Пройти тест заново
      </button>
    </div>
  );
  
  // Проверка, заполнены ли все поля
  const isFormComplete = DAS_STATEMENTS.every(s => state.answers[s.id] !== undefined);
  
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h2>Шкала дисфункциональных убеждений</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE} />
          <FavoriteButton activityId={ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE} />
        </div>
      </div>
      
      {state.step === 'instructions' && renderInstructions()}
      
      {state.step === 'survey' && (
        <>
          {isMobile ? renderMobileSurvey() : renderDesktopSurvey()}
          
          <div className={styles.submitContainer}>
            <button 
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!isFormComplete}
            >
              Показать результаты
            </button>
            {!isFormComplete && (
              <p className={styles.formIncompleteMessage}>
                Пожалуйста, ответьте на все утверждения, чтобы увидеть результаты
              </p>
            )}
          </div>
        </>
      )}
      
      {state.step === 'results' && renderResults()}
    </div>
  );
};

export default DysfunctionalAttitudeScale; 
