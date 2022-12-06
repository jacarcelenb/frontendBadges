import { ExperimentsListDto } from './ExperimentsListDto';
import { TaskTypeListDto } from './TaskTypeListDto';
export class TaskListDto {
  id: number;
  task_type_id: number;
  experiment_id: number;
  name: string;
  start_date: string;
  end_date: string;
  duration: string;
  description: string;
  task_type: TaskTypeListDto
  experiment: ExperimentsListDto
  constructor() {}
}
