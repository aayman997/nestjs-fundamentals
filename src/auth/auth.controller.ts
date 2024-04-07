import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { JwtAuthGuard } from './jwt-auth-guard.service';
import { UpdateResult, DeleteResult } from 'typeorm';
import { AuthenticatedRequest } from './types';
import { Artist } from '../artists/artists.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(userDTO);
  }

  @Post('login')
  login(@Body() loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    return this.authService.login(loginDTO);
  }

  @Patch('update-user')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Body() updateUserDTO: UpdateUserDTO,
    @Request() request: AuthenticatedRequest,
  ): Promise<UpdateResult | Artist | DeleteResult> {
    const { userId } = request.user;
    return this.usersService.update(userId, updateUserDTO);
  }
}
