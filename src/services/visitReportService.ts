import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilityService } from './utilityService';
import { VisitReportModel } from 'src/models/visitReportModel';
import { ContactModel } from 'src/models/contactModel';
import { getDbConnector } from 'src/models/dbConnector';
import { TaskModel } from 'src/models/taskModel';
import { User } from 'src/domain/user';
import { VisitReport } from 'src/domain/visitReport';
import { Status } from 'src/domain/enum';
import { Contact } from 'src/domain/contact';
import { request } from 'http';

/**
 * Service for handling visit report-related operations.
 */
@Injectable()
export class VisitReportService {
  constructor(
    private configService: ConfigService,
    private utilityService: UtilityService,
  ) {}

  private taskModel: TaskModel;
  private visitReportModel: VisitReportModel;
  private contactModel: ContactModel;
  private initialized: boolean = false;

  /**
   * Initializes the service by creating model instances if they don't exist.
   * This is a private helper method to ensure database connectors are ready.
   * @private
   */
  async _initialize() {
    if (!this.initialized) {
      const connector = await getDbConnector(this.configService);
      this.taskModel = new TaskModel(connector);
      this.visitReportModel = new VisitReportModel(connector);
      this.contactModel = new ContactModel(connector);
      this.initialized = true;
    }
  }

  /**
   * Retrieves visit reports for the dashboard, formatted for display.
   * @param {User} user The user for whom to retrieve visit reports.
   * @returns {Promise<VisitReport[]>} A promise that resolves to an array of visit reports.
   */
  async getVisitReportsForDashboard(user: User) {
    await this._initialize();
    const reportItems = await this.visitReportModel.getForUser(user);
    const reports: VisitReport[] = [];
    const cleanReports: VisitReport[] = [];

    for (const item of Object.values(reportItems)) {
      const report = await this.buildReport(item, user);
      reports.push(this.readableReport(report));
    }
    return reports;
  }

  /**
   * Creates a new visit report from the request body.
   * @param {any} requestBody The request body containing visit report data.
   * @param {User} user The user creating the visit report.
   * @returns {Promise<string[]>} A promise that resolves to an array of error messages, if any.
   */
  async createVisitReport(requestBody, user): Promise<string[]> {
    await this._initialize();
    const [primaryContact, attendees] = this.extractContacts(requestBody);

    const visitReport = new VisitReport(
      -1,
      Status.Open,
      user,
      requestBody['topic'],
      requestBody['type'],
      requestBody['startTime'],
      requestBody['endTime'],
      requestBody['outcome'],
      primaryContact,
      attendees,
      requestBody['notes'],
      requestBody['followUp'],
      [],
    );
    console.log(visitReport);
    const createdReportId =
      await this.visitReportModel.saveVisitReport(visitReport);
    await this.contactModel.saveForVisitReport(visitReport, createdReportId);
    const tasks = this.extractTasks(requestBody['followUp']);
    await this.taskModel.saveTaskStrings(tasks, user, createdReportId);
    return [];
  }

  /**
   * Extracts primary and attendee contacts from the request body.
   * @param {any} requestBody The request body containing contact data.
   * @returns {[Contact, Contact[]]} A tuple containing the primary contact and an array of attendee contacts.
   * @private
   */
  private extractContacts(requestBody): [Contact, Contact[]] {
    var primaryContact = new Contact(
      -1,
      requestBody['primaryContact'],
      true,
      -1,
    );
    const attendees: Contact[] = [];
    if (requestBody['attendees'].length > 0) {
      const attendeeNames = (requestBody['attendees'] as string).split(',');
      attendeeNames.forEach((name) =>
        attendees.push(new Contact(-1, name.trim(), false, -1)),
      );
    }
    return [primaryContact, attendees];
  }

  /**
   * Extracts follow-up tasks from a comma-separated string.
   * @param {string} followUpString The string of follow-up tasks.
   * @returns {string[]} An array of task strings.
   * @private
   */
  private extractTasks(followUpString: string): string[] {
    return followUpString.split(',').map((i) => i.trim());
  }

  /**
   * Constructs a full VisitReport object from a database row.
   * @param {any} item The database row item.
   * @param {User} user The user associated with the report.
   * @returns {Promise<VisitReport>} A promise that resolves to a VisitReport object.
   * @private
   */
  private async buildReport(item, user: User): Promise<VisitReport> {
    const contacts = await this.contactModel.getForVisitReport(item['id']);

    const tasks = await this.taskModel.getForVisitReport(item['id'], user);
    const primaryContact = contacts.filter((item) => item.isPrimary)[0];
    const attendeeContacts = contacts.filter((item) => !item.isPrimary);
    return new VisitReport(
      item['id'],
      item['status'],
      user,
      item['topic'],
      item['type'],
      new Date(item['startTime']),
      new Date(item['endTime']),
      item['outcome'],
      primaryContact,
      attendeeContacts,
      item['notes'],
      item['followUp'],
      tasks,
    );
  }

  /**
   * Converts the start and end times of a report to a readable format.
   * @param {VisitReport} report The visit report to modify.
   * @returns {VisitReport} The visit report with readable dates.
   */
  readableReport(report: VisitReport): VisitReport {
    report.startTime = this.utilityService.readableDate(
      report.startTime as Date,
    );
    report.endTime = this.utilityService.readableDate(report.endTime as Date);
    return report;
  }
}
