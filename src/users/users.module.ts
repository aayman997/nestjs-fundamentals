import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ArtistsModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
