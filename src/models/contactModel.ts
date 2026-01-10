import mysql from 'mysql2/promise';
import { Contact } from 'src/domain/contact';
import { VisitReport } from 'src/domain/visitReport';

/**
 * Model for interacting with the 'contact' table in the database.
 */
export class ContactModel {
  /**
   * @param {mysql.Connection} dbConnector A connection object to the database.
   */
  constructor(private dbConnector: mysql.Connection) {}

  /**
   * Retrieves all contacts associated with a specific visit report.
   * @param {number} id The ID of the visit report.
   * @returns {Promise<Contact[]>} A promise that resolves to an array of Contact objects.
   */
  async getForVisitReport(id: number) {
    const [results, _] = await this.dbConnector.query(
      'select * from contact where visitReportId = ?',
      [id],
    );
    return Object.values(results).map((item) => this.toDomain(item));
  }

  /**
   * Saves the primary contact and all attendees for a given visit report.
   * @param {VisitReport} report The visit report domain object containing contact information.
   * @param {number} id The ID of the visit report to associate the contacts with.
   */
  async saveForVisitReport(report: VisitReport, id: number) {
    const insertQuery =
      'insert into contact(name, isPrimary, visitReportId) values(?,?,?)';
    await this.dbConnector.query(insertQuery, [
      report.primaryContact.name,
      report.primaryContact.isPrimary,
      id,
    ]);

    for (const attendee of report.attendees) {
      await this.dbConnector.query(insertQuery, [
        attendee.name,
        attendee.isPrimary,
        id,
      ]);
    }
  }

  /**
   * Converts a database row object into a Contact domain object.
   * @param {any} item The raw database row.
   * @returns {Contact} The Contact domain object.
   * @private
   */
  toDomain(item): Contact {
    return new Contact(
      item['id'],
      item['name'],
      item['isPrimary'],
      item['visitReportId'],
    );
  }
}
