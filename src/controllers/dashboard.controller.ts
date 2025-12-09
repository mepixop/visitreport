import { Controller, Get, Post, Req, Res, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Status } from 'src/domain/enum';
import { User } from 'src/domain/user';
import { TaskService } from 'src/services/taskService';

/**
 * Controller for handling dashboard-related requests.
 */
@Controller('dashboard')
export class DashboardController {
  constructor(
    private configService: ConfigService,
    private taskService: TaskService,
  ) {}

  /**
   * Renders the dashboard page with tasks for the logged-in user.
   * @param {Request} req The Express request object, containing the logged-in user.
   * @param {Response} res The Express response object, used to render the view.
   */
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

  /**
   * Handles the HTTP POST request to update a task's status.
   * @param {Request} req The Express request object, containing task details.
   * @param {Response} res The Express response object, used to send a JSON response.
   * @returns {Response} A JSON object confirming the update.
   */
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
