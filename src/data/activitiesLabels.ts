import { SpecialContent } from '../types/progress.types';
import { ACTIVITY_NAMES } from '../constants/activities';

// Словарь названий активностей - перенаправляем к централизованному хранилищу
export const activityLabels: Record<SpecialContent, string> = ACTIVITY_NAMES;
