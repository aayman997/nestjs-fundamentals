import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { JwtAuthGuard } from './jwt-guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthLoginReturnType, AuthenticatedRequest, Enable2FAType, ProfileRequest } from './types';
import { Artist } from '../artists/artists.entity';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'It will return the user in the response' })
  signup(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(userDTO);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'It will return the accessToken in the response' })
  login(@Body() loginDTO: LoginDTO): Promise<AuthLoginReturnType> {
    return this.authService.login(loginDTO);
  }

  @Patch('update-user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update the user data' })
  updateUser(
    @Body() updateUserDTO: UpdateUserDTO,
    @Request() request: AuthenticatedRequest,
  ): Promise<UpdateResult | Artist | DeleteResult> {
    const { userId } = request.user;
    return this.usersService.update(userId, updateUserDTO);
  }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Enable 2FA for a user' })
  @ApiResponse({ status: 200, description: 'It will return the 2FA secret in the response' })
  enable2FA(@Request() req: AuthenticatedRequest): Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Validate 2FA for a user' })
  @ApiResponse({ status: 200, description: 'It will return a verified:boolean in the response' })
  validate2FA(@Request() req: AuthenticatedRequest, @Body() validateTokenDTO: ValidateTokenDTO): Promise<{ verified: boolean }> {
    return this.authService.validate2FA(req.user.userId, validateTokenDTO.token);
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Disable 2FA for a user' })
  disable2FA(@Request() req: AuthenticatedRequest): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({ summary: 'Get authorized user profile' })
  @ApiResponse({ status: 200, description: 'It will return the user data in the response' })
  getProfile(@Request() req: ProfileRequest): { msg: string; user: User } {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }
}
