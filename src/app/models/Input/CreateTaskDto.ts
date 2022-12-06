export class CreateTaskDto {
    task_type_id: number;
    experiment_id: number;
    name: string;
    start_date: string;
    end_date: string;
    duration: string;
    description: string;
    constructor() {}
  }