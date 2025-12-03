import { Status } from './enums';
import { User } from './user';

export class Task {
  private id: number;
  private description: string;
  private status: Status;
  private assignedTo: User;
  private completeBy: Date;
  private visitReportId: number;
}
