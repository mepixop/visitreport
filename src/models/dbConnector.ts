import { ConfigService } from '@nestjs/config';
import mysql from 'mysql2/promise';

/**
 * Creates and returns a new database connection using credentials from the config service.
 * @param {ConfigService} configService The configuration service holding database credentials.
 * @returns {Promise<mysql.Connection>} A promise that resolves to a MySQL connection object.
 */
export const getDbConnector = async (configService: ConfigService) => {
  return await mysql.createConnection({
    host: configService.get('DATABASE_HOST'),
    user: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
  });
};
