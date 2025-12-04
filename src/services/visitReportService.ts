import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilityService } from './utilityService';
import { VisitReportModel } from 'src/models/visitReportModel';
import { ContactModel } from 'src/models/contactModel';
import { getDbConnector } from 'src/models/dbConnector';
import { TaskModel } from 'src/models/taskModel';
import { User } from 'src/domain/user';
import { VisitReport } from 'src/domain/visitReport';

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
