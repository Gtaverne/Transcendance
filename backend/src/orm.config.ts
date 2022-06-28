import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv'
dotenv.config({path: './.env'})

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: +process.env.POSTGRES_PORT,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};
