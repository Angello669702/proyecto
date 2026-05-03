import { Component, computed, inject } from '@angular/core';
import { PRODUCT_PAGES } from '../../../features/products/product.routes';
import { TRANSACTION_PAGES } from '../../../features/transactions/transactions.routes';
import { AuthService } from '../../../features/auth/services/auth.service';
import { TokenStorageService } from '../../../features/auth/services/token.service';
import { AUTH_PAGES } from '../../../features/auth/auth.routes';
import { Router } from '@angular/router';

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

  isLoggued = this.#tokenService.isLogged;
  user = this.#authService.currentUser;
  isAdmin = this.#authService.isAdmin;

  authNavigation: Record<string, string[]> = {
    login: [AUTH_PAGES.AUTH, AUTH_PAGES.LOGIN],
  };

  productsNavigation: Record<string, string[]> = {
    catalog: [PRODUCT_PAGES.PRODUCTS, PRODUCT_PAGES.CATALOG],
    newProduct: [PRODUCT_PAGES.PRODUCTS, PRODUCT_PAGES.NEW],
    updateProduct: [PRODUCT_PAGES.PRODUCTS, PRODUCT_PAGES.UPDATE],
  };

  transactionsNavigation: Record<string, string[]> = {
    myCart: [TRANSACTION_PAGES.TRANSACTIONS, TRANSACTION_PAGES.CART],
    orders: [TRANSACTION_PAGES.TRANSACTIONS, TRANSACTION_PAGES.ORDERS],
  };

  userInitials = computed(() => {
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
