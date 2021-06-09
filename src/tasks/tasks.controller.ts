import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/filter-task.dto';
import { TaskStatusValidatorPipe } from './pipes/task-status-validator.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) taskFilterDto: TaskFilterDto): Task[] {
    if (Object.keys(taskFilterDto).length) {
      return this.tasksService.getTasksWithFilters(taskFilterDto);
    }
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const newTask = this.tasksService.createTask(createTaskDto);
    return newTask;
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): string {
    const found  = this.getTaskById(id);
    this.tasksService.deleteTask(id);
    return 'Task deleted';
  }

  @Delete(':id')
  deleteTask2(@Param('id') id: string): void {
    this.tasksService.deleteTask2(id);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidatorPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
