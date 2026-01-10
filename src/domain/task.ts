import { Status } from './enum';
import { User } from './user';

/**
 * Represents a task associated with a visit report.
 */
export class Task {
  /**
   * @param {number} id The unique identifier for the task.
   * @param {string} description A description of what the task entails.
   * @param {Status} status The current status of the task (e.g., Open, InProgress).
   * @param {User} assignedTo The user to whom the task is assigned.
   * @param {Date | string} completeBy The date by which the task should be completed.
   * @param {number} visitReportId The ID of the visit report this task belongs to.
   */
  constructor(
    public id: number,
    public description: string,
    public status: Status,
    public assignedTo: User,
    public completeBy: Date | string,
    public visitReportId: number,
  ) {}
}
