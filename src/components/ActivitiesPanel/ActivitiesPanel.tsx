import React from 'react';
import styles from './ActivitiesPanel.module.css';
import { useAppDispatch, useUnlockedContent, useSpecialContent } from '../../redux/hooks';
import { setSpecialContent } from '../../redux/slices/progressSlice';
import { SpecialContent } from '../../types/progress.types';
import { getAvailableActivities } from '../../data/activitiesMapping';
import { ACTIVITY_IDS } from '../../constants/activities';

// TODO - упорядочить согласно главам книги

interface ActivityItem {
  content: SpecialContent;
  label: string;
}

interface ActivitySection {
  title: string;
  activities: ActivityItem[];
}

const sections: ActivitySection[] = [
  {
    title: 'Оценка состояния',
    activities: [
      { content: ACTIVITY_IDS.BURNS_CHECKLIST, label: 'Опросник депрессии Бернса' },
      { content: ACTIVITY_IDS.PROCRASTINATION_SCALE, label: 'Шкала иррациональной прокрастинации' },
      { content: ACTIVITY_IDS.NOVACO_SCALE, label: 'Шкала раздражения Новако' },
      { content: ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE, label: 'Шкала дисфункциональных убеждений' },
    ]
  },
  {
    title: 'Когнитивные искажения',
    activities: [
      { content: ACTIVITY_IDS.COGNITIVE_BIASES, label: 'Список когнитивных искажений' },
      { content: ACTIVITY_IDS.COGNITIVE_BIASES_TEST, label: 'Тест на когнитивные искажения' },
    ]
  },
  {
    title: 'Самооценка',
    activities: [
      { content: ACTIVITY_IDS.THREE_COLUMNS_METHOD, label: 'Метод трёх колонок' },
      { content: ACTIVITY_IDS.THOUGHT_DIARY, label: 'Дневник автоматических мыслей' },
      { content: ACTIVITY_IDS.NEGATIVE_THOUGHTS_COUNTER, label: 'Счётчик негативных мыслей' },
    ]
  },
  {
    title: 'Прокрастинация',
    activities: [
      { content: ACTIVITY_IDS.PROCRASTINATION_SCALE, label: 'Шкала иррациональной прокрастинации' },
      { content: ACTIVITY_IDS.SELF_ACTIVATION, label: 'Методы самоактивации' },
      { content: ACTIVITY_IDS.DAILY_SCHEDULE, label: 'Расписание дня' },
      { content: ACTIVITY_IDS.ANTI_PROCRASTINATION, label: 'Листок антипрокрастинации' },
      { content: ACTIVITY_IDS.PROCRASTINATION_DIARY, label: 'Дневник прокрастинации' },
      { content: ACTIVITY_IDS.PLEASURE_SHEET, label: 'Листок предполагаемого удовольствия' },
      { content: ACTIVITY_IDS.NO_BUTS, label: 'Техника «Никаких но»' },
      { content: ACTIVITY_IDS.SELF_SUPPORT, label: 'Самоподдержка' },
      { content: ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS, label: 'Техника мешающих и помогающих мыслей' },
      { content: ACTIVITY_IDS.SMALL_STEPS, label: 'Метод маленьких шагов' },
      { content: ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION, label: 'Мотивация без принуждения' },
      { content: ACTIVITY_IDS.DISARMING_TECHNIQUE, label: 'Техника обезоруживания' },
      { content: ACTIVITY_IDS.IMAGINE_SUCCESS, label: 'Представьте успех' },
      { content: ACTIVITY_IDS.COUNT_ACHIEVEMENTS, label: 'Считайте достижения' },
      { content: ACTIVITY_IDS.CHECK_CANT_DO, label: 'Проверьте свои "не могу"' },
      { content: ACTIVITY_IDS.NO_LOSE_TECHNIQUE, label: 'Беспроигрышная техника' }
    ]
  },
  {
    title: 'Работа с критикой',
    activities: [
      { content: ACTIVITY_IDS.VERBAL_JUDO, label: 'Вербальное дзюдо' },
      { content: ACTIVITY_IDS.CRITICISM_MANAGEMENT_METHODS, label: 'Методы управления критикой' }
    ]
  },
  {
    title: 'Управление гневом',
    activities: [
      { content: ACTIVITY_IDS.NOVACO_SCALE, label: 'Шкала раздражения Новако' },
      { content: ACTIVITY_IDS.ANGER_PROS_CONS, label: 'Преимущества и недостатки гнева' },
      { content: ACTIVITY_IDS.HOT_COOL_THOUGHTS, label: 'Остудите «горячие» мысли' },
      { content: ACTIVITY_IDS.IMAGERY_SCENES_DIARY, label: 'Дневник воображаемых сцен' },
      { content: ACTIVITY_IDS.REWRITE_SHOULD_RULES, label: 'Пересмотр правил со словом «должен»' },
      { content: ACTIVITY_IDS.REASONS_SHOULD_REFUTATION, label: 'Причины и опровержение убеждений' },
    ]
  },
  {
    title: 'Работа с мыслями',
    activities: [
      { content: ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS, label: 'Мешающие и помогающие мысли' },
    ]
  },
  {
    title: 'Преодоление депрессии',
    activities: [
      { content: ACTIVITY_IDS.RATIONAL_RESPONSES, label: 'Рациональные ответы на самокритику' },
      { content: ACTIVITY_IDS.DOWNWARD_ARROW, label: 'Техника падающей стрелы' }
    ]
  },
  {
    title: 'Зависимость от одобрения',
    activities: [
      { content: ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES, label: 'Анализ преимуществ и недостатков убеждений' },
      { content: ACTIVITY_IDS.REWRITE_BELIEF, label: 'Переписывание убеждений' },
      { content: ACTIVITY_IDS.SELF_WORTH_MEMO, label: 'Как завоевать расположение людей' },
      { content: ACTIVITY_IDS.REJECTION_RESPONSE, label: 'Рациональные ответы на неодобрение' },
      { content: ACTIVITY_IDS.LOVE_ADDICTION_DISADVANTAGES, label: 'Недостатки любовной зависимости' },
      { content: ACTIVITY_IDS.BELIEF_CORRECTION, label: 'Корректировка убеждения' },
      { content: ACTIVITY_IDS.INNER_LIGHT, label: 'Включите «внутренний свет»' },
    ]
  },
  {
    title: 'Работа с чувством вины',
    activities: [
      { content: ACTIVITY_IDS.SHOULD_COUNTER, label: 'Счётчик «должен»-мышления' },
    ]
  },
  {
    title: 'Работа и ценность',
    activities: [
      { content: ACTIVITY_IDS.SELF_CRITICISM_RESPONSE, label: 'Ответы на самокритику' },
      { content: ACTIVITY_IDS.SELF_ESTEEM_MEMO, label: 'Четыре способа укрепить самооценку' },
    ]
  },
  {
    title: 'Перфекционизм',
    activities: [
      { content: ACTIVITY_IDS.DONE_RIGHT_COUNTER, label: 'Счётчик правильных действий' },
    ]
  },
];

const ActivitiesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const unlockedContent = useUnlockedContent();
  const specialContent = useSpecialContent();
  const availableActivities = getAvailableActivities(unlockedContent?.chapters || []);

  const handleActivityClick = (content: SpecialContent) => {
    dispatch(setSpecialContent(content));
    window.scrollTo(0, 0);
  };

  // Фильтруем секции, чтобы показывать только те, в которых есть доступные активности
  const filteredSections = sections.map(section => ({
    ...section,
    buttons: section.activities.filter(activity => availableActivities.has(activity.content))
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
                  className={specialContent === button.content ? styles.active : ''}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesPanel; 
