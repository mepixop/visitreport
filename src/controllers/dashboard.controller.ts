import { Controller, Get, Post, Req, Res, Body } from '@nestjs/common';
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

  @Post()
  async dashbord(
    @Req() req: Request,
    @Res() res: Response,
    @Body('taskId') taskId: string,
    @Body('newStatus') newStatus: string,
    @Body('visitReportId') visitReportId: string,
  ) {
    console.log(
      'dashbord taskid: ',
      taskId,
      'status',
      newStatus,
      'VP',
      visitReportId,
    );
    await this.taskService.updateTaskStatus(taskId, newStatus, visitReportId);

    return res.json({
      message: 'update received for ',
      taskId,
      newStatus,
      visitReportId,
    });
  }
}
