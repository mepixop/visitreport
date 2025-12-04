import { Contact } from './contact';
import { Task } from './task';
import { User } from './user';
import { VisitReportType, VisitReportOutcome, Status } from './enum';

export class VisitReport {
  constructor(
    public id: number,
    public status: Status,
    public assignedTo: User,
    public topic: string,
    public type: VisitReportType,
    public startTime: Date | string,
    public endTime: Date | string,
    public outcome: VisitReportOutcome,
    public primaryContact: Contact,
    public attendees: Contact[],
    public notes: string,
    public followUp: string,
    public tasks: Task[],
  ) {}
}
