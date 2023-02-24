import * as mssql from 'mssql';

const config: mssql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST ?? '',
  options: {
    trustServerCertificate: true,
  },
};

export type Connection = mssql.ConnectionPool;

export async function connection(): Promise<Connection> {
  return mssql.connect(config);
}
