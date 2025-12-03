import mysql from 'mysql2/promise';
import { User } from 'src/domain/user';

export class UserModel {
  dbConnector: mysql.Connection;

  constructor(connector: mysql.Connection) {
    this.dbConnector = connector;
  }

  async getById(id: number) {
    const [result, _] = await this.dbConnector.query(
      'select * from user where `id` = ?',
      [id],
    );
    return this.userFromData(result[0]);
  }

  async getByLoginCredentials(username: string, password: string) {
    const [result, _] = await this.dbConnector.query(
      'select * from user where username = ? and password = ?',
      [username, password],
    );

    return this.userFromData(result[0]);
  }

  userFromData(data): User {
    return new User(data['id'], data['username'], data['password']);
  }
}
