import mysql from 'mysql2/promise';
import { Contact } from 'src/domain/contact';
export class ContactModel {
  constructor(private dbConnector: mysql.Connection) {}

  async getForVisitReport(id: number) {
    const [results, _] = await this.dbConnector.query(
      'select * from contact where visitReportId = ?',
      [id],
    );
    return Object.values(results).map((item) => this.toDomain(item));
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
