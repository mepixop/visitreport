import { Contact } from './contact';
import { Task } from './task';
import { User } from './user';
import { VisitReportType, VisitReportOutcome, Status } from './enum';

/**
 * Represents a comprehensive report detailing a customer or client visit.
 */
export class VisitReport {
  /**
   * @param {number} id The unique identifier for the visit report.
   * @param {Status} status The current status of the report (e.g., Open, Closed).
   * @param {User} assignedTo The user who the report is assigned to.
   * @param {string} topic The main subject or topic of the visit.
   * @param {VisitReportType} type The type of visit (e.g., VideoCall, ExternalVisit).
   * @param {Date | string} startTime The start date and time of the visit.
   * @param {Date | string} endTime The end date and time of the visit.
   * @param {VisitReportOutcome} outcome The outcome of the visit (e.g., Positive, Negative).
   * @param {Contact} primaryContact The main contact person for the visit.
   * @param {Contact[]} attendees An array of other contacts who attended.
   * @param {string} notes Detailed notes from the visit.
   * @param {string} followUp A summary of any follow-up actions required.
   * @param {Task[]} tasks An array of specific tasks generated from the visit.
   */
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
