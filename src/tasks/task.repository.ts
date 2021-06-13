import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./task-status.enum";
import { TaskFilterDto } from './dto/filter-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async getAllTasks(taskFilterDto: TaskFilterDto): Promise<Task[]> {
    const {status, searchTerm} = taskFilterDto;

    const query = this.createQueryBuilder('task');

    
    if (status) {
      query.andWhere('task.status = :status', {status})
    }

    if (searchTerm) {
      query.andWhere('(task.title LIKE :searchTerm OR task.description LIKE :searchTerm)', {searchTerm: `%${searchTerm}%`})
    }
    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const {title, description} = createTaskDto;

      const task = new Task();
      task.title = title;
      task.description = description;
      task.status = TaskStatus.OPEN;
      await task.save()

      return task;
  }
}