import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';
import { User } from '../users/users.entity';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(apikey: string): Promise<User> {
    const user = await this.authService.validateUserByApiKey(apikey);
    if (!user) {
      throw new UnauthorizedException('No User with the token provided');
    } else {
      return user;
    }
  }
}
