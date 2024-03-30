import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  signup(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(userDTO);
  }
}
