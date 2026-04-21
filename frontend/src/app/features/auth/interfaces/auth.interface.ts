import { User } from './user.interface';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
