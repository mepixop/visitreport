import { ConfigService } from '@nestjs/config';
import mysql from 'mysql2/promise';

export const getDbConnector = async (configService: ConfigService) => {
  return await mysql.createConnection({
    host: configService.get('DATABASE_HOST'),
    user: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
  });
};
