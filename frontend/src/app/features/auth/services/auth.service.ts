import { NEVER, Observable, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthServiceAbstract } from './auth.service.abstract';
import { computed, inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { TokenStorageService } from './token.service';
import { AuthRequest, AuthResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthServiceAbstract {
  #httpClient = inject(HttpClient);
  #tokenStorageService = inject(TokenStorageService);
  #currentUser = signal<User>(this.defaultUser);
  currentUser = computed(() => this.#currentUser());
  isAdmin = computed(() => this.currentUser().role === 'admin');

  #login(loginRequest: AuthRequest): Observable<AuthResponse> {
    return this.#httpClient.post<AuthResponse>(this.API_ENDPOINT, loginRequest).pipe(
      tap((loginRequest) => this.#currentUser.set(loginRequest.user)),
      tap((loginRequest) => (this.#tokenStorageService.token = loginRequest.token)),
    );
  }

  login(loginRequest: Signal<AuthRequest>): ResourceRef<AuthResponse | undefined> {
    return rxResource({
      params: () => loginRequest(),
      stream: ({ params: formData }) =>
        this.isLoginEmpty(formData) ? NEVER : this.#login(formData),
    });
  }
}
