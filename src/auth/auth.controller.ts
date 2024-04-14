import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { JwtAuthGuard } from './jwt-auth-guard.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthLoginReturnType, AuthenticatedRequest, Enable2FAType, ProfileRequest } from './types';
import { Artist } from '../artists/artists.entity';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { AuthGuard } from '@nestjs/passport';

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
  login(@Body() loginDTO: LoginDTO): Promise<AuthLoginReturnType> {
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

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Request() req: AuthenticatedRequest): Promise<Enable2FAType> {
    console.log('req.user', req.user);
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(@Request() req: AuthenticatedRequest, @Body() validateTokenDTO: ValidateTokenDTO): Promise<{ verified: boolean }> {
    console.log('req.user', req.user);
    return this.authService.validate2FA(req.user.userId, validateTokenDTO.token);
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Request() req: AuthenticatedRequest): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(@Request() req: ProfileRequest): { msg: string; user: User } {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }
}
