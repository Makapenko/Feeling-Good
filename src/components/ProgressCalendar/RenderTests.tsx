import React from 'react';
import styles from './DayDetails.module.css';
import { ACTIVITY_IDS, ActivityId, ACTIVITY_NAMES } from '../../constants/activities';
import { procrastinationConfig } from '../Activities/ProcrastinationScale/procrastinationConfig';
import { CATEGORY_DESCRIPTIONS } from '../Activities/DysfunctionalAttitudeScale/dasConfig';

// Интерфейс для минимального объекта теста
interface TestObject {
  id: string;
  content?: string;
  type?: string;
  name?: string;
  score?: number;
  maxScore?: number;
  completedAt: string;
  categoryResults?: Array<{category: string, score: number, isStrength: boolean}>;
  answers?: Record<string, number | string>;
}

// Интерфейс для пропсов компонента
interface RenderTestsProps {
  testResults: TestObject[];
  expandedTests: string[];
  toggleTest: (testId: string) => void;
}

/**
 * Получить название и детали теста по его типу
 */
const getTestDetails = (testType: string | undefined) => {
  if (!testType) return { name: 'Тест', config: null, hasDetails: false };
  
  // Проверяем, есть ли такой тип в константах активностей
  const activityId = testType as ActivityId;
  if (ACTIVITY_NAMES[activityId]) {
    // Определяем тесты, которые имеют интерпретацию
    const testsWithDetails = [
      ACTIVITY_IDS.PROCRASTINATION_SCALE,
      ACTIVITY_IDS.BURNS_CHECKLIST,
      ACTIVITY_IDS.NOVACO_SCALE,
      ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE,
      ACTIVITY_IDS.COGNITIVE_BIASES_TEST
    ];
    
    // Используем простую проверку на наличие значения в массиве
    const isDetailedTest = testsWithDetails.some(id => id === activityId);
    
    return {
      name: ACTIVITY_NAMES[activityId],
      config: activityId === ACTIVITY_IDS.PROCRASTINATION_SCALE ? procrastinationConfig : null,
      hasDetails: isDetailedTest
    };
  }
  
  // Дополнительная проверка для ID из конфигураций
  switch(testType) {
    case 'procrastination-scale': // ID из procrastinationConfig
      return {
        name: 'Шкала иррациональной прокрастинации',
        config: procrastinationConfig,
        hasDetails: true
      };
    case 'burns-checklist': // ID из burnsConfig
      return {
        name: 'Опросник депрессии Бернса',
        config: null,
        hasDetails: true
      };
    case 'survey-шкала-раздражения-новако':
      return {
        name: 'Шкала раздражения Новако',
        config: null,
        hasDetails: true
      };
    case 'cognitive-biases-test':
      return {
        name: 'Тест на когнитивные искажения',
        config: null,
        hasDetails: true
      };
    case 'dysfunctional-attitude-scale':
    case 'das-exercise':
      return {
        name: 'Шкала дисфункциональных убеждений',
        config: null,
        hasDetails: true
      };
    default:
      return { name: testType, config: null, hasDetails: false };
  }
};

/**
 * Получить интерпретацию результата теста ProcrastinationScale
 */
const getProcrastinationResultInterpretation = (score: number) => {
  const { results } = procrastinationConfig;
  const result = results.find(
    r => score >= r.minScore && score <= r.maxScore
  );
  
  return result ? result.description : 'Интерпретация не найдена';
};

/**
 * Получить интерпретацию результатов опросника Бернса
 */
const getBurnsChecklistInterpretation = (score: number) => {
  if (score >= 0 && score <= 5) {
    return 'Отсутствие депрессии. Ваше эмоциональное состояние стабильное.';
  } else if (score >= 6 && score <= 10) {
    return 'Нормальное, но несчастливое состояние. Возможны незначительные эпизоды плохого настроения.';
  } else if (score >= 11 && score <= 25) {
    return 'Легкая депрессия. Рекомендуется обратить внимание на свое эмоциональное состояние.';
  } else if (score >= 26 && score <= 50) {
    return 'Умеренная депрессия. Желательна консультация специалиста.';
  } else if (score >= 51 && score <= 75) {
    return 'Сильная депрессия. Необходима консультация специалиста.';
  } else if (score >= 76 && score <= 100) {
    return 'Крайне тяжелая депрессия. Настоятельно рекомендуется обратиться к специалисту.';
  }
  return 'Интерпретация не найдена для данного результата.';
};

