import { useState } from 'react';
import { listOfQuestions } from './listOfQuestions';
import { explanationOfFirstQuestion } from './explanationOfFirstQuestion';
import styles from './TestOfCognitiveBiases.module.css';
import { SurveyResult } from '../Survey/types';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { createBaseExercise } from '../../../utils/exerciseUtils';

interface AnswerState {
  selectedAnswers: number[];
  isSubmitted: boolean;
}

interface TestOfCognitiveBiasesProps {
  onComplete?: (result: SurveyResult) => void;
}

const SHEET_ID = ACTIVITY_IDS.COGNITIVE_BIASES_TEST;

const TestOfCognitiveBiases = ({ onComplete }: TestOfCognitiveBiasesProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(
    listOfQuestions.map(() => ({ selectedAnswers: [], isSubmitted: false }))
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (answers[currentQuestion].isSubmitted) return;

    setAnswers(prev => {
      const newAnswers = [...prev];
      const currentAnswers = [...prev[currentQuestion].selectedAnswers];

      const existingIndex = currentAnswers.indexOf(index);
      if (existingIndex === -1) {
        currentAnswers.push(index);
      } else {
        currentAnswers.splice(existingIndex, 1);
      }

      newAnswers[currentQuestion] = {
        ...prev[currentQuestion],
        selectedAnswers: currentAnswers,
      };

      return newAnswers;
    });
  };

  const handleSubmitAnswer = () => {
    if (answers[currentQuestion].selectedAnswers.length === 0) return;

    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = {
        ...prev[currentQuestion],
        isSubmitted: true,
      };
      return newAnswers;
    });

    if (currentQuestion === 0) {
      setShowExplanation(true);
    } else if (currentQuestion === listOfQuestions.length - 1) {
      setIsTestCompleted(true);

      // Сохраняем результат теста
      const score = calculateTotalScore();
      const result: SurveyResult = {
        ...createBaseExercise(SHEET_ID),
        score,
        maxScore: 100
      };

      onComplete?.(result);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < listOfQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers(listOfQuestions.map(() => ({ selectedAnswers: [], isSubmitted: false })));
    setShowExplanation(false);
    setIsTestCompleted(false);
  };

  const getCurrentQuestionData = () => listOfQuestions[currentQuestion];

  const calculateQuestionScore = (questionIndex: number) => {
    const question = listOfQuestions[questionIndex];
    const userAnswers = answers[questionIndex].selectedAnswers;
    const totalOptions = question.answers.length;
    let correctChoices = 0;

    // Проверяем каждый вариант ответа
    for (let i = 0; i < totalOptions; i++) {
      const isSelected = userAnswers.includes(i);
      const shouldBeSelected = question.rightAnswers.includes(i);

      // Если ответ выбран правильно или правильно не выбран
      if (isSelected === shouldBeSelected) {
        correctChoices++;
      }
    }

    // Возвращаем процент правильных выборов
    return (correctChoices / totalOptions) * 100;
  };

  const calculateTotalScore = () => {
    const totalScore = answers.reduce((sum, _, index) => {
      return sum + calculateQuestionScore(index);
    }, 0);

    return Math.round(totalScore / listOfQuestions.length);
  };

  const renderAnswers = () => {
    return getCurrentQuestionData().answers.map((answer, index) => {
      const isSubmitted = answers[currentQuestion].isSubmitted;
      const isSelected = answers[currentQuestion].selectedAnswers.includes(index);
      const isCorrectAnswer = getCurrentQuestionData().rightAnswers.includes(index);

      let className = styles.answerOption;
      if (isSubmitted) {
        if (isCorrectAnswer) {
          className += ` ${styles.correct}`;
        } else if (isSelected) {
          className += ` ${styles.incorrect}`;
        }
      }

      return (
        <label key={index} className={className}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleAnswerSelect(index)}
            disabled={isSubmitted}
          />
          <span>{answer}</span>
        </label>
      );
    });
  };

  return (
    <div className={styles.testContainer}>
      <div className={styles.titleContainer}>
        <h2>Тест на понимание когнитивных искажений</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>

      <div className={styles.questionBlock}>
        <p className={styles.questionNumber}>Вопрос {currentQuestion + 1} из {listOfQuestions.length}</p>
        <p className={styles.questionText}>{getCurrentQuestionData().question}</p>

        <div className={styles.answersList}>
          {renderAnswers()}
        </div>

        {!answers[currentQuestion].isSubmitted && (
          <button
            className={styles.button}
            onClick={handleSubmitAnswer}
            disabled={answers[currentQuestion].selectedAnswers.length === 0}
          >
            Ответить
          </button>
        )}

        {answers[currentQuestion].isSubmitted && (
          <div className={styles.resultBlock}>
            <p className={calculateQuestionScore(currentQuestion) === 100 ? styles.correct : styles.incorrect}>
              {calculateQuestionScore(currentQuestion) === 100
                ? 'Правильно!'
                : 'Неправильно. Правильные ответы: ' +
                getCurrentQuestionData().rightAnswers.map(index =>
                  getCurrentQuestionData().answers[index]).join(', ')}
            </p>

            {currentQuestion === 0 && showExplanation && (
              <div className={styles.explanation}>
                <h3>Объяснение:</h3>
                <p>{explanationOfFirstQuestion}</p>
              </div>
            )}

            {!isTestCompleted && (
              <button
                className={styles.button}
                onClick={handleNextQuestion}
              >
                Следующий вопрос
              </button>
            )}
          </div>
        )}
      </div>

      {isTestCompleted && (
        <div className={styles.testResults}>
          <h3>Тест завершен!</h3>
          <p>Ваш результат: {calculateTotalScore()}%</p>
          <button
            className={styles.button}
            onClick={handleRetry}
          >
            Попробовать ещё раз
          </button>
        </div>
      )}
    </div>
  );
};

export default TestOfCognitiveBiases
