export interface PayloadType {
  email: string;
  userId: number;
  artistId?: number;
}

export interface AuthenticatedRequest extends Request {
  user: PayloadType;
}

export type Enable2FAType = {
  secret: string;
};

export type AuthLoginReturnType =
  | { accessToken: string }
  | { validate2FA: string; message: string };
