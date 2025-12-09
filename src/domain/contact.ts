/**
 * Represents a contact person associated with a visit report.
 */
export class Contact {
  /**
   * @param {number} id The unique identifier for the contact.
   * @param {string} name The name of the contact.
   * @param {boolean} isPrimary A flag indicating if this is the primary contact for the report.
   * @param {number} visitReportId The ID of the visit report this contact is associated with.
   */
  constructor(
    public id: number,
    public name: string,
    public isPrimary: boolean,
    public visitReportId: number,
  ) {}
}
