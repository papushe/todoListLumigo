import {TaskActions, TaskType} from '../interfaces-and-types/common-types';

export const ITEMS_LOCALSTORAGE_KEY = 'items';

export enum TASKS_NUMBER {
  IN_PROGRESS,
  POSTPONED,
  COMPLETED
}

export const TASKS_STATUS = {
  IN_PROGRESS: {
    text: 'In progress',
    type: 'in-progress' as TaskType,
    icon: 'clear',
    availableActions: ['clear', 'pause', 'done'] as TaskActions[]
  },
  POSTPONED: {
    text: 'Postponed',
    type: 'postponed' as TaskType,
    icon: 'pause',
    availableActions: ['clear', 'done'] as TaskActions[]
  },
  COMPLETED: {
    text: 'Completed',
    type: 'completed' as TaskType,
    icon: 'done',
    availableActions: ['clear', 'pause'] as TaskActions[]
  },
};
