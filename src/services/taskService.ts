import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Task } from 'src/domain/task';
import { User } from 'src/domain/user';
import { getDbConnector } from 'src/models/dbConnector';
import { TaskModel } from 'src/models/taskModel';
import { UtilityService } from './utilityService';
import { VisitReportModel } from 'src/models/visitReportModel';

/**
 * Service for handling task-related operations.
 */
@Injectable()
export class TaskService {
  constructor(
    private configService: ConfigService,
    private utilityService: UtilityService,
  ) {}

  private oneDay = 24 * 60 * 60 * 1000;
  private taskModel: TaskModel;
  private visitReportModel: VisitReportModel;

  /**
   * Initializes the service by creating model instances if they don't exist.
   * This is a private helper method to ensure database connectors are ready.
   * @private
   */
  async _initialize() {
    if (!this.taskModel) {
      const connector = await getDbConnector(this.configService);
      this.taskModel = new TaskModel(connector);
      this.visitReportModel = new VisitReportModel(connector);
    }
  }

  /**
   * Retrieves and categorizes tasks for the user's dashboard.
   * Tasks are split into 'today', 'thisWeek', and 'remaining'.
   * @param {User} user The user for whom to retrieve tasks.
   * @returns {Promise<{today: Task[], thisWeek: Task[], remaining: Task[]}>} An object containing categorized tasks.
   */
  async getTasksForDashboard(user: User) {
    await this._initialize();

    const tasks = await this.taskModel.getActiveOrFutureTasksForUser(user);

    const today = new Date();
    const oneWeek = new Date(today.getTime() + 7 * this.oneDay);

    const todayTasks: Task[] = [];
    const thisWeekTasks: Task[] = [];
    const remainingTasks: Task[] = [];

    tasks.forEach((item) => {
      if (item.completeBy < today) {
        todayTasks.push(this.readableTask(item));
      } else if (item.completeBy < oneWeek) {
        thisWeekTasks.push(this.readableTask(item));
      } else {
        remainingTasks.push(this.readableTask(item));
      }
    });

    return {
      today: todayTasks,
      thisWeek: thisWeekTasks,
      remaining: remainingTasks,
    };
  }

  /**
   * Updates the status of a specific task.
   * If updating the task resolves all open tasks for a visit report, the report is closed.
   * @param {number} taskId The ID of the task to update.
   * @param {string} newStatus The new status for the task.
   * @param {number} visitReportId The ID of the associated visit report.
   * @param {User} user The user performing the update.
   */
  async updateTaskStatus(
    taskId: number,
    newStatus: string,
    visitReportId: number,
    user: User,
  ) {
    await this._initialize();

    await this.taskModel.updateTaskById(taskId, newStatus);
    const openTasks = await this.taskModel.getActiveTasksForVisitReport(
      visitReportId,
      user,
    );

    console.log(openTasks);
    console.log(openTasks.length);
    if (openTasks.length == 0) {
      await this.visitReportModel.closeVisitReport(visitReportId);
    }
  }

  /**
   * Converts the 'completeBy' date of a task to a readable format.
   * @param {Task} task The task object to modify.
   * @returns {Task} The task with a readable 'completeBy' date.
   */
  readableTask(task: Task): Task {
    task.completeBy = this.utilityService.readableDate(task.completeBy as Date);
    return task;
  }
}
