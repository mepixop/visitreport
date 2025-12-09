import mysql from 'mysql2/promise';
import { Status } from 'src/domain/enum';
import { User } from 'src/domain/user';
import { VisitReport } from 'src/domain/visitReport';

/**
 * Model for interacting with the 'visitReport' table in the database.
 */
export class VisitReportModel {
  /**
   * @param {mysql.Connection} dbConnector A connection object to the database.
   */
  constructor(private dbConnector: mysql.Connection) {}

  /**
   * Retrieves all visit reports assigned to a specific user.
   * @param {User} user The user for whom to retrieve visit reports.
   * @returns {Promise<any[]>} A promise that resolves to an array of raw database rows.
   */
  async getForUser(user: User) {
    const [results, _] = await this.dbConnector.query(
      'select * from visitReport where assignedTo = ?',
      [user.id],
    );
    return Object.values(results);
  }

  /**
   * Retrieves a single visit report by its unique ID.
   * @param {number} id The ID of the visit report to retrieve.
   * @returns {Promise<any>} A promise that resolves to a single raw database row.
   */
  async getById(id: number) {
    const [results, _] = await this.dbConnector.query(
      'select * from visitReport where id = ?',
      [id],
    );
    return Object.values(results)[0];
  }

  /**
   * Saves a new visit report to the database.
   * @param {VisitReport} report The visit report domain object to save.
   * @returns {Promise<number>} A promise that resolves to the ID of the newly inserted report.
   */
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

  /**
   * Updates the status of a visit report to 'Closed'.
   * @param {number} reportId The ID of the visit report to close.
   */
  async closeVisitReport(reportId: number) {
    const updateQuery = 'update visitReport set status = ? where id = ?';
    await this.dbConnector.query(updateQuery, [Status.Closed, reportId]);
  }
}
