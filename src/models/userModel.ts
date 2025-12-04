import mysql from 'mysql2/promise';
import { User } from 'src/domain/user';

export class UserModel {
  constructor(private dbConnector: mysql.Connection) {}

  async getById(id: number) {
    const [result, _] = await this.dbConnector.query(
      'select * from user where `id` = ?',
      [id],
    );
    return this.toDomain(result[0]);
  }

  async getByLoginCredentials(username: string, password: string) {
    const [result, _] = await this.dbConnector.query(
      'select * from user where username = ? and password = ?',
      [username, password],
    );

    return this.toDomain(result[0]);
  }

  toDomain(data): User {
    return new User(data['id'], data['username'], data['password']);
  }
}
