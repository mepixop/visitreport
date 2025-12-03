import { Contact } from './contact';
import { Status, VisitReportType, VisitReportOutcome } from './enums';
import { Task } from './task';
import { User } from './user';

export class VisitReport {
  private id: number;
  private status: Status;
  private assignedTo: User;
  private topic: string;
  private type: VisitReportType;
  private startTime: Date;
  private endTime: Date;
  private outcome: VisitReportOutcome;
  private primaryContact: Contact;
  private attendees: Contact[];
  private notes: string;
  private followUp: string;
  private tasks: Task[];
}
