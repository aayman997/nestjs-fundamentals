export interface PayloadType {
  email: string;
  userId: number;
  artistId?: number;
}

export interface AuthenticatedRequest extends Request {
  user: PayloadType;
}