/**
 * Получить интерпретацию результатов шкалы раздражения Новако
 */
const getNovacoScaleInterpretation = (score: number) => {
  if (score >= 0 && score <= 45) {
    return 'Низкий уровень раздражения. У вас хорошо развит самоконтроль.';
  } else if (score >= 46 && score <= 55) {
    return 'Умеренный уровень раздражения. В целом вы контролируете свои эмоции, но иногда можете испытывать затруднения.';
  } else if (score >= 56 && score <= 75) {
    return 'Повышенный уровень раздражения. Рекомендуется обратить внимание на способы управления гневом.';
  } else if (score >= 76 && score <= 85) {
    return 'Высокий уровень раздражения. Рекомендуется освоить методики самоконтроля.';
  } else if (score >= 86 && score <= 100) {
    return 'Очень высокий уровень раздражения. Настоятельно рекомендуется обратиться к специалисту.';
  }
  return 'Интерпретация не найдена для данного результата.';
};

/**
 * Получить интерпретацию результатов теста на когнитивные искажения
 */
const getCognitiveBiasesInterpretation = (score: number) => {
  if (score >= 0 && score <= 30) {
    return 'Низкий уровень когнитивных искажений. У вас преобладает рациональное мышление.';
  } else if (score >= 31 && score <= 50) {
    return 'Умеренный уровень когнитивных искажений. Иногда вы подвержены искаженному восприятию реальности.';
  } else if (score >= 51 && score <= 70) {
    return 'Повышенный уровень когнитивных искажений. Рекомендуется обратить внимание на свои мыслительные привычки.';
  } else if (score >= 71 && score <= 100) {
    return 'Высокий уровень когнитивных искажений. Ваше мышление часто подвержено логическим ошибкам и искажениям.';
  }
  return 'Интерпретация не найдена для данного результата.';
};

/**
 * Получить возможный тип теста из объекта результата
 */
const getTestType = (test: TestObject): string | undefined => {
  // Проверяем доступные поля в различных форматах объекта теста
  // content приходит из объекта TestResult в redux
  // type приходит из BaseExercise
  // id может содержать идентификатор теста
  
  // Специальная обработка для шкалы дисфункциональных убеждений
  if (test.type === ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE || 
      test.content === ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE ||
      test.id === ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE || 
      test.id?.includes('das') || 
      test.id?.includes('dysfunctional') ||
      test?.name?.toLowerCase().includes('дисфункц')) {
    return ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE;
  }
  
  if (test.content) return test.content;
  if (test.type) return test.type;
  
  // Проверим известные ID тестов
  if (test.id === 'burns-checklist') return 'burns-checklist';
  if (test.id === 'procrastination-scale') return 'procrastination-scale';
  if (test.id?.includes('novaco')) return ACTIVITY_IDS.NOVACO_SCALE;
  if (test.id?.includes('cognitive-biases')) return ACTIVITY_IDS.COGNITIVE_BIASES_TEST;
  
  // В крайнем случае возвращаем ID
  return test.id;
};

/**
 * Отображение категорий для шкалы дисфункциональных убеждений
 */
