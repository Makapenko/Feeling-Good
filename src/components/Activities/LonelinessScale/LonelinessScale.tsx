import { useState, useRef } from "react";
import { useAppDispatch, useTestsByType } from "../../../redux/hooks";
import { ACTIVITY_IDS } from "../../../constants/activities";
import { saveTestResultWithNotification } from "../../../redux/actions";
import { createBaseExercise } from "../../../utils/exerciseUtils";
import { formatDate } from "../../../utils/dateUtils";
import { useIsMobile } from "../../../utils/deviceUtils";
import ChapterLinkButton from "../../shared/ChapterLinkButton";
import FavoriteButton from "../../shared/FavoriteButton";
import { lonelinessConfig } from "./lonelinessConfig";
import styles from "../Survey/Survey.module.css";

const SHEET_ID = ACTIVITY_IDS.LONELINESS_SCALE;
const MAX_SCORE = 32;

const LonelinessScale: React.FC = () => {
  const dispatch = useAppDispatch();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const testResults = useTestsByType(ACTIVITY_IDS.LONELINESS_SCALE);
  const isMobile = useIsMobile();
  const completedRef = useRef(false);

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    if (completedRef.current) return;
    const value = lonelinessConfig.questions[questionIndex].values[answerIndex];
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const getSelectedAnswerIndex = (questionIndex: number): number | null => {
    if (answers[questionIndex] === undefined) return null;
    const question = lonelinessConfig.questions[questionIndex];
    const value = answers[questionIndex];
    return question.values.indexOf(value);
  };

  const handleComplete = () => {
    const totalQuestions = lonelinessConfig.questions.length;
    if (Object.keys(answers).length < totalQuestions) {
      alert("Пожалуйста, ответьте на все вопросы перед завершением опроса");
      return;
    }

    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    setScore(totalScore);
    setShowResults(true);
    completedRef.current = true;

    dispatch(saveTestResultWithNotification({
      testResult: {
        ...createBaseExercise(SHEET_ID),
        score: totalScore,
        maxScore: MAX_SCORE,
      },
      showNotification: false,
    }));
  };

  const handleBackToSurvey = () => {
    setShowResults(false);
    setScore(null);
    setAnswers({});
    completedRef.current = false;
  };

  const ActionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  const getInterpretation = (s: number) => {
    return lonelinessConfig.results.find(
      r => s >= r.minScore && s <= r.maxScore
    );
  };

  if (showResults && score !== null) {
    const interpretation = getInterpretation(score);
    const percentage = Math.round((score / MAX_SCORE) * 100);
    const previousResults = testResults.slice(0, 5);

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.surveyTitle}>Результаты опросника одиночества</h2>
          {ActionButtons}
        </div>

        <div className={styles.resultScore}>
          <h3>Ваш результат: {score} из {MAX_SCORE} баллов ({percentage}%)</h3>
        </div>

        <div className={styles.resultInterpretation}>
          <h3>Интерпретация результата:</h3>
          <p>{interpretation?.description}</p>
          {interpretation?.percent && <p><i>{interpretation.percent}</i></p>}
        </div>

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
                  minute: '2-digit',
                });
                const s = result.score ?? 0;
                const ms = result.maxScore;
                const hp = ms ? Math.round((s / ms) * 100) : null;

                return (
                  <div key={index} className={styles.historyItem}>
                    <div className={styles.historyDate}>{resultDate}</div>
                    <div className={styles.historyScore}>
                      <strong>{s}</strong> {ms && `из ${ms}`}
                      {hp !== null && ` (${hp}%)`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.resultActions}>
          <button onClick={handleBackToSurvey} className={styles.repeatButton}>
            Пройти опросник снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.survey}>
      <div className={styles.titleContainer}>
        <h2 className={styles.surveyTitle}>{lonelinessConfig.title}</h2>
        {ActionButtons}
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th rowSpan={2}>Утверждения</th>
            {!isMobile && lonelinessConfig.answerLabels.map((label, i) => (
              <th key={i}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lonelinessConfig.questions.map((question, qIdx) => {
            const selectedIdx = getSelectedAnswerIndex(qIdx);
            return (
              <tr key={qIdx}>
                <td>{question.text}</td>
                {isMobile ? (
                  <td>
                    <div>
                      {lonelinessConfig.answerLabels.map((label, aIdx) => (
                        <label key={aIdx}>
                          <input
                            type="radio"
                            name={`question-${qIdx}`}
                            checked={selectedIdx === aIdx}
                            onChange={() => handleAnswerChange(qIdx, aIdx)}
                            disabled={completedRef.current}
                          />
                          <span>{label} ({question.values[aIdx]})</span>
                        </label>
                      ))}
                    </div>
                  </td>
                ) : (
                  lonelinessConfig.answerLabels.map((_, aIdx) => (
                    <td key={aIdx}>
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        checked={selectedIdx === aIdx}
                        onChange={() => handleAnswerChange(qIdx, aIdx)}
                        disabled={completedRef.current}
                      />
                    </td>
                  ))
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.actions}>
        <button className={styles.completeButton} onClick={handleComplete}>
          Закончить опрос
        </button>
      </div>
    </div>
  );
};

export default LonelinessScale;
