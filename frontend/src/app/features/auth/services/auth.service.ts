import { catchError, map, NEVER, Observable, tap, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthServiceAbstract } from './auth.service.abstract';
import { computed, inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { TokenStorageService } from './token.service';
import { AuthRequest, AuthResponse } from '../interfaces/auth.interface';
import { UserDto } from '../dtos/user.interface.dto';
import { UserMapper } from '../mappers/user.mapper';
import { Product } from '../../products/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthServiceAbstract {
  #httpClient = inject(HttpClient);
  #userMapper = inject(UserMapper);
  #tokenStorageService = inject(TokenStorageService);
  #currentUser = signal<User>(this.defaultUser);
  currentUser = computed(() => this.#currentUser());
  isAdmin = computed(() =>
    this.#tokenStorageService.isLogged() ? this.currentUser().role === 'admin' : false,
  );

  userResource = rxResource({
    stream: () => (this.#tokenStorageService.token() ? this.#getUser() : NEVER),
  });

  #getUser(): Observable<User> {
    return this.#httpClient.get<{ data: UserDto }>(`${this.API_ENDPOINT}/user`).pipe(
      map(({ data }) => this.#userMapper.mapOne(data)),
      tap((user) => this.#currentUser.set(user)),
      catchError((error) => {
        if (error.status === 401) {
          this.#tokenStorageService.logout();
        }
        return throwError(() => error);
      }),
    );
  }

  #login(loginRequest: AuthRequest): Observable<AuthResponse> {
    return this.#httpClient.post<AuthResponse>(`${this.API_ENDPOINT}/login`, loginRequest).pipe(
      tap((loginRequest) => this.#tokenStorageService.setToken(loginRequest.token)),
      tap((loginRequest) => this.#currentUser.set(this.#userMapper.mapOne(loginRequest.user))),
    );
  }

  login(loginRequest: Signal<AuthRequest>): ResourceRef<AuthResponse | undefined> {
    return rxResource({
      params: () => loginRequest(),
      stream: ({ params: formData }) =>
        this.isLoginEmpty(formData) ? NEVER : this.#login(formData),
    });
  }

  updateFavourites(product: Product): void {
    this.#currentUser.update((user) => {
      if (!user || !user.favourites) return user;
      const isFavourite = user.favourites.some((favourite) => favourite.id === product.id);
      const updatedFavourites = isFavourite
        ? user.favourites.filter((favourite) => favourite.id !== product.id)
        : [...user.favourites, product];
      return {
        ...user,
        favourites: updatedFavourites,
      };
    });
  }

  reloadUser(): void {
    this.userResource.reload();
  }
}
