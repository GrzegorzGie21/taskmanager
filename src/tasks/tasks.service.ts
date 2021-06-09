import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(taskFilterDto: TaskFilterDto): Task[] {
    const { status, searchTerm } = taskFilterDto;

    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (searchTerm) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(searchTerm) ||
          task.description.includes(searchTerm),
      );
    }

    return tasks;
  }

  getTaskById(taskId: string): Task {
    const found = this.tasks.find((task: Task) => task.id === taskId);
    if (!found)
      throw new NotFoundException(`Task with id ${taskId} does not exist`);
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    // a good practice is to return a newly created resource (task in this case) - frontend devs love it!!! after return it also we want declare type Task of createTask method
    return task;
  }

  deleteTask(taskId: string): string {
    const taskIndex = this.tasks.findIndex((task: Task) => task.id === taskId);
    this.tasks.splice(taskIndex, 1);
    return 'Task deleted';
  }

  deleteTask2(taskId: string): void {
    this.tasks = this.tasks.filter((task: Task) => task.id !== taskId);
  }   

  updateTaskStatus(taskId: string, status: TaskStatus): Task {
    const task = this.getTaskById(taskId); //this is ref to task object in an array
    task.status = status;
    // let updatedTask = this.tasks.find((task: Task) => task.id === taskId);
    // updatedTask = { ...updatedTask, status };
    // this.tasks.map((task: Task) =>
    //   task.id === taskId ? updatedTask : task,
    // );

    return task;
  }
}
