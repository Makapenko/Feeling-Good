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
  PROCRASTINATION_DIARY: 'procrastination-diary',
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
  HOT_COOL_THOUGHTS: 'hot-cool-thoughts',
  REWRITE_SHOULD_RULES: 'rewrite-should-rules',
  RATIONAL_RESPONSES: 'rational-responses',
  DOWNWARD_ARROW: 'downward-arrow',
  ADVANTAGES_DISADVANTAGES: 'advantages-disadvantages',
  REWRITE_BELIEF: 'rewrite-belief',
  VERBAL_JUDO: 'verbal-judo',
  ANGER_PROS_CONS: 'anger-pros-cons',
  CRITICISM_MANAGEMENT_METHODS: 'criticism-management-methods',
  // Тесты и опросники
  BURNS_CHECKLIST: 'burns-checklist',
  COGNITIVE_BIASES: 'cognitive-biases',
  COGNITIVE_BIASES_TEST: 'cognitive-biases-test',
  NOVACO_SCALE: 'novaco-scale',
  DYSFUNCTIONAL_ATTITUDE_SCALE: 'dysfunctional-attitude-scale',
  PROCRASTINATION_SCALE: 'procrastination-scale',
  IMAGERY_SCENES_DIARY: 'imagery-scenes-diary',
  REASONS_SHOULD_REFUTATION: 'reasons-should-refutation',
  SELF_WORTH_MEMO: 'self-worth-memo',
  REJECTION_RESPONSE: 'rejection-response',
  LOVE_ADDICTION_DISADVANTAGES: 'love-addiction-disadvantages',
  BELIEF_CORRECTION: 'belief-correction',
  SELF_CRITICISM_RESPONSE: 'self-criticism-response',
  SELF_ESTEEM_MEMO: 'self-esteem-memo',
  // Универсальные счётчики
  NEGATIVE_THOUGHTS_COUNTER: 'negative-thoughts-counter',
  SHOULD_COUNTER: 'should-counter',
  INNER_LIGHT: 'inner-light',
  DONE_RIGHT_COUNTER: 'done-right-counter',
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
  [ACTIVITY_IDS.PROCRASTINATION_DIARY]: 'Дневник прокрастинации',
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
  [ACTIVITY_IDS.HOT_COOL_THOUGHTS]: 'Остудите «горячие» мысли',
  [ACTIVITY_IDS.REWRITE_SHOULD_RULES]: 'Пересмотр правил со словом «должен»',
  [ACTIVITY_IDS.RATIONAL_RESPONSES]: 'Рациональные ответы на самокритику',
  [ACTIVITY_IDS.DOWNWARD_ARROW]: 'Техника падающей стрелы',
  [ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES]: 'Анализ преимуществ и недостатков убеждений',
  [ACTIVITY_IDS.VERBAL_JUDO]: 'Вербальное дзюдо',
  [ACTIVITY_IDS.ANGER_PROS_CONS]: 'Преимущества и недостатки гнева',
  [ACTIVITY_IDS.CRITICISM_MANAGEMENT_METHODS]: 'Методы управления критикой',
  
  [ACTIVITY_IDS.BURNS_CHECKLIST]: 'Опросник депрессии Бернса',
  [ACTIVITY_IDS.COGNITIVE_BIASES]: 'Список когнитивных искажений',
  [ACTIVITY_IDS.COGNITIVE_BIASES_TEST]: 'Тест на когнитивные искажения',
  [ACTIVITY_IDS.NOVACO_SCALE]: 'Шкала раздражения Новако',
  [ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE]: 'Шкала дисфункциональных убеждений',
  [ACTIVITY_IDS.REWRITE_BELIEF]: 'Переписывание убеждений',
  [ACTIVITY_IDS.PROCRASTINATION_SCALE]: 'Шкала иррациональной прокрастинации',
  [ACTIVITY_IDS.IMAGERY_SCENES_DIARY]: 'Дневник воображаемых сцен',
  [ACTIVITY_IDS.REASONS_SHOULD_REFUTATION]: 'Причины и опровержения "должен"-мышления',
  [ACTIVITY_IDS.SELF_WORTH_MEMO]: 'Памятка: как завоевать расположение людей',
  [ACTIVITY_IDS.REJECTION_RESPONSE]: 'Рациональные ответы на неодобрение',
  [ACTIVITY_IDS.LOVE_ADDICTION_DISADVANTAGES]: 'Недостатки любовной зависимости',
  [ACTIVITY_IDS.BELIEF_CORRECTION]: 'Корректировка убеждения',
  [ACTIVITY_IDS.SELF_CRITICISM_RESPONSE]: 'Ответы на самокритику',
  [ACTIVITY_IDS.SELF_ESTEEM_MEMO]: 'Памятка: четыре способа укрепить самооценку',
  [ACTIVITY_IDS.NEGATIVE_THOUGHTS_COUNTER]: 'Счётчик негативных мыслей',
  [ACTIVITY_IDS.SHOULD_COUNTER]: 'Счётчик «должен»-мышления',
  [ACTIVITY_IDS.INNER_LIGHT]: 'Включите «внутренний свет»',
  [ACTIVITY_IDS.DONE_RIGHT_COUNTER]: 'Счётчик правильных действий',
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
