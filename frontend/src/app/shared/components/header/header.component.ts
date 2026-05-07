import { Component, computed, inject } from '@angular/core';
import { PRODUCT_PAGES } from '../../../features/products/product.routes';
import { TRANSACTION_PAGES } from '../../../features/transactions/transactions.routes';
import { AuthService } from '../../../features/auth/services/auth.service';
import { TokenStorageService } from '../../../features/auth/services/token.service';
import { AUTH_PAGES } from '../../../features/auth/auth.routes';
import { Router } from '@angular/router';
import { FEATURE_PAGES } from '../../../app.routes';
import { REGISTRATION_PAGES } from '../../../features/registration/registration.routes';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly #authService = inject(AuthService);
  readonly #tokenService = inject(TokenStorageService);
  readonly #router = inject(Router);

  readonly #isLogged = this.#tokenService.isLogged;
  readonly #user = this.#authService.currentUser;
  readonly #isAdmin = this.#authService.isAdmin;

  isLogged = computed(() => this.#isLogged());
  user = computed(() => this.#user());
  isAdmin = computed(() => this.#isAdmin());

  readonly authNavigation: Record<string, string[]> = {
    login: ['/', FEATURE_PAGES.AUTH, AUTH_PAGES.LOGIN],
    profile: ['/', FEATURE_PAGES.AUTH, AUTH_PAGES.PROFILE],
  };

  readonly productsNavigation: Record<string, string[]> = {
    catalog: ['/', FEATURE_PAGES.PRODUCTS, PRODUCT_PAGES.CATALOG],
    new: ['/', FEATURE_PAGES.PRODUCTS, PRODUCT_PAGES.NEW],
  };

  readonly transactionsNavigation: Record<string, string[]> = {
    cart: ['/', FEATURE_PAGES.TRANSACTIONS, TRANSACTION_PAGES.CART],
    orders: ['/', FEATURE_PAGES.TRANSACTIONS, TRANSACTION_PAGES.ORDERS],
  };

  readonly registrationsNavigation: Record<string, string[]> = {
    register: ['/', FEATURE_PAGES.REGISTRATIONS, REGISTRATION_PAGES.REGISTER],
    all: ['/', FEATURE_PAGES.REGISTRATIONS, REGISTRATION_PAGES.ALL],
  };

  readonly userInitials = computed(() => {
    const user = this.user();
    if (this.#authService.isDefaultUser(user)) return;
    return user.fullName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  });

  logout() {
    this.#tokenService.logout();
    this.#router.navigate(this.authNavigation['login']);
  }

  navigate(route: string[]) {
    this.#router.navigate(route);
  }
}
