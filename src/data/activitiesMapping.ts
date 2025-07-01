import { SpecialContent } from '../types/progress.types';
import { ACTIVITY_IDS, ALL_ACTIVITY_IDS } from '../constants/activities';

// Список всех доступных активностей
export const allActivities: SpecialContent[] = ALL_ACTIVITY_IDS.filter(id => 
  id !== ACTIVITY_IDS.WELCOME && 
  id !== ACTIVITY_IDS.TODAY_TASKS && 
  id !== ACTIVITY_IDS.PROGRESS_CALENDAR
);

// Маппинг подглав к активностям, которые они открывают
export const chapterToActivitiesMap: Record<string, SpecialContent[]> = {
  'ch2': [ACTIVITY_IDS.BURNS_CHECKLIST],
  // Когнитивные искажения
  'ch3-0': [ACTIVITY_IDS.COGNITIVE_BIASES],
  'ch3-1': [ACTIVITY_IDS.COGNITIVE_BIASES_TEST],
  // Самооценка
  'ch4-2': [ACTIVITY_IDS.THREE_COLUMNS_METHOD, ACTIVITY_IDS.THOUGHT_DIARY],
  // Прокрастинация
  'ch5-0': [ACTIVITY_IDS.PROCRASTINATION_SCALE],
  'ch5-1': [ACTIVITY_IDS.DAILY_SCHEDULE],
  'ch5-2': [ACTIVITY_IDS.ANTI_PROCRASTINATION],
  'ch5-3': [ACTIVITY_IDS.PROCRASTINATION_DIARY],
  'ch5-4': [ACTIVITY_IDS.PLEASURE_SHEET],
  'ch5-5': [ACTIVITY_IDS.NO_BUTS],
  'ch5-6': [ACTIVITY_IDS.SELF_SUPPORT],
  'ch5-7': [ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS],
  'ch5-8': [ACTIVITY_IDS.SMALL_STEPS],
  'ch5-9': [ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION],
  'ch5-10': [ACTIVITY_IDS.DISARMING_TECHNIQUE],
  'ch5-11': [ACTIVITY_IDS.IMAGINE_SUCCESS],
  'ch5-12': [ACTIVITY_IDS.COUNT_ACHIEVEMENTS],
  'ch5-13': [ACTIVITY_IDS.CHECK_CANT_DO],
  'ch5-14': [ACTIVITY_IDS.NO_LOSE_TECHNIQUE],
  'ch5-15': [ACTIVITY_IDS.SELF_ACTIVATION],
  // Работа с критикой
  'ch6-0': [ACTIVITY_IDS.VERBAL_JUDO],
  'ch6-4': [ACTIVITY_IDS.CRITICISM_MANAGEMENT_METHODS],
  // Управление гневом
  'ch7-1': [ACTIVITY_IDS.NOVACO_SCALE],
  'ch7-3': [ACTIVITY_IDS.ANGER_PROS_CONS],
  'ch7-4': [ACTIVITY_IDS.HOT_COOL_THOUGHTS],
  'ch7-5': [ACTIVITY_IDS.IMAGERY_SCENES_DIARY],
  'ch7-6': [ACTIVITY_IDS.REWRITE_SHOULD_RULES],
  // ch7-7 - потом решить добавлять или нет
  'ch7-9': [ACTIVITY_IDS.REASONS_SHOULD_REFUTATION],
  // ch7-10 - потом решить - памятка по ведению переговоров
  // ch7-11 - Поставить себя на место противника
  // ch7-12 TODO - Написать список ситуаций которые вызывают гнев и отранжировать их. Кажды вечер - представлять ситуацию, и как вы выбираетесь из неё в положительном сценарии, написать сколько гнева испытываешь в результате, повторять каждый день, так же записывать горячие и прохладные мысли по поводу ситуации
  // TODO: Сделать обобщающий компонент с советами по остальным занятиям 7 главы

  'ch9-3': [ACTIVITY_IDS.RATIONAL_RESPONSES],
  
  'ch10-0': [ACTIVITY_IDS.DOWNWARD_ARROW],
  'ch10-1': [ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE],
  // 'ch11-2': [ACTIVITY_IDS.PROS_CONS_ANALYSIS],
  'ch11-3': [ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES],
};

// Получить все активности, доступные для данного набора глав
export const getAvailableActivities = (unlockedChapters: string[]): Set<SpecialContent> => {
  const availableActivities = new Set<SpecialContent>();
  
  // Если все главы разблокированы, возвращаем все активности
  if (unlockedChapters.includes('all')) {
    return new Set(allActivities);
  }
  
  unlockedChapters.forEach(chapterId => {
    const activities = chapterToActivitiesMap[chapterId];
    if (activities) {
      activities.forEach(activity => availableActivities.add(activity));
    }
  });
  
  return availableActivities;
}; 
