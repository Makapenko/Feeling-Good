import { useState } from "react";
import styles from "./Survey.module.css";
import { SurveyConfig, SurveyState } from "./types";

interface SurveyProps {
  config: SurveyConfig;
}
 // tTODO - добавить предупреждение, если очки по суициду выше нуля
const Survey = ({ config }: SurveyProps) => {
  const [state, setState] = useState<SurveyState>({ score: 0, answers: {} });

  const handleRadioChange = (questionIndex: number, value: string) => {
    setState((prevState) => {
      const newAnswerValue = parseInt(value);
      const oldAnswerValue = prevState.answers[questionIndex] || 0;

      return {
        ...prevState,
        answers: {
          ...prevState.answers,
          [questionIndex]: newAnswerValue,
        },
        score: prevState.score - oldAnswerValue + newAnswerValue,
      };
    });
  };

  const getCurrentResult = () => {
    return config.results.find(
      (result) => state.score >= result.minScore && state.score <= result.maxScore
    )?.description;
  };

  return (
    <>
      <h2 className={styles.surveyTitle}>{config.title}</h2>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th rowSpan={2}>Вопросы</th>
          </tr>
          <tr className={styles.thAnswers}>
            {config.answers.map((answer) => (
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
                    {config.answers.map((answer) => (
                      <td key={answer.value}>
                        <input
                          type="radio"
                          name={`question-${globalIndex}`}
                          value={answer.value.toString()}
                          checked={state.answers[globalIndex] === answer.value}
                          onChange={() =>
                            handleRadioChange(globalIndex, answer.value.toString())
                          }
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </>
          ))}
        </tbody>
      </table>
      <div className={styles.result}>
        <div className={styles.score}>Общий счет: {state.score}</div>
        <div className={styles.evaluation}>
          <b>Ваша оценка:</b>
          <br />
          <span>{getCurrentResult()}</span>
        </div>
      </div>
    </>
  );
};

export default Survey; 
