import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import styles from './DownwardArrow.module.css';

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
  
  // Используем useRef для отслеживания изменений без вызова повторного рендеринга
  const chainsRef = useRef<DownwardArrowChain[]>([]);
  
  // Обновляем ref при изменении chains
  useEffect(() => {
    chainsRef.current = chains;
  }, [chains]);
  
  // Сохранение в Redux (мемоизированно)
  const saveToRedux = useCallback((updatedChains: DownwardArrowChain[]) => {
    const exercise = {
      ...createBaseExercise(SHEET_ID, SHEET_ID),
      chains: updatedChains
    };

    dispatch(addExercise({ 
      exercise, 
      showNotification: false 
    }));
  }, [dispatch]);
  
  // Отложенное сохранение в Redux для избежания сохранения во время рендеринга
  const deferredSaveToRedux = useCallback(() => {
    setTimeout(() => {
      saveToRedux([...chainsRef.current]);
    }, 0);
  }, [saveToRedux]);
  
  // Создание новой цепочки (мемоизированно)
  const createNewChain = useCallback(() => {
    const newChain: DownwardArrowChain = {
      id: uuidv4(),
      initialThought: '',
      initialRationalResponse: '',
      chainItems: [],
      hiddenBeliefs: '',
      timestamp: getCurrentISOTimestamp()
    };
    
    setChains(prev => {
      const updatedChains = [...prev, newChain];
      chainsRef.current = updatedChains;
      return updatedChains;
    });
    
    setTimeout(() => {
      setActiveChainIndex(chainsRef.current.length - 1);
      deferredSaveToRedux();
    }, 0);
    
    return newChain;
  }, [deferredSaveToRedux]);

  // Загрузка сохраненных цепочек
  useEffect(() => {
    const loadSavedChains = () => {
      const today = getCurrentDate();
      const todayProgress = dailyProgress[today];
      if (!todayProgress?.exercises?.exercises) {
        // Если нет упражнений в прогрессе, создаем пустую цепочку
        createNewChain();
        return;
      }

      const exercise = todayProgress.exercises.exercises.find(
        ex => ex.type === ACTIVITY_IDS.DOWNWARD_ARROW
      );

      if (exercise && 'chains' in exercise) {
        const loadedChains = exercise.chains as DownwardArrowChain[];
        if (loadedChains.length > 0) {
          setChains(loadedChains);
          chainsRef.current = loadedChains;
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
  }, [dailyProgress, createNewChain]);

  // Добавление новой мысли в активную цепочку
  const addNewThought = useCallback(() => {
    if (chains.length === 0 || activeChainIndex < 0 || activeChainIndex >= chains.length) {
      return;
    }

    const randomQuestionIndex = Math.floor(Math.random() * ARROW_QUESTIONS.length);
    const defaultQuestion = ARROW_QUESTIONS[randomQuestionIndex];

    const newThought: ThoughtItem = {
      id: uuidv4(),
      text: '',
      question: defaultQuestion,
      rationalResponse: ''
    };

    setChains(prevChains => {
      const updatedChains = [...prevChains];
      
      if (updatedChains[activeChainIndex]) {
        // Создаем новый массив chainItems вместо мутирования существующего
        const updatedChainItems = [...updatedChains[activeChainIndex].chainItems, newThought];
        
        // Создаем новый объект для цепочки
        updatedChains[activeChainIndex] = {
          ...updatedChains[activeChainIndex],
          chainItems: updatedChainItems
        };
        
        chainsRef.current = updatedChains;
        deferredSaveToRedux();
        return updatedChains;
      }
      
      return prevChains;
    });
  }, [chains, activeChainIndex, deferredSaveToRedux]);

  // Обновление текста мысли в активной цепочке
  const updateThoughtText = useCallback((thoughtId: string, text: string) => {
    if (chains.length === 0 || activeChainIndex < 0 || activeChainIndex >= chains.length) {
      return;
    }

    setChains(prevChains => {
      // Создаем глубокую копию массива цепочек
      const updatedChains = prevChains.map((chain, index) => {
        if (index !== activeChainIndex) return chain;
        
        // Для активной цепочки обновляем элемент
        const updatedChainItems = chain.chainItems.map(item => {
          if (item.id !== thoughtId) return item;
          // Создаем новый объект для измененной мысли
          return { ...item, text };
        });
        
        // Возвращаем новую цепочку с обновленными элементами
        return { ...chain, chainItems: updatedChainItems };
      });
      
      chainsRef.current = updatedChains;
      deferredSaveToRedux();
      return updatedChains;
    });
  }, [chains, activeChainIndex, deferredSaveToRedux]);

  // Обновление вопроса для мысли
  const updateThoughtQuestion = useCallback((thoughtId: string, question: string) => {
    if (chains.length === 0 || activeChainIndex < 0 || activeChainIndex >= chains.length) {
      return;
    }

    setChains(prevChains => {
      // Создаем глубокую копию массива цепочек
      const updatedChains = prevChains.map((chain, index) => {
        if (index !== activeChainIndex) return chain;
        
        // Для активной цепочки обновляем элемент
        const updatedChainItems = chain.chainItems.map(item => {
          if (item.id !== thoughtId) return item;
          // Создаем новый объект для измененной мысли
          return { ...item, question };
        });
        
        // Возвращаем новую цепочку с обновленными элементами
        return { ...chain, chainItems: updatedChainItems };
      });
      
      chainsRef.current = updatedChains;
      deferredSaveToRedux();
      return updatedChains;
    });
  }, [chains, activeChainIndex, deferredSaveToRedux]);

  // Обновление рационального ответа для конкретной мысли
  const updateThoughtResponse = useCallback((thoughtId: string, response: string) => {
    if (chains.length === 0 || activeChainIndex < 0 || activeChainIndex >= chains.length) {
      return;
    }

    setChains(prevChains => {
      // Создаем глубокую копию массива цепочек
      const updatedChains = prevChains.map((chain, index) => {
        if (index !== activeChainIndex) return chain;
        
        // Для активной цепочки обновляем элемент
        const updatedChainItems = chain.chainItems.map(item => {
          if (item.id !== thoughtId) return item;
          // Создаем новый объект для измененной мысли
          return { ...item, rationalResponse: response };
        });
        
        // Возвращаем новую цепочку с обновленными элементами
        return { ...chain, chainItems: updatedChainItems };
      });
      
      chainsRef.current = updatedChains;
      deferredSaveToRedux();
      return updatedChains;
    });
  }, [chains, activeChainIndex, deferredSaveToRedux]);

  // Обновление начальной мысли в активной цепочке
  const updateInitialThought = useCallback((text: string) => {
    if (chains.length === 0 || activeChainIndex < 0 || activeChainIndex >= chains.length) {
      return;
    }

    setChains(prevChains => {
      const updatedChains = prevChains.map((chain, index) => {
        if (index !== activeChainIndex) return chain;
        // Создаем новый объект для измененной цепочки
        return { ...chain, initialThought: text };
      });
      
      chainsRef.current = updatedChains;
      deferredSaveToRedux();
      return updatedChains;
    });
  }, [chains, activeChainIndex, deferredSaveToRedux]);

  // Обновление рационального ответа на начальную мысль
  const updateInitialResponse = useCallback((text: string) => {
    if (chains.length === 0 || activeChainIndex < 0 || activeChainIndex >= chains.length) {
      return;
    }

    setChains(prevChains => {
      const updatedChains = prevChains.map((chain, index) => {
        if (index !== activeChainIndex) return chain;
        // Создаем новый объект для измененной цепочки
        return { ...chain, initialRationalResponse: text };
      });
      
      chainsRef.current = updatedChains;
      deferredSaveToRedux();
      return updatedChains;
    });
  }, [chains, activeChainIndex, deferredSaveToRedux]);

  // Обновление скрытых убеждений
  const updateHiddenBeliefs = useCallback((text: string) => {
    if (chains.length === 0 || activeChainIndex < 0 || activeChainIndex >= chains.length) {
      return;
    }

    setChains(prevChains => {
      const updatedChains = prevChains.map((chain, index) => {
        if (index !== activeChainIndex) return chain;
        // Создаем новый объект для измененной цепочки
        return { ...chain, hiddenBeliefs: text };
      });
      
      chainsRef.current = updatedChains;
      deferredSaveToRedux();
      return updatedChains;
    });
  }, [chains, activeChainIndex, deferredSaveToRedux]);

  // Удаление мысли из активной цепочки
  const removeThought = useCallback((thoughtId: string) => {
    if (chains.length === 0 || activeChainIndex < 0 || activeChainIndex >= chains.length) {
      return;
    }

    setChains(prevChains => {
      const updatedChains = prevChains.map((chain, index) => {
        if (index !== activeChainIndex) return chain;
        
        // Фильтруем элементы, создавая новый массив
        const filteredItems = chain.chainItems.filter(item => item.id !== thoughtId);
        
        // Возвращаем новую цепочку с обновленными элементами
        return { ...chain, chainItems: filteredItems };
      });
      
      chainsRef.current = updatedChains;
      deferredSaveToRedux();
      return updatedChains;
    });
  }, [chains, activeChainIndex, deferredSaveToRedux]);

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

  // Обработчики создания новой цепочки и навигации
  const handleCreateNewChain = useCallback(() => {
    createNewChain();
  }, [createNewChain]);
  
  const handlePrevChain = useCallback(() => {
    setActiveChainIndex(prev => Math.max(0, prev - 1));
  }, []);
  
  const handleNextChain = useCallback(() => {
    setActiveChainIndex(prev => Math.min(chains.length - 1, prev + 1));
  }, [chains.length]);

  // Переключение инструкций
  const toggleInstructions = useCallback((show: boolean) => {
    setShowInstructions(show);
  }, []);

  return (
    <div className={styles.container}>   
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
            onClick={() => toggleInstructions(false)}
          >
            Скрыть инструкцию
          </button>
        </div>
      )}

      {!showInstructions && (
        <button 
          className={styles.showInstructionsButton}
          onClick={() => toggleInstructions(true)}
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
                    value={activeChain.initialThought || ''}
                    onChange={(e) => updateInitialThought(e.target.value)}
                    placeholder="Запишите негативную автоматическую мысль..."
                    className={styles.thoughtTextarea}
                  />
                </div>
              </td>
              <td className={styles.responsesColumn}>
                <textarea
                  value={activeChain.initialRationalResponse || ''}
                  onChange={(e) => updateInitialResponse(e.target.value)}
                  placeholder="Запишите рациональный ответ на эту мысль..."
                  className={styles.responseTextarea}
                />
              </td>
            </tr>

            {/* Цепочка мыслей и ответов */}
            {activeChain.chainItems && activeChain.chainItems.map((item, index) => (
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
                          value={item.text || ''}
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
                    value={item.rationalResponse || ''}
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
            value={activeChain.hiddenBeliefs || ''}
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
              onClick={handlePrevChain}
              disabled={activeChainIndex === 0}
              className={styles.paginationButton}
            >
              &lt; Предыдущая
            </button>
            <span className={styles.paginationInfo}>
              {activeChainIndex + 1} из {chains.length}
            </span>
            <button 
              onClick={handleNextChain}
              disabled={activeChainIndex === chains.length - 1}
              className={styles.paginationButton}
            >
              Следующая &gt;
            </button>
          </>
        )}
        <button 
          onClick={handleCreateNewChain}
          className={styles.newChainButton}
        >
          Новая цепочка
        </button>
      </div>
    </div>
  );
};

export default DownwardArrow; 
