import mysql from 'mysql2/promise';
import { User } from 'src/domain/user';

/**
 * Model for interacting with the 'user' table in the database.
 */
export class UserModel {
  /**
   * @param {mysql.Connection} dbConnector A connection object to the database.
   */
  constructor(private dbConnector: mysql.Connection) {}

  /**
   * Retrieves a user by their unique ID.
   * @param {number} id The ID of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves to a User object.
   */
  async getById(id: number) {
    const [result, _] = await this.dbConnector.query(
      'select * from user where `id` = ?',
      [id],
    );
    return this.toDomain(result[0]);
  }

  /**
   * Retrieves a user by their login credentials.
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @returns {Promise<User>} A promise that resolves to a User object, or null if not found.
   */
  async getByLoginCredentials(username: string, password: string) {
    const [result, _] = await this.dbConnector.query(
      'select * from user where username = ? and password = ?',
      [username, password],
    );

    return this.toDomain(result[0]);
  }

  /**
   * Converts a database row object into a User domain object.
   * @param {any} data The raw database row.
   * @returns {User} The User domain object.
   * @private
   */
  toDomain(data): User {
    return new User(data['id'], data['username'], data['password']);
  }
}
