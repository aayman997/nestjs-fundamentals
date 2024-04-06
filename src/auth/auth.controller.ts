import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

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
}
