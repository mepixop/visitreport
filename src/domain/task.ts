import { User } from './user';

export class Task {
  constructor(
    public id: number,
    public description: string,
    public status: string,
    public assignedTo: User,
    public completeBy: Date | string,
    public visitReportId: number,
  ) {}
}
