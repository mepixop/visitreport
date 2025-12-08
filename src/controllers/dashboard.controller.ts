import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { Status } from 'src/domain/enum';
import { User } from 'src/domain/user';
import { getDbConnector } from 'src/models/dbConnector';
import { TaskModel } from 'src/models/taskModel';
import { TaskService } from 'src/services/taskService';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private configService: ConfigService,
    private taskService: TaskService,
  ) {}

  @Get()
  async dashboard(@Req() req: Request, @Res() res: Response) {
    const user = req['loggedInUser'] as User;
    const statusOptions = Status;

    const tasks = await this.taskService.getTasksForDashboard(user);
    res.render('dashboard', {
      tasks: tasks,
      user: user,
      statusOptions: statusOptions,
    });
  }
}
