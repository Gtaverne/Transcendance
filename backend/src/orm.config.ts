import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'postgres',
  password: '123',
  port: 5432,
  host: 'localhost',
  database: 'transcendance_db',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};
