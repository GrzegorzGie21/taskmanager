import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getAllTasks(taskFilterDto: TaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getAllTasks(taskFilterDto, user);
  }
  // getTasksWithFilters(taskFilterDto: TaskFilterDto): Task[] {
  //   const { status, searchTerm } = taskFilterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (searchTerm) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(searchTerm) ||
  //         task.description.includes(searchTerm),
  //     );
  //   }
  //   return tasks;
  // }
  // getTaskById(taskId: string): Task {
  //   const found = this.tasks.find((task: Task) => task.id === taskId);
  //   if (!found)
  //     throw new NotFoundException(`Task with id ${taskId} does not exist`);
  //   return found;
  // }

  async getTaskById(taskId: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id: taskId, userId: user.id },
    });

    if (!found)
      throw new NotFoundException(`There is no such task with id ${taskId}`);

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   // a good practice is to return a newly created resource (task in this case) - frontend devs love it!!! after return it also we want declare type Task of createTask method
  //   return task;
  // }

  async deleteTask(
    taskId: string, // error with number ????????
    user: User
  ): Promise<void> {
    const result = await this.taskRepository.delete({
      id: taskId,
      userId: user.id,
    });

    if (result.affected === 0)
      throw new NotFoundException(`There is no such task with id ${taskId}`);
  }

  // async removeTask(taskId: number): Promise<void> {
  //   const taskToRemove = await this.getTaskById(taskId);

  //   this.taskRepository.remove(taskToRemove);
  // }
  // deleteTask(taskId: string): string {
  //   const taskIndex = this.tasks.findIndex((task: Task) => task.id === taskId);
  //   this.tasks.splice(taskIndex, 1);
  //   return 'Task deleted';
  // }
  // deleteTask2(taskId: string): void {
  //   this.tasks = this.tasks.filter((task: Task) => task.id !== taskId);
  // }

  async updateTaskStatus(
    taskId: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId, user);

    task.status = status;
    await task.save();

    return task;
  }
  // updateTaskStatus(taskId: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(taskId); //this is ref to task object in an array
  //   task.status = status;
  //   // let updatedTask = this.tasks.find((task: Task) => task.id === taskId);
  //   // updatedTask = { ...updatedTask, status };
  //   // this.tasks.map((task: Task) =>
  //   //   task.id === taskId ? updatedTask : task,
  //   // );
  //   return task;
  // }
}
