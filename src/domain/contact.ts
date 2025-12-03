export class Contact {
  constructor(
    public id: number,
    public name: string,
    public isPrimary: boolean,
    public visitReportId: number,
  ) {}
}
