import React from 'react';
import styles from './ActivitiesPanel.module.css';
import { useProgress } from '../../store/ProgressContext';
import { SpecialContent } from '../../store/ProgressContext';
import { getAvailableActivities } from '../../data/activitiesMapping';

interface ActivityButton {
  content: SpecialContent;
  label: string;
}

interface ActivitySection {
  title: string;
  buttons: ActivityButton[];
}

const activitySections: ActivitySection[] = [
  {
    title: 'Теория',
    buttons: [
      { content: 'burns-checklist', label: 'Опросник депрессии Бернса' },
      { content: 'cognitive-biases', label: 'Список когнитивных искажений' },
      { content: 'cognitive-biases-test', label: 'Тест на когнитивные искажения' },
    ]
  },
  {
    title: 'Самооценка',
    buttons: [
      { content: 'three-columns-method', label: 'Метод трёх колонок' },
      { content: 'thought-diary', label: 'Дневник автоматических мыслей' },
    ]
  },
  {
    title: 'Прокрастинация',
    buttons: [
      { content: 'self-activation', label: 'Методы самоактивации' },
      { content: 'daily-schedule', label: 'Расписание дня' },
      { content: 'anti-procrastination', label: 'Листок антипрокрастинации' },
      { content: 'thought-diary', label: 'Дневник автоматических мыслей' },
      { content: 'pleasure-sheet', label: 'Листок предполагаемого удовольствия' },
      { content: 'no-buts', label: 'Техника «Никаких но»' },
      { content: 'self-support', label: 'Самоподдержка' },
      { content: 'hindering-helping-thoughts', label: 'Техника мешающих и помогающих мыслей' },
      { content: 'small-steps', label: 'Метод маленьких шагов' },
      { content: 'motivation-without-coercion', label: 'Мотивация без принуждения' },
      { content: 'disarming-technique', label: 'Техника обезоруживания' },
      { content: 'imagine-success', label: 'Представьте успех' },
      { content: 'count-achievements', label: 'Считайте достижения' },
      { content: 'check-cant-do', label: 'Проверьте свои "не могу"' },
      { content: 'no-lose-technique', label: 'Беспроигрышная техника' },
    ]
  },
  {
    title: 'Раздражение',
    buttons: [
      { content: 'novaco-scale', label: 'Шкала раздражения Новако' }
    ]
  }
];

const ActivitiesPanel: React.FC = () => {
  const { progress, dispatch } = useProgress();
  const availableActivities = getAvailableActivities(progress.unlockedContent?.chapters || []);

  const handleActivityClick = (content: SpecialContent) => {
    dispatch({
      type: 'SET_SPECIAL_CONTENT',
      content: content as SpecialContent
    });
  };

  // Фильтруем секции, чтобы показывать только те, в которых есть доступные активности
  const filteredSections = activitySections.map(section => ({
    ...section,
    buttons: section.buttons.filter(button => availableActivities.has(button.content))
  })).filter(section => section.buttons.length > 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Доступные задания</h2>

      <div className={styles.sections}>
        {filteredSections.map((section) => (
          <div key={section.title} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            <div className={styles.specialTools}>
              {section.buttons.map((button) => (
                <button
                  key={button.content}
                  onClick={() => handleActivityClick(button.content)}
                  className={progress.specialContent === button.content ? styles.active : ''}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.activeTasksList}>
        <h3>Текущие задания:</h3>
        <ul>
        </ul>
      </div>
    </div>
  );
};

export default ActivitiesPanel; 
