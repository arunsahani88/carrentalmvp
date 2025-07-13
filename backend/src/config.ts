import * as dotenv from 'dotenv';
dotenv.config({
  path: '${__dirname}/../.env'
});
export const db_host = process.env.DB_HOST;
export const db_port = Number(process.env.DB_PORT);
export const db_user = String(process.env.DB_USER || 'postgres');
export const db_password = String(process.env.DB_PASSWORD  || 'postgres');
export const db_name = String(process.env.DB_NAME || 'carrental');