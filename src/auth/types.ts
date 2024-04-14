import { User } from '../users/users.entity';

export interface PayloadType {
  email: string;
  userId: number;
  artistId?: number;
}

export interface AuthenticatedRequest extends Request {
  user: PayloadType;
}

export interface ProfileRequest extends Request {
  user: User;
}

export type Enable2FAType = {
  secret: string;
};

export type AuthLoginReturnType =
  | { accessToken: string }
  | { validate2FA: string; message: string };
