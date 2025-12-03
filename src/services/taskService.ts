import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Task } from 'src/domain/task';
import { User } from 'src/domain/user';
import { getDbConnector } from 'src/models/dbConnector';
import { TaskModel } from 'src/models/taskModel';
import { UtilityService } from './utilityService';

@Injectable()
export class TaskService {
  constructor(
    private configService: ConfigService,
    private utilityService: UtilityService,
  ) {}

  private oneDay = 24 * 60 * 60 * 1000;
  private taskModel: TaskModel;

  async _initialize() {
    if (!this.taskModel) {
      const connector = await getDbConnector(this.configService);
      this.taskModel = new TaskModel(connector);
    }
  }

  async getTasksForDashboard(user: User) {
    await this._initialize();

    const tasks = await this.taskModel.getActiveTasksForUser(user);

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

  readableTask(task: Task): Task {
    task.completeBy = this.utilityService.readableDate(task.completeBy as Date);
    return task;
  }
}
