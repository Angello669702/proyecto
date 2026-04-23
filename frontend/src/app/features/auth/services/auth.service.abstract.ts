import { ResourceRef } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { AuthRequest, AuthResponse } from '../interfaces/auth.interface';

export abstract class AuthServiceAbstract {
  protected readonly API_ENDPOINT = 'http://localhost:8000/auth';

  readonly defaultUser: User = {
    id: '0',
  } as User;

  readonly defaultAuthRequest: AuthRequest = {
    username: '',
    password: '',
  };

  abstract login(loginRequest: AuthRequest): ResourceRef<AuthResponse | undefined>;

  isDefaultUser(user: User): boolean {
    return user.id === this.defaultUser.id;
  }

  isLoginEmpty(loginRequest: AuthRequest): boolean {
    return loginRequest.username?.length === 0 && loginRequest.password?.length === 0;
  }
}
