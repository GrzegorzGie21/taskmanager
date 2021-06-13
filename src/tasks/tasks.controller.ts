import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/filter-task.dto';
import { TaskStatusValidatorPipe } from './pipes/task-status-validator.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) taskFilterDto: TaskFilterDto) {
    return this.tasksService.getAllTasks(taskFilterDto);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const newTask = this.tasksService.createTask(createTaskDto);
    return newTask;
  }

  // @Delete(':id')
  // deleteTask(@Param('id') id: string): string {
  //   const found  = this.getTaskById(id);
  //   this.tasksService.deleteTask(id);
  //   return 'Task deleted';
  // }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  // @Delete(':id')
  // removeTask(@Param('id') id: number): void {
  //   this.tasksService.removeTask(id);
  // }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: number,
    @Body('status', TaskStatusValidatorPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
