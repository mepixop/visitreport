import mysql from 'mysql2/promise';
import { Status } from 'src/domain/enum';
import { Task } from 'src/domain/task';
import { User } from 'src/domain/user';

export class TaskModel {
  constructor(private dbConnector: mysql.Connection) {}

  private ONE_DAY = 24 * 60 * 60 * 1000;

  async getActiveTasksForUser(user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from task where assignedTo = ? and status != ?',
      [user.id, Status.Closed],
    );
    return Object.values(results).map((item) => this.toDomain(item, user));
  }

  async getActiveOrFutureTasksForUser(user: User) {
    const query =
      'select * from task where assignedTo = ? and (status != ? OR completeBy >= ?)';
    const [results, _] = await this.dbConnector.query(query, [
      user.id,
      Status.Closed,
      this.getToday(),
    ]);
    return Object.values(results).map((item) => this.toDomain(item, user));
  }

  async getForVisitReport(id: number, user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from task where visitReportId = ?',
      [id],
    );
    return Object.values(results).map((item) => this.toDomain(item, user));
  }

  async saveTaskStrings(tasks: string[], user: User, reportId: number) {
    const insertQuery =
      'insert into task(description,status,assignedTo,completeBy,visitReportId) values (?,?,?,?,?)';
    for (const task of tasks) {
      await this.dbConnector.query(insertQuery, [
        task,
        Status.Open,
        user.id,
        this.getNextWeekMorning(),
        reportId,
      ]);
    }
  }

  async updateTaskById(taskId: number, newStatus: string) {
    const updateQuery = 'update task set status = ? where id = ?';
    await this.dbConnector.query(updateQuery, [newStatus, taskId]);
  }

  async getActiveTasksForVisitReport(visitReportId: number, user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from task where visitReportId = ? and status != ?',
      [visitReportId, Status.Closed],
    );
    return Object.values(results).map((item) => this.toDomain(item, user));
  }

  private getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private getNextWeekMorning(): Date {
    const nextWeek = new Date(new Date().getTime() + 7 * this.ONE_DAY);
    const nextWeekMorning = new Date(
      nextWeek.getFullYear(),
      nextWeek.getMonth(),
      nextWeek.getDate(),
    );
    return nextWeekMorning;
  }

  private toDomain(item: Object, user: User): Task {
    return new Task(
      parseInt(item['id']),
      item['description'],
      item['status'],
      user,
      new Date(item['completeBy']),
      item['visitReportId'],
    );
  }
}
