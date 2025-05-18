import React from 'react';
import styles from './DayDetails.module.css';
import { ACTIVITY_IDS, ActivityId, ACTIVITY_NAMES } from '../../constants/activities';
import { procrastinationConfig } from '../Activities/ProcrastinationScale/procrastinationConfig';
import { CATEGORY_DESCRIPTIONS } from '../Activities/DysfunctionalAttitudeScale/dasConfig';
import { burnsConfig } from '../Activities/BurnsChecklist/burnsConfig';
import { novacoConfig } from '../Activities/NovacoScale/novacoConfig';

// Интерфейс для минимального объекта теста
interface TestObject {
  id: string;
  content?: string;
  type?: string;
  name?: string;
  score?: number;
  maxScore?: number;
  completedAt: string;
  categoryResults?: Array<{ category: string, score: number, isStrength: boolean }>;
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
      ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE
    ];

    // Используем простую проверку на наличие значения в массиве
    const isDetailedTest = testsWithDetails.some(id => id === activityId);

    return {
      name: activityId === ACTIVITY_IDS.COGNITIVE_BIASES_TEST ?
        'Тест на понимание когнитивных искажений' :
        ACTIVITY_NAMES[activityId],
      config: activityId === ACTIVITY_IDS.PROCRASTINATION_SCALE ? procrastinationConfig :
        activityId === ACTIVITY_IDS.BURNS_CHECKLIST ? burnsConfig :
          activityId === ACTIVITY_IDS.NOVACO_SCALE ? novacoConfig : null,
      hasDetails: isDetailedTest
    };
  }

  // Дополнительная проверка для ID из конфигураций
  switch (testType) {
    case ACTIVITY_IDS.PROCRASTINATION_SCALE:
      return {
        name: ACTIVITY_NAMES[ACTIVITY_IDS.PROCRASTINATION_SCALE],
        config: procrastinationConfig,
        hasDetails: true
      };
    case ACTIVITY_IDS.BURNS_CHECKLIST: 
      return {
        name: ACTIVITY_NAMES[ACTIVITY_IDS.BURNS_CHECKLIST],
        config: burnsConfig,
        hasDetails: true
      };
    case ACTIVITY_IDS.NOVACO_SCALE: 
      return {
        name: ACTIVITY_NAMES[ACTIVITY_IDS.NOVACO_SCALE],
        config: novacoConfig,
        hasDetails: true
      };
    case ACTIVITY_IDS.COGNITIVE_BIASES_TEST: 
      return {
        name: 'Тест на понимание когнитивных искажений',
        config: null,
        hasDetails: false
      };
    case ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE: 
      return {
        name: ACTIVITY_NAMES[ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE],
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
 * Получить интерпретацию результатов опросника Бернса из конфига
 */
const getBurnsChecklistInterpretation = (score: number) => {
  const { results } = burnsConfig;
  const result = results.find(
    r => score >= r.minScore && score <= r.maxScore
  );

  return result ? result.description : 'Интерпретация не найдена';
};

/**
 * Получить интерпретацию результатов шкалы раздражения Новако из конфига
 */
const getNovacoScaleInterpretation = (score: number) => {
  const { results } = novacoConfig;
  const result = results.find(
    r => score >= r.minScore && score <= r.maxScore
  );

  return result ? result.description : 'Интерпретация не найдена';
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
        const testType = test.id;
        const { name, hasDetails } = getTestDetails(testType);

        // Форматируем время
        const testTime = new Date(test.completedAt).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        });



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
              <div className={styles.testDetails}>
                {(testType === ACTIVITY_IDS.PROCRASTINATION_SCALE) && (
                  <div className={styles.resultInterpretation}>
                    <h5>Интерпретация:</h5>
                    <p>{getProcrastinationResultInterpretation(Number(test.score))}</p>
                  </div>
                )}

                {(testType === ACTIVITY_IDS.BURNS_CHECKLIST) && (
                  <div className={styles.resultInterpretation}>
                    <h5>Интерпретация:</h5>
                    <p>{getBurnsChecklistInterpretation(Number(test.score))}</p>
                  </div>
                )}

                {(testType === ACTIVITY_IDS.NOVACO_SCALE) && (
                  <div className={styles.resultInterpretation}>
                    <h5>Интерпретация:</h5>
                    <p>{getNovacoScaleInterpretation(Number(test.score))}</p>
                  </div>
                )}

                {(testType === ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE) && (
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
