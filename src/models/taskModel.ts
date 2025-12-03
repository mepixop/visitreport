import mysql from 'mysql2/promise';
import { Task } from 'src/domain/task';
import { User } from 'src/domain/user';

export class TaskModel {
  constructor(private dbConnector: mysql.Connection) {}

  async getActiveTasksForUser(user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from task where assignedTo = ? and status != ?',
      [user.id, 'Closed'],
    );

    return Object.values(results).map((item) => this.toDomain(item, user));
  }

  toDomain(item: Object, user: User): Task {
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
