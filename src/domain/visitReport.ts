import { Contact } from './contact';
import { Task } from './task';
import { User } from './user';

export class VisitReport {
  constructor(
    public id: number,
    public status: string,
    public assignedTo: User,
    public topic: string,
    public type: string,
    public startTime: Date,
    public endTime: Date,
    public outcome: string,
    public primaryContact: Contact,
    public attendees: Contact[],
    public notes: string,
    public followUp: string,
    public tasks: Task[],
  ) {}
}
