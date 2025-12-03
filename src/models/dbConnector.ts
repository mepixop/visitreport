import mysql from 'mysql2/promise';

export const getDbConnector = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'visitReport',
  });
};
