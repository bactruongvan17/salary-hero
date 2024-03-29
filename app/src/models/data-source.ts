import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Employee } from './entity/Employee'
import { WorkLog } from './entity/WorkLog'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'test',
  entities: [Employee, WorkLog],
  synchronize: true,
  logging: false
})
