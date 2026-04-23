import React, { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { IntimacyCategoryResult, IntimacyState, IntimacyScaleExercise, IntimacyCategory } from './types';
import { INTIMACY_ANSWERS, INTIMACY_CATEGORY_DESCRIPTIONS, getSortedStatements } from './intimacyConfig';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { addExercise } from '../../../redux/actions';
import { useIsMobile } from '../../../utils/deviceUtils';
import { getCurrentISOTimestamp } from '../../../utils/dateUtils';
import CategoryResults from './CategoryResults';
import styles from '../DysfunctionalAttitudeScale/DysfunctionalAttitudeScale.module.css';

const SHEET_ID = ACTIVITY_IDS.INTIMACY_SCALE;
const sortedStatements = getSortedStatements();
const MAX_CATEGORY_SCORE = 12; // 4 вопроса * 3 балла

const IntimacyScale: React.FC = () => {
  const [state, setState] = useState<IntimacyState>({
    answers: {},
    step: 'instructions',
    categoryResults: []
  });

  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const handleAnswerChange = (statementId: number, value: number) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [statementId]: value
      }
    }));
  };

  const calculateCategoryResults = (): IntimacyCategoryResult[] => {
    const results: Record<IntimacyCategory, number> = {} as Record<IntimacyCategory, number>;

    // Инициализируем все категории нулями
    Object.values(IntimacyCategory).forEach(cat => {
      results[cat] = 0;
    });

    // Считаем сумму по каждой категории
    Object.entries(state.answers).forEach(([statementIdStr, value]) => {
      const statementId = parseInt(statementIdStr, 10);
      const statement = sortedStatements.find(s => s.id === statementId);
      if (statement) {
        results[statement.category] += value;
      }
    });

    return Object.entries(results).map(([category, score]) => ({
      category: category as IntimacyCategory,
      score,
      maxScore: MAX_CATEGORY_SCORE,
    }));
  };

  const handleSubmit = () => {
    const categoryResults = calculateCategoryResults();
    const totalScore = categoryResults.reduce((sum, r) => sum + r.score, 0);

    const exercise: IntimacyScaleExercise = {
      ...createBaseExercise(SHEET_ID),
      answers: state.answers,
      categoryResults,
      totalScore,
      timestamp: getCurrentISOTimestamp()
    };

    dispatch(addExercise({ exercise }));

    setState(prev => ({
      ...prev,
      step: 'results',
      categoryResults
    }));
  };

  const handleRestart = () => {
    setState({
      answers: {},
      step: 'instructions',
      categoryResults: []
    });
  };

  const isFormComplete = sortedStatements.every(s => state.answers[s.id] !== undefined);

  const renderInstructions = () => (
    <div className={styles.instructions}>
      <h3>Инструкция</h3>
      <p>
        Этот тест поможет определить, какие установки мешают вам строить близкие отношения
        с другими людьми. Для каждого из 60 утверждений выберите, насколько часто
        вы испытываете это чувство: от «никогда» до «часто».
      </p>
      <p>
        Правильных или неправильных ответов нет — руководствуйтесь тем, как ощущаете себя
        в последнее время.
      </p>
      <button
        className={styles.startButton}
        onClick={() => setState(prev => ({ ...prev, step: 'survey' }))}
      >
        Начать
      </button>
    </div>
  );

  const renderDesktopSurvey = () => (
    <div className={styles.surveyContainer}>
      <table className={styles.surveyTable}>
        <thead>
          <tr>
            <th style={{ width: '55%' }}>Утверждение</th>
            {INTIMACY_ANSWERS.map(answer => (
              <th key={answer.value}>{answer.label} ({answer.value})</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedStatements.map(statement => (
            <tr key={statement.id}>
              <td className={styles.statementText}>{statement.id}. {statement.text}</td>
              {INTIMACY_ANSWERS.map(answer => (
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

  const renderMobileSurvey = () => (
    <div className={styles.mobileSurvey}>
      {sortedStatements.map(statement => (
        <div key={statement.id} className={styles.mobileStatement}>
          <p className={styles.mobileStatementText}>{statement.id}. {statement.text}</p>
          <div className={styles.mobileAnswers}>
            {INTIMACY_ANSWERS.map(answer => (
              <label key={answer.value} className={styles.mobileAnswerLabel}>
                <input
                  type="radio"
                  name={`statement-${statement.id}`}
                  value={answer.value}
                  checked={state.answers[statement.id] === answer.value}
                  onChange={() => handleAnswerChange(statement.id, answer.value)}
                />
                <span>{answer.label} ({answer.value})</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderResults = () => {
    const totalScore = state.categoryResults.reduce((sum, r) => sum + r.score, 0);
    const maxTotal = 180;
    const percentage = Math.round((totalScore / maxTotal) * 100);

    return (
      <div className={styles.resultsContainer}>
        <h3>Результаты теста на способность к близости</h3>
        <div className={styles.scoreExplanation}>
          <p><strong>Общий балл: {totalScore} из {maxTotal} ({percentage}%)</strong></p>
          <p>
            Чем выше балл по каждой категории, тем сильнее эта установка мешает вашим отношениям.
            Балл по каждой установке складывается из 4 вопросов (макс. {MAX_CATEGORY_SCORE}).
          </p>
        </div>

        <CategoryResults categoryResults={state.categoryResults} />

        <button
          className={styles.restartButton}
          onClick={handleRestart}
        >
          Пройти тест заново
        </button>
      </div>
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h2>Тест на способность к близости</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
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

export default IntimacyScale;
