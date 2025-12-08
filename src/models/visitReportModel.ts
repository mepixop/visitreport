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

  async saveVisitReport(report: VisitReport) {
    const [result, _] = await this.dbConnector.query(
      'insert into visitReport' +
        '(status, assignedTo, topic, type, startTime, endTime, outcome, notes, followUp)' +
        ' values (?,?,?,?,?,?,?,?,?)',
      [
        report.status,
        report.assignedTo.id,
        report.topic,
        report.type,
        report.startTime,
        report.endTime,
        report.outcome,
        report.notes,
        report.followUp,
      ],
    );
    return result['insertId'];
  }

  async closeVisitReport(reportId: number) {
    const updateQuery = 'update visitReport set status = ? where id = ?';
    await this.dbConnector.query(updateQuery, [Status.Closed, reportId]);
  }
}
