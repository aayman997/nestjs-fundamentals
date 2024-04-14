import { DataSourceOptions, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}.local`,
});
export const dataSourceOptions = (configService?: ConfigService): DataSourceOptions => {
  return {
    type: 'postgres',
    host: configService?.get('DATABASE_HOST') ?? process.env.DATABASE_HOST,
    port: configService?.get('DATABASE_PORT') ?? +process.env.DATABASE_PORT,
    username: configService?.get('DATABASE_USERNAME') ?? process.env.DATABASE_USERNAME,
    password: configService?.get('DATABASE_PASSWORD') ?? process.env.DATABASE_PASSWORD,
    database: configService?.get('DATABASE_NAME') ?? process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
  };
};

const dataSource = new DataSource(dataSourceOptions());
export default dataSource;
