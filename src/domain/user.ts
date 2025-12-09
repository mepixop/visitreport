/**
 * Represents a user of the application.
 */
export class User {
  /**
   * @param {number} id The unique identifier for the user.
   * @param {string} username The user's login name.
   * @param {string} password The user's password (hashed or plain text).
   */
  constructor(
    public id: number,
    public username: string,
    public password: string,
  ) {}
}
