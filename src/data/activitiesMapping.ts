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
  'ch3-1': [ACTIVITY_IDS.COGNITIVE_BIASES, ACTIVITY_IDS.COGNITIVE_BIASES_TEST],
  'ch4-2': [ACTIVITY_IDS.THREE_COLUMNS_METHOD, ACTIVITY_IDS.THOUGHT_DIARY],
  'ch5-1': [ACTIVITY_IDS.DAILY_SCHEDULE],
  'ch5-2': [ACTIVITY_IDS.ANTI_PROCRASTINATION],
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
  'ch7-1': [ACTIVITY_IDS.NOVACO_SCALE],
  'ch7-4': [ACTIVITY_IDS.HOT_COOL_THOUGHTS],
  'ch7-6': [ACTIVITY_IDS.REWRITE_SHOULD_RULES],
  'ch9-3': [ACTIVITY_IDS.RATIONAL_RESPONSES],
  'ch10-0': [ACTIVITY_IDS.DOWNWARD_ARROW],
  'ch10-1': [ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE],
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
