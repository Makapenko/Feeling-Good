import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { ACTIVITY_IDS } from '../../../constants/activities';
import { SpecialContent } from '../../../types/progress.types';
import { ThoughtItem, DownwardArrowChain } from './DownwardArrowTypes';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { getCurrentDate, getCurrentISOTimestamp } from '../../../utils/dateUtils';
import ActivityTimer from '../ActivityTimer/ActivityTimer';
import styles from './DownwardArrow.module.css';

// TODO: В инпуты можно писать только после перезагрузки страницы
// TODO: Не оптимизированы кнопки для мобил

const SHEET_ID: SpecialContent = ACTIVITY_IDS.DOWNWARD_ARROW;

// Варианты вопросов для техники падающей стрелы
const ARROW_QUESTIONS = [
  'Если бы эта мысль оказалась правдой, что бы это значило для меня?',
  'Почему бы меня это расстроило?',
  'А что это будет означать для меня?',
  'Если бы я действительно так считал, почему бы меня это так расстраивало?',
  'Допустим, это правда. Почему это проблема? Что это будет значить для меня?',
  'И что это будет означать?'
];

const DownwardArrow: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  
  const [chains, setChains] = useState<DownwardArrowChain[]>([]);
  const [activeChainIndex, setActiveChainIndex] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  // Загрузка сохраненных цепочек
  useEffect(() => {
    const loadSavedChains = () => {
      const today = getCurrentDate();
      const todayProgress = dailyProgress[today];
      if (!todayProgress?.exercises?.exercises) return;

      const exercise = todayProgress.exercises.exercises.find(
        ex => ex.type === ACTIVITY_IDS.DOWNWARD_ARROW
      );

      if (exercise && 'chains' in exercise) {
        const loadedChains = exercise.chains as DownwardArrowChain[];
        if (loadedChains.length > 0) {
          setChains(loadedChains);
        } else {
          // Если нет сохраненных цепочек, создаем пустую
          createNewChain();
        }
      } else {
        // Если упражнения нет в прогрессе, создаем пустую цепочку
        createNewChain();
      }
    };

    loadSavedChains();
  }, [dailyProgress]);

  // Создание новой цепочки
  const createNewChain = () => {
    const newChain: DownwardArrowChain = {
      id: uuidv4(),
      initialThought: '',
      initialRationalResponse: '',
      chainItems: [],
      hiddenBeliefs: '',
      timestamp: getCurrentISOTimestamp()
    };
    setChains(prev => [...prev, newChain]);
    setActiveChainIndex(chains.length);
  };

  // Добавление новой мысли в активную цепочку
  const addNewThought = () => {
    if (activeChainIndex < 0 || activeChainIndex >= chains.length) return;

    const randomQuestionIndex = Math.floor(Math.random() * ARROW_QUESTIONS.length);
    const defaultQuestion = ARROW_QUESTIONS[randomQuestionIndex];

    const newThought: ThoughtItem = {
      id: uuidv4(),
      text: '',
      question: defaultQuestion,
      rationalResponse: ''
    };

    const updatedChains = [...chains];
    updatedChains[activeChainIndex].chainItems.push(newThought);
    setChains(updatedChains);
    saveToRedux(updatedChains);
  };

  // Обновление текста мысли в активной цепочке
  const updateThoughtText = (thoughtId: string, text: string) => {
    if (activeChainIndex < 0 || activeChainIndex >= chains.length) return;

    const updatedChains = [...chains];
    const chainItemIndex = updatedChains[activeChainIndex].chainItems.findIndex(
      item => item.id === thoughtId
    );

    if (chainItemIndex !== -1) {
      updatedChains[activeChainIndex].chainItems[chainItemIndex].text = text;
      setChains(updatedChains);
      saveToRedux(updatedChains);
    }
  };

  // Обновление вопроса для мысли
  const updateThoughtQuestion = (thoughtId: string, question: string) => {
    if (activeChainIndex < 0 || activeChainIndex >= chains.length) return;

    const updatedChains = [...chains];
    const chainItemIndex = updatedChains[activeChainIndex].chainItems.findIndex(
      item => item.id === thoughtId
    );

    if (chainItemIndex !== -1) {
      updatedChains[activeChainIndex].chainItems[chainItemIndex].question = question;
      setChains(updatedChains);
      saveToRedux(updatedChains);
    }
  };

  // Обновление рационального ответа для конкретной мысли
  const updateThoughtResponse = (thoughtId: string, response: string) => {
    if (activeChainIndex < 0 || activeChainIndex >= chains.length) return;

    const updatedChains = [...chains];
    const chainItemIndex = updatedChains[activeChainIndex].chainItems.findIndex(
      item => item.id === thoughtId
    );

    if (chainItemIndex !== -1) {
      updatedChains[activeChainIndex].chainItems[chainItemIndex].rationalResponse = response;
      setChains(updatedChains);
      saveToRedux(updatedChains);
    }
  };

  // Обновление начальной мысли в активной цепочке
  const updateInitialThought = (text: string) => {
    if (activeChainIndex < 0 || activeChainIndex >= chains.length) return;

    const updatedChains = [...chains];
    updatedChains[activeChainIndex].initialThought = text;
    setChains(updatedChains);
    saveToRedux(updatedChains);
  };

  // Обновление рационального ответа на начальную мысль
  const updateInitialResponse = (text: string) => {
    if (activeChainIndex < 0 || activeChainIndex >= chains.length) return;

    const updatedChains = [...chains];
    updatedChains[activeChainIndex].initialRationalResponse = text;
    setChains(updatedChains);
    saveToRedux(updatedChains);
  };

  // Обновление скрытых убеждений
  const updateHiddenBeliefs = (text: string) => {
    if (activeChainIndex < 0 || activeChainIndex >= chains.length) return;

    const updatedChains = [...chains];
    updatedChains[activeChainIndex].hiddenBeliefs = text;
    setChains(updatedChains);
    saveToRedux(updatedChains);
  };

  // Сохранение в Redux
  const saveToRedux = (updatedChains: DownwardArrowChain[]) => {
    const exercise = {
      ...createBaseExercise(SHEET_ID, SHEET_ID),
      chains: updatedChains
    };

    dispatch(addExercise({ 
      exercise, 
      showNotification: false 
    }));
  };

  // Удаление мысли из активной цепочки
  const removeThought = (thoughtId: string) => {
    if (activeChainIndex < 0 || activeChainIndex >= chains.length) return;

    const updatedChains = [...chains];
    updatedChains[activeChainIndex].chainItems = updatedChains[activeChainIndex].chainItems.filter(
      item => item.id !== thoughtId
    );
    setChains(updatedChains);
    saveToRedux(updatedChains);
  };

  // Получение активной цепочки
  const activeChain = chains[activeChainIndex] || {
    initialThought: '',
    initialRationalResponse: '',
    chainItems: [],
    hiddenBeliefs: ''
  };

  const actionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  return (
    <div className={styles.container}>
      <ActivityTimer activityId={SHEET_ID} />
      
      <div className={styles.header}>
        <h2>Техника падающей стрелы</h2>
        {actionButtons}
      </div>
      
      {showInstructions && (
        <div className={styles.instructions}>
          <h3>Инструкция</h3>
          <p>
            Техника падающей стрелы используется для выявления базовых убеждений, которые
            лежат в основе ваших негативных автоматических мыслей. С помощью последовательных
            вопросов "Если бы эта мысль оказалась правдой, что бы это значило для меня?" вы можете 
            добраться до глубинных убеждений, которые создают вашу уязвимость к депрессии и тревоге.
          </p>
          <p>
            <strong>Как применять технику:</strong>
          </p>
          <ol>
            <li>Запишите негативную автоматическую мысль, которая вас беспокоит.</li>
            <li>Под ней нарисуйте стрелку, которая означает вопрос: "Если бы эта мысль была правдой, что бы это означало для меня? Почему бы меня это расстроило?"</li>
            <li>Запишите следующую мысль, которая приходит в голову, в ответ на этот вопрос.</li>
            <li>Продолжайте рисовать стрелки и задавать этот вопрос для каждой новой мысли, выстраивая цепочку.</li>
            <li>После того, как цепочка автоматических мыслей выстроена, запишите рациональный ответ на каждую мысль.</li>
            <li>Важно записывать мысли, а не эмоции. Например, вместо "Я чувствую себя отвергнутым" запишите "Это означает, что меня никто не любит".</li>
          </ol>
          <button 
            className={styles.hideInstructionsButton}
            onClick={() => setShowInstructions(false)}
          >
            Скрыть инструкцию
          </button>
        </div>
      )}

      {!showInstructions && (
        <button 
          className={styles.showInstructionsButton}
          onClick={() => setShowInstructions(true)}
        >
          Показать инструкцию
        </button>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.downwardArrowTable}>
          <thead>
            <tr>
              <th>Автоматические мысли</th>
              <th>Рациональные ответы</th>
            </tr>
          </thead>
          <tbody>
            {/* Начальная мысль и ответ */}
            <tr>
              <td className={styles.thoughtsColumn}>
                <div className={styles.initialThought}>
                  <div className={styles.thoughtNumber}>1.</div>
                  <textarea
                    value={activeChain.initialThought}
                    onChange={(e) => updateInitialThought(e.target.value)}
                    placeholder="Запишите негативную автоматическую мысль..."
                    className={styles.thoughtTextarea}
                  />
                </div>
              </td>
              <td className={styles.responsesColumn}>
                <textarea
                  value={activeChain.initialRationalResponse}
                  onChange={(e) => updateInitialResponse(e.target.value)}
                  placeholder="Запишите рациональный ответ на эту мысль..."
                  className={styles.responseTextarea}
                />
              </td>
            </tr>

            {/* Цепочка мыслей и ответов */}
                {activeChain.chainItems.map((item, index) => (
              <tr key={item.id}>
                <td className={styles.thoughtsColumn}>
                  <div className={styles.chainItem}>
                    <div className={styles.arrowContainer}>
                      <div className={styles.arrow}>↓</div>
                    </div>
                    <div className={styles.thoughtContent}>
                      <div className={styles.thoughtQuestion}>
                        <textarea 
                          value={item.question || ''}
                          onChange={(e) => updateThoughtQuestion(item.id, e.target.value)}
                          className={styles.questionTextarea}
                          placeholder="Введите вопрос..."
                        />
                      </div>
                      <div className={styles.thoughtInputContainer}>
                        <div className={styles.thoughtNumber}>{index + 2}.</div>
                        <textarea
                          value={item.text}
                          onChange={(e) => updateThoughtText(item.id, e.target.value)}
                          placeholder={`Что это означает для меня...`}
                          className={styles.thoughtTextarea}
                        />
                        <button 
                          onClick={() => removeThought(item.id)}
                          className={styles.removeButton}
                          title="Удалить мысль"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className={styles.responsesColumn}>
                  <textarea
                    value={item.rationalResponse}
                    onChange={(e) => updateThoughtResponse(item.id, e.target.value)}
                    placeholder="Запишите рациональный ответ на эту мысль..."
                    className={styles.responseTextarea}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

                <button
                  onClick={addNewThought}
                  className={styles.addThoughtButton}
                >
                  + Добавить следующую мысль
                </button>

        <div className={styles.hiddenBeliefsSection}>
          <h3>Выявленные скрытые убеждения</h3>
          <p className={styles.beliefsDescription}>
            Изучите цепочку автоматических мыслей и запишите скрытые убеждения, 
            которые вы обнаружили в их основе
          </p>
                <textarea
            value={activeChain.hiddenBeliefs}
            onChange={(e) => updateHiddenBeliefs(e.target.value)}
            placeholder="Запишите выявленные скрытые убеждения..."
            className={styles.hiddenBeliefsTextarea}
          />
        </div>
      </div>

      <div className={styles.paginationContainer}>
        {chains.length > 1 && (
          <>
            <button 
              onClick={() => setActiveChainIndex(prev => Math.max(0, prev - 1))}
              disabled={activeChainIndex === 0}
              className={styles.paginationButton}
            >
              &lt; Предыдущая
            </button>
            <span className={styles.paginationInfo}>
              {activeChainIndex + 1} из {chains.length}
            </span>
            <button 
              onClick={() => setActiveChainIndex(prev => Math.min(chains.length - 1, prev + 1))}
              disabled={activeChainIndex === chains.length - 1}
              className={styles.paginationButton}
            >
              Следующая &gt;
            </button>
          </>
        )}
        <button 
          onClick={createNewChain}
          className={styles.newChainButton}
        >
          Новая цепочка
        </button>
      </div>
    </div>
  );
};

export default DownwardArrow; 
