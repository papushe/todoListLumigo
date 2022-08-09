import {TaskType} from './common-types';

export interface Task {
  id: number;
  text: string;
  status: TaskType;
}
