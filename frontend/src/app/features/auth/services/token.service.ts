import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  #isLogged = signal(false);
  readonly isLogged = computed(() => this.#isLogged());
  #token = signal<string>(localStorage.getItem('token') || '');
  token = computed(() => this.#token());

  constructor() {
    if (this.token()) {
      this.#isLogged.set(true);
    }
  }

  setToken(token: string) {
    this.#token.set(token);
    localStorage.setItem('token', token);
    const logged = token !== '';
    this.#isLogged.set(logged);
  }

  logout() {
    this.#token.set('');
    localStorage.removeItem('token');
    this.#isLogged.set(false);
  }
}
