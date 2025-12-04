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

  async _initialize() {
    if (!this.initialized) {
      const connector = await getDbConnector(this.configService);
      this.taskModel = new TaskModel(connector);
      this.visitReportModel = new VisitReportModel(connector);
      this.contactModel = new ContactModel(connector);
      this.initialized = true;
    }
  }

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

  private extractTasks(followUpString: string): string[] {
    return followUpString.split(',').map((i) => i.trim());
  }

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

  readableReport(report: VisitReport): VisitReport {
    report.startTime = this.utilityService.readableDate(
      report.startTime as Date,
    );
    report.endTime = this.utilityService.readableDate(report.endTime as Date);
    return report;
  }
}
