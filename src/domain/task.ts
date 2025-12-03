import { Status } from './enums';
import { User } from './user';

export class Task {
  constructor(
    public id: number,
    public description: string,
    public status: Status,
    public assignedTo: User,
    public completeBy: Date | string,
    public visitReportId: number,
  ) {}
}
