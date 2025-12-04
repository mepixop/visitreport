import mysql from 'mysql2/promise';
import { Status } from 'src/domain/enum';
import { User } from 'src/domain/user';
import { VisitReport } from 'src/domain/visitReport';

export class VisitReportModel {
  constructor(private dbConnector: mysql.Connection) {}

  async getForUser(user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from visitReport where assignedTo = ?',
      [user.id],
    );
    return Object.values(results);
  }

  async getById(id: number) {
    const [results, _] = await this.dbConnector.query(
      'select * from visitReport where id = ?',
      [id],
    );
    return Object.values(results)[0];
  }
}
