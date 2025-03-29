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

const SHEET_ID = ACTIVITY_IDS.BURNS_CHECKLIST;

// TODO Удалить уведомления из saveTestResultWithNotification

const BurnsChecklist: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showSuicideWarning, setShowSuicideWarning] = useState(false);

  const handleTestComplete = (result: SurveyResult) => {
    dispatch(saveTestResultWithNotification({ 
      testResult: result, 
      showNotification: false 
    }));
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

  return (
    <>
      <SurveyWithSuicideCheck />
      
      {showSuicideWarning && (
        <div className={styles.warningMessage} style={{ color: 'red', marginTop: '20px', padding: '15px', border: '1px solid red', borderRadius: '5px' }}>
          <strong>** При наличии суицидальных побуждений необходимо обратиться за помощью к профессионалу в области психического здоровья.</strong>
        </div>
      )}
    </>
  );
};

export default BurnsChecklist; 
