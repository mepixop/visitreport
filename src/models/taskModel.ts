import mysql from 'mysql2/promise';
import { Status } from 'src/domain/enum';
import { Task } from 'src/domain/task';
import { User } from 'src/domain/user';

/**
 * Model for interacting with the 'task' table in the database.
 */
export class TaskModel {
  /**
   * @param {mysql.Connection} dbConnector A connection object to the database.
   */
  constructor(private dbConnector: mysql.Connection) {}

  private ONE_DAY = 24 * 60 * 60 * 1000;

  /**
   * Retrieves all active (not closed) tasks for a given user.
   * @param {User} user The user for whom to retrieve tasks.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
   */
  async getActiveTasksForUser(user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from task where assignedTo = ? and status != ?',
      [user.id, Status.Closed],
    );
    return Object.values(results).map((item) => this.toDomain(item, user));
  }

  /**
   * Retrieves all active or future-dated tasks for a given user.
   * @param {User} user The user for whom to retrieve tasks.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
   */
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

  /**
   * Retrieves all tasks for a specific visit report.
   * @param {number} id The ID of the visit report.
   * @param {User} user The user associated with the tasks.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
   */
  async getForVisitReport(id: number, user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from task where visitReportId = ?',
      [id],
    );
    return Object.values(results).map((item) => this.toDomain(item, user));
  }

  /**
   * Saves an array of task description strings as new tasks in the database.
   * @param {string[]} tasks An array of task descriptions.
   * @param {User} user The user to whom the tasks will be assigned.
   * @param {number} reportId The ID of the visit report to associate the tasks with.
   */
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

  /**
   * Updates the status of a specific task by its ID.
   * @param {number} taskId The ID of the task to update.
   * @param {string} newStatus The new status for the task.
   */
  async updateTaskById(taskId: number, newStatus: string) {
    const updateQuery = 'update task set status = ? where id = ?';
    await this.dbConnector.query(updateQuery, [newStatus, taskId]);
  }

  /**
   * Retrieves all active (not closed) tasks for a specific visit report.
   * @param {number} visitReportId The ID of the visit report.
   * @param {User} user The user associated with the tasks.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
   */
  async getActiveTasksForVisitReport(visitReportId: number, user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from task where visitReportId = ? and status != ?',
      [visitReportId, Status.Closed],
    );
    return Object.values(results).map((item) => this.toDomain(item, user));
  }

  /**
   * Gets the start of the current day.
   * @returns {Date} A Date object set to midnight of the current day.
   * @private
   */
  private getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /**
   * Gets the start of the day one week from now.
   * @returns {Date} A Date object set to midnight one week in the future.
   * @private
   */
  private getNextWeekMorning(): Date {
    const nextWeek = new Date(new Date().getTime() + 7 * this.ONE_DAY);
    const nextWeekMorning = new Date(
      nextWeek.getFullYear(),
      nextWeek.getMonth(),
      nextWeek.getDate(),
    );
    return nextWeekMorning;
  }

  /**
   * Converts a database row object into a Task domain object.
   * @param {any} item The raw database row.
   * @param {User} user The user to associate with the task.
   * @returns {Task} The Task domain object.
   * @private
   */
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
