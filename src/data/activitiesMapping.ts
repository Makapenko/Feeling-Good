import { SpecialContent } from '../store/ProgressContext';

// Список всех доступных активностей
export const allActivities: SpecialContent[] = [
  'burns-checklist',
  'cognitive-biases',
  'cognitive-biases-test',
  'three-columns-method',
  'thought-diary',
  'self-activation',
  'daily-schedule',
  'anti-procrastination',
  'pleasure-sheet',
  'no-buts',
  'self-support',
  'hindering-helping-thoughts',
  'small-steps',
  'motivation-without-coercion',
  'disarming-technique',
  'imagine-success',
  'count-achievements',
  'check-cant-do',
  'no-lose-technique',
  'novaco-scale'
];

// Маппинг подглав к активностям, которые они открывают
export const chapterToActivitiesMap: Record<string, SpecialContent[]> = {
  'ch2': ['burns-checklist'],
  'ch3-1': ['cognitive-biases', 'cognitive-biases-test'],
  'ch4-2': ['three-columns-method', 'thought-diary'],
  'ch5-1': ['daily-schedule'],
  'ch5-2': ['anti-procrastination'],
  'ch5-4': ['pleasure-sheet'],
  'ch5-5': ['no-buts'],
  'ch5-6': ['self-support'],
  'ch5-7': ['hindering-helping-thoughts'],
  'ch5-8': ['small-steps'],
  'ch5-9': ['motivation-without-coercion'],
  'ch5-10': ['disarming-technique'],
  'ch5-11': ['imagine-success'],
  'ch5-12': ['count-achievements'],
  'ch5-13': ['check-cant-do'],
  'ch5-14': ['no-lose-technique'],
  'ch5-15': ['self-activation',],
  'ch7-1': ['novaco-scale'],

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
