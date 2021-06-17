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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/filter-task.dto';
import { TaskStatusValidatorPipe } from './pipes/task-status-validator.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) taskFilterDto: TaskFilterDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.getAllTasks(taskFilterDto, user);
  }

  @Get(':id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const newTask = this.tasksService.createTask(createTaskDto, user);
    return newTask;
  }

  // @Delete(':id')
  // deleteTask(@Param('id') id: string): string {
  //   const found  = this.getTaskById(id);
  //   this.tasksService.deleteTask(id);
  //   return 'Task deleted';
  // }

  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: string, // error with number ????????
    @GetUser() user: User,
  ): Promise<void> {
    console.log(typeof id);
    
    return this.tasksService.deleteTask(id, user);
  }

  // @Delete(':id')
  // removeTask(@Param('id') id: number): void {
  //   this.tasksService.removeTask(id);
  // }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: number,
    @Body('status', TaskStatusValidatorPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
