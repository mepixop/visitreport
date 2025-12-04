import mysql from 'mysql2/promise';
import { Contact } from 'src/domain/contact';
import { VisitReport } from 'src/domain/visitReport';
export class ContactModel {
  constructor(private dbConnector: mysql.Connection) {}

  async getForVisitReport(id: number) {
    const [results, _] = await this.dbConnector.query(
      'select * from contact where visitReportId = ?',
      [id],
    );
    return Object.values(results).map((item) => this.toDomain(item));
  }

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

  toDomain(item): Contact {
    return new Contact(
      item['id'],
      item['name'],
      item['isPrimary'],
      item['visitReportId'],
    );
  }
}
