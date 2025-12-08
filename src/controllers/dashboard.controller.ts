import { Controller, Get, Post, Req, Res, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Status } from 'src/domain/enum';
import { User } from 'src/domain/user';
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

  @Post()
  async dashbord(@Req() req: Request, @Res() res: Response) {
    const user = req['loggedInUser'];

    const taskId = parseInt(req.body['taskId']);
    const newStatus = req.body['newStatus'];
    const visitReportId = parseInt(req.body['visitReportId']);

    await this.taskService.updateTaskStatus(
      taskId,
      newStatus,
      visitReportId,
      user,
    );

    return res.json({
      message: 'update received for ',
      taskId,
      newStatus,
      visitReportId,
    });
  }
}