const renderDysfunctionalAttitudeScaleResults = (test: TestObject) => {
  if (!test.categoryResults) return null;
  
  return (
    <div className={styles.resultsContainer}>
      {test.categoryResults.map((result) => {
        const categoryDesc = CATEGORY_DESCRIPTIONS.find(desc => desc.category === result.category);
        if (!categoryDesc) return null;
        
        // Получаем описание в зависимости от значения
        const description = result.score >= 0 
          ? categoryDesc.positiveDescription 
          : categoryDesc.negativeDescription;
        
        return (
          <div 
            key={result.category} 
            className={`${styles.categoryResult} ${result.isStrength ? styles.strength : styles.weakness}`}
          >
            <div className={styles.categoryHeader}>
              <strong>{categoryDesc.title}:</strong>
              <span className={styles.score}>
                {result.score > 0 ? '+' : ''}{result.score}
              </span>
            </div>
            <p className={styles.categoryDescription}>
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const RenderTests: React.FC<RenderTestsProps> = ({ testResults, expandedTests, toggleTest }) => {
  if (!testResults || testResults.length === 0) {
    return <div className={styles.emptyState}>Нет пройденных тестов за этот день</div>;
  }

  return (
    <div className={styles.testsList}>
      {testResults.map(test => {
        const isExpanded = expandedTests.includes(test.id);
        // В разных интерфейсах тип может храниться в разных полях
        const testType = getTestType(test);
        const { name, hasDetails } = getTestDetails(testType);
        
        // Форматируем время
        const testTime = new Date(test.completedAt).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Стили для блока интерпретации
        const detailsBlockStyle: React.CSSProperties = {
          display: 'block',
          width: '100%',
          padding: '16px',
          boxSizing: 'border-box',
          borderTop: '1px solid #eaeaea',
          marginTop: '0',
          backgroundColor: 'white'
        };
        
        return (
          <div key={test.id} className={styles.test}>
            <div 
              className={styles.testHeader} 
              onClick={hasDetails ? () => toggleTest(test.id) : undefined}
              style={{ cursor: hasDetails ? 'pointer' : 'default' }}
            >
              <div className={styles.testInfo}>
                <div className={styles.testTitle}>
                  <span className={styles.testName}>{name}</span>
                  <span className={styles.testTime}>{testTime}</span>
                </div>
                <div className={styles.testScore}>
                  {test.score !== undefined && `Результат: ${test.score}`}
                  {test.maxScore !== undefined && ` из ${test.maxScore}`}
                </div>
              </div>
              
              {hasDetails && (
                <div className={styles.expandIconContainer}>
                  <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
                    {isExpanded ? '▼' : '►'}
                  </span>
                </div>
              )}
            </div>
            
            {isExpanded && (
              <div className={styles.testDetails} style={detailsBlockStyle}>
                {(testType === ACTIVITY_IDS.PROCRASTINATION_SCALE || testType === 'procrastination-scale') && (
                  <div className={styles.resultInterpretation}>
                    <h5>Интерпретация:</h5>
                    <p>{getProcrastinationResultInterpretation(Number(test.score))}</p>
                  </div>
                )}
                
                {(testType === ACTIVITY_IDS.BURNS_CHECKLIST || testType === 'burns-checklist') && (
                  <div className={styles.resultInterpretation}>
                    <h5>Интерпретация:</h5>
                    <p>{getBurnsChecklistInterpretation(Number(test.score))}</p>
                  </div>
                )}
                
                {(testType === ACTIVITY_IDS.NOVACO_SCALE || testType === 'survey-шкала-раздражения-новако') && (
                  <div className={styles.resultInterpretation}>
                    <h5>Интерпретация:</h5>
                    <p>{getNovacoScaleInterpretation(Number(test.score))}</p>
                  </div>
                )}
                
                {(testType === ACTIVITY_IDS.COGNITIVE_BIASES_TEST || testType === 'cognitive-biases-test') && (
                  <div className={styles.resultInterpretation}>
                    <h5>Интерпретация:</h5>
                    <p>{getCognitiveBiasesInterpretation(Number(test.score))}</p>
                  </div>
                )}
                
                {(testType === ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE || 
                  testType === 'dysfunctional-attitude-scale' || 
                  testType === 'das-exercise') && (
                  <div className={styles.resultInterpretation}>
                    <h5>Интерпретация:</h5>
                    {test.categoryResults && test.categoryResults.length > 0 ? (
                      renderDysfunctionalAttitudeScaleResults(test)
                    ) : (
                      <p>Результаты шкалы дисфункциональных убеждений указывают на ваши ключевые убеждения и установки.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RenderTests;
