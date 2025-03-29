import { useState } from "react";
import styles from "./Survey.module.css";
import { SurveyConfig, SurveyState, SurveyResult } from "./types";
import FavoriteButton from "../../../components/shared/FavoriteButton";
import { ActivityId } from "../../../constants/activities";
import { useIsMobile } from "../../../utils/deviceUtils";
import { createBaseExercise } from "../../../utils/exerciseUtils";

interface SurveyProps {
  config: SurveyConfig;
  onComplete?: (result: SurveyResult) => void;
  actionButtons?: React.ReactNode;
};


const Survey = ({ config, onComplete, actionButtons }: SurveyProps) => {
  const [state, setState] = useState<SurveyState>({ score: 0, answers: {} });
  const [isCompleted, setIsCompleted] = useState(false);
  const isMobile = useIsMobile();

  // Используем ID опроса из конфигурации или генерируем на основе названия
  const SURVEY_ID = (config.id || `survey-${config.title.toLowerCase().replace(/\s+/g, '-')}`) as ActivityId;

  // Вычисляем максимально возможный балл
  const calculateMaxScore = () => {
    return config.parts.reduce((sum, part) => {
      return sum + part.questions.length * Math.max(...config.answers.map(a => a.value));
    }, 0);
  };

  const handleRadioChange = (questionIndex: number, value: string) => {
    setState((prevState) => {
      const newAnswerValue = parseInt(value);
      const oldAnswerValue = prevState.answers[questionIndex] || 0;

      const newState = {
        ...prevState,
        answers: {
          ...prevState.answers,
          [questionIndex]: newAnswerValue,
        },
        score: prevState.score - oldAnswerValue + newAnswerValue,
      };
      return newState;
    });
  };

  const getCurrentResult = () => {
    const result = config.results.find(
      (result) => state.score >= result.minScore && state.score <= result.maxScore
    )?.description;

    return result;
  };

  const handleComplete = () => {
    
    // Проверяем, что на все вопросы даны ответы
    const totalQuestions = config.parts.reduce((sum, part) => sum + part.questions.length, 0);
    const answeredQuestions = Object.keys(state.answers).length;

    

    if (answeredQuestions < totalQuestions) {
      alert('Пожалуйста, ответьте на все вопросы перед завершением опроса');
      return;
    }

    setIsCompleted(true);

    // Создаем объект результата
    const result: SurveyResult = {
      ...createBaseExercise(SURVEY_ID),
      score: state.score,
      maxScore: calculateMaxScore()
    };

    // Вызываем колбэк с результатом
    onComplete?.(result);
  };

  const handleReset = () => {
    setState({ score: 0, answers: {} });
    setIsCompleted(false);
  };

  const renderMobileAnswers = (globalIndex: number) => (
    <td>
      <div>
        {config.answers.map((answer) => (
          <label key={answer.value}>
            <input
              type="radio"
              name={`question-${globalIndex}`}
              value={answer.value.toString()}
              checked={state.answers[globalIndex] === answer.value}
              onChange={() => handleRadioChange(globalIndex, answer.value.toString())}
              disabled={isCompleted}
            />
            <span>{answer.label}</span>
          </label>
        ))}
      </div>
    </td>
  );

  return (
    <div className={styles.survey}>
      <div className={styles.titleContainer}>
        <h2 className={styles.surveyTitle}>{config.title}</h2>
        {actionButtons ? (
          actionButtons
        ) : (
          <FavoriteButton activityId={SURVEY_ID} />
        )}
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th rowSpan={2}>Вопросы</th>
            {!isMobile && config.answers.map((answer) => (
              <th key={answer.value}>
                {answer.label} ({answer.value})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {config.parts.map((part, partIndex) => (
            <>
              <tr key={`part-${partIndex}`}>
                <td colSpan={config.answers.length + 1} className={styles.partTitle}>
                  {part.title}
                </td>
              </tr>
              {part.questions.map((question, questionIndex) => {
                const globalIndex = partIndex * 10 + questionIndex;
                return (
                  <tr key={globalIndex}>
                    <td>{question.text}</td>
                    {isMobile ? (
                      renderMobileAnswers(globalIndex)
                    ) : (
                      config.answers.map((answer) => (
                        <td key={answer.value}>
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value={answer.value.toString()}
                            checked={state.answers[globalIndex] === answer.value}
                            onChange={() => handleRadioChange(globalIndex, answer.value.toString())}
                            disabled={isCompleted}
                          />
                        </td>
                      ))
                    )}
                  </tr>
                );
              })}
            </>
          ))}
        </tbody>
      </table>

      <div className={styles.actions}>
        {!isCompleted ? (
          <button className={styles.completeButton} onClick={handleComplete}>
            Закончить опрос
          </button>
        ) : (
          <button className={styles.resetButton} onClick={handleReset}>
            Пройти опрос заново
          </button>
        )}
      </div>

      {isCompleted && (
        <div className={styles.result}>
          <div className={styles.score}>
            Общий счет: {state.score} из {calculateMaxScore()}
          </div>
          <div className={styles.evaluation}>
            <b>Ваша оценка:</b>
            <br />
            <span>{getCurrentResult()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Survey; 
