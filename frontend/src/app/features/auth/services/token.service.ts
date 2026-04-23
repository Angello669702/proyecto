import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  #isLogged = signal(false);
  readonly isLogged = computed(() => this.#isLogged());
  #token = localStorage.getItem('token') || '';

  constructor() {
    if (this.token) {
      this.#isLogged.set(true);
    }
  }

  set token(token: string) {
    this.#token = token;
    localStorage.setItem('token', token);
    const logged = token !== '';
    this.#isLogged.set(logged);
  }

  get token(): string {
    return this.#token;
  }

  logout() {
    this.token = '';
  }
}
