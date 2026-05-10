import { UserDto } from '../dtos/user.interface.dto';
import { User } from './user.interface';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: UserDto;
  token: string;
}
