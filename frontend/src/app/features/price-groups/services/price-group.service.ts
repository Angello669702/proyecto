import { inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { PriceGroupDto } from '../dtos/price-group.dto.interface';
import { PriceGroup } from '../interfaces/price-group.interface';
import { PriceGroupMapper } from '../mappers/price-groups.mapper';
import { Product } from '../../products/interfaces/product.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER, Observable, map, tap, catchError, throwError } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { PriceGroupItem } from '../interfaces/price-group-item.interface';
import { User } from '../../auth/interfaces/user.interface';
import { UserService } from '../../auth/services/user.service';

@Injectable({ providedIn: 'root' })
export class PriceGroupService extends CommonCrudService<PriceGroup, PriceGroupDto> {
  readonly API_ENDPOINT = 'http://127.0.0.1:8000/api/price-groups';
  readonly mapper = inject(PriceGroupMapper);
  readonly defaultModel = { id: '' } as PriceGroup;
  readonly defaultDto = { id: '' } as PriceGroupDto;
  readonly #productService = inject(ProductService);
  readonly #userService = inject(UserService);

  addItem(
    payload: Signal<
      { priceGroup: PriceGroup; item: { product: Product; price: number } } | undefined
    >,
  ): ResourceRef<PriceGroup | undefined> {
    return rxResource({
      params: () => payload(),
      stream: ({ params }) =>
        !params ||
        this.isDefaultModel(params.priceGroup) ||
        this.#productService.isDefaultModel(params.item.product)
          ? NEVER
          : this.#addItem(params.priceGroup, params.item),
      equal: (a, b) => a?.id === b?.id,
    });
  }

  #addItem(
    priceGroup: PriceGroup,
    item: { product: Product; price: number },
  ): Observable<PriceGroup> {
    return this.httpClient
      .post<{ data: PriceGroupDto }>(`${this.API_ENDPOINT}/${priceGroup.id}/items`, {
        id: item.product.id,
        price: item.price,
      })
      .pipe(
        map(({ data }) => this.mapper.mapOne(data)),
        tap((updated) =>
          this.modelsSignal.update((models) =>
            models.map((m) => (m.id === updated.id ? updated : m)),
          ),
        ),
        catchError((error) => {
          console.error('Failed to add item to price group', error);
          return throwError(() => error);
        }),
      );
  }

  removeItem(
    payload: Signal<{ priceGroup: PriceGroup; item: PriceGroupItem } | undefined>,
  ): ResourceRef<void | undefined> {
    return rxResource({
      params: () => payload(),
      stream: ({ params }) =>
        !params || this.isDefaultModel(params.priceGroup)
          ? NEVER
          : this.#removeItem(params.priceGroup, params.item),
      equal: (a, b) => a === b,
    });
  }

  #removeItem(priceGroup: PriceGroup, item: PriceGroupItem): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.API_ENDPOINT}/${priceGroup.id}/items/${item.id}`)
      .pipe(
        tap(() =>
          this.modelsSignal.update((models) =>
            models.map((m) =>
              m.id === priceGroup.id
                ? { ...m, items: m.items?.filter((i) => i.id !== item.id) }
                : m,
            ),
          ),
        ),
        catchError((error) => {
          console.error('Failed to remove item from price group', error);
          return throwError(() => error);
        }),
      );
  }

  addUser(
    payload: Signal<{ priceGroup: PriceGroup; user: User } | undefined>,
  ): ResourceRef<void | undefined> {
    return rxResource({
      params: () => payload(),
      stream: ({ params }) =>
        !params ||
        this.isDefaultModel(params.priceGroup) ||
        this.#userService.isDefaultModel(params.user)
          ? NEVER
          : this.#addUser(params.priceGroup, params.user),
      equal: (a, b) => a === b,
    });
  }

  #addUser(priceGroup: PriceGroup, user: User): Observable<void> {
    return this.httpClient
      .post<void>(`${this.API_ENDPOINT}/${priceGroup.id}/assign-user`, { id: user.id })
      .pipe(
        tap(() =>
          this.modelsSignal.update((models) =>
            models.map((m) =>
              m.id === priceGroup.id
                ? { ...m, users: [...(m.users ?? []), user], usersCount: (m.usersCount ?? 0) + 1 }
                : m,
            ),
          ),
        ),
        catchError((error) => {
          console.error('Failed to assign user to price group', error);
          return throwError(() => error);
        }),
      );
  }

  removeUser(
    payload: Signal<{ priceGroup: PriceGroup; user: User } | undefined>,
  ): ResourceRef<void | undefined> {
    return rxResource({
      params: () => payload(),
      stream: ({ params }) =>
        !params ||
        this.isDefaultModel(params.priceGroup) ||
        this.#userService.isDefaultModel(params.user)
          ? NEVER
          : this.#removeUser(params.priceGroup, params.user),
      equal: (a, b) => a === b,
    });
  }

  #removeUser(priceGroup: PriceGroup, user: User): Observable<void> {
    return this.httpClient
      .post<void>(`${this.API_ENDPOINT}/${priceGroup.id}/remove-user`, { id: user.id })
      .pipe(
        tap(() =>
          this.modelsSignal.update((models) =>
            models.map((m) =>
              m.id === priceGroup.id
                ? {
                    ...m,
                    users: m.users?.filter((u) => u.id !== user.id),
                    usersCount: Math.max((m.usersCount ?? 1) - 1, 0),
                  }
                : m,
            ),
          ),
        ),
        catchError((error) => {
          console.error('Failed to remove user from price group', error);
          return throwError(() => error);
        }),
      );
  }
}
