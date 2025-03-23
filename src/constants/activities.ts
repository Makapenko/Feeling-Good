/**
 * Централизованное хранилище идентификаторов и названий активностей.
 * Используется для унификации идентификаторов во всём приложении.
 */

// Идентификаторы активностей
export const ACTIVITY_IDS = {
  // Основные активности
  WELCOME: 'welcome',
  TODAY_TASKS: 'today-tasks',
  PROGRESS_CALENDAR: 'progress-calendar',
  
  // Техники самопомощи
  THREE_COLUMNS_METHOD: 'three-columns-method',
  THOUGHT_DIARY: 'thought-diary',
  DAILY_SCHEDULE: 'daily-schedule',
  ANTI_PROCRASTINATION: 'anti-procrastination',
  PLEASURE_SHEET: 'pleasure-sheet',
  NO_BUTS: 'no-buts',
  SELF_SUPPORT: 'self-support',
  HINDERING_HELPING_THOUGHTS: 'hindering-helping-thoughts',
  SMALL_STEPS: 'small-steps',
  MOTIVATION_WITHOUT_COERCION: 'motivation-without-coercion',
  DISARMING_TECHNIQUE: 'disarming-technique',
  IMAGINE_SUCCESS: 'imagine-success',
  COUNT_ACHIEVEMENTS: 'count-achievements',
  CHECK_CANT_DO: 'check-cant-do',
  NO_LOSE_TECHNIQUE: 'no-lose-technique',
  SELF_ACTIVATION: 'self-activation',
  
  // Тесты и опросники
  BURNS_CHECKLIST: 'burns-checklist',
  COGNITIVE_BIASES: 'cognitive-biases',
  COGNITIVE_BIASES_TEST: 'cognitive-biases-test',
  NOVACO_SCALE: 'novaco-scale',
} as const;

// Типизированный объединенный тип из всех идентификаторов
export type ActivityId = typeof ACTIVITY_IDS[keyof typeof ACTIVITY_IDS];

// Названия активностей (человекочитаемые)
export const ACTIVITY_NAMES: Record<ActivityId, string> = {
  [ACTIVITY_IDS.WELCOME]: 'О проекте',
  [ACTIVITY_IDS.TODAY_TASKS]: 'Задачи на сегодня',
  [ACTIVITY_IDS.PROGRESS_CALENDAR]: 'Календарь прогресса',
  
  [ACTIVITY_IDS.THREE_COLUMNS_METHOD]: 'Метод трёх колонок',
  [ACTIVITY_IDS.THOUGHT_DIARY]: 'Дневник автоматических мыслей',
  [ACTIVITY_IDS.DAILY_SCHEDULE]: 'Расписание дня',
  [ACTIVITY_IDS.ANTI_PROCRASTINATION]: 'Листок антипрокрастинации',
  [ACTIVITY_IDS.PLEASURE_SHEET]: 'Листок предполагаемого удовольствия',
  [ACTIVITY_IDS.NO_BUTS]: 'Техника «Никаких но»',
  [ACTIVITY_IDS.SELF_SUPPORT]: 'Самоподдержка',
  [ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS]: 'Техника мешающих и помогающих мыслей',
  [ACTIVITY_IDS.SMALL_STEPS]: 'Метод маленьких шагов',
  [ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION]: 'Мотивация без принуждения',
  [ACTIVITY_IDS.DISARMING_TECHNIQUE]: 'Техника обезоруживания',
  [ACTIVITY_IDS.IMAGINE_SUCCESS]: 'Представьте успех',
  [ACTIVITY_IDS.COUNT_ACHIEVEMENTS]: 'Считайте достижения',
  [ACTIVITY_IDS.CHECK_CANT_DO]: 'Проверяйте свои «не могу»',
  [ACTIVITY_IDS.NO_LOSE_TECHNIQUE]: 'Беспроигрышная техника',
  [ACTIVITY_IDS.SELF_ACTIVATION]: 'Методы самоактивации',
  
  [ACTIVITY_IDS.BURNS_CHECKLIST]: 'Опросник депрессии Бернса',
  [ACTIVITY_IDS.COGNITIVE_BIASES]: 'Список когнитивных искажений',
  [ACTIVITY_IDS.COGNITIVE_BIASES_TEST]: 'Тест на когнитивные искажения',
  [ACTIVITY_IDS.NOVACO_SCALE]: 'Шкала раздражения Новако',
};

/**
 * Функция для получения названия активности по её ID
 */
export function getActivityName(id: ActivityId): string {
  return ACTIVITY_NAMES[id] || id;
}

/**
 * Массив всех идентификаторов активностей
 */
export const ALL_ACTIVITY_IDS = Object.values(ACTIVITY_IDS); 
