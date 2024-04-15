import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { typeOrmAsyncConfig } from '../db/data-source';
import { SeedModule } from './seed/seed.module';
import configuration from './config/configuration';
import { validate } from '../env.validation';

console.log('process.env.APP_HOST', process.env.APP_HOST);
console.log('process.env.APP_PORT', process.env.APP_PORT);
console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('process.env.DATABASE_HOST', process.env.DATABASE_HOST);
console.log('process.env.DATABASE_PORT', process.env.DATABASE_PORT);
console.log('process.env.DATABASE_USERNAME', process.env.DATABASE_USERNAME);
console.log('process.env.DATABASE_PASSWORD', process.env.DATABASE_PASSWORD);
console.log('process.env.DATABASE_NAME', process.env.DATABASE_NAME);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`, `${process.cwd()}/.env.${process.env.NODE_ENV}`],
      ignoreEnvFile: process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT_NAME === 'production',
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    SongsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
