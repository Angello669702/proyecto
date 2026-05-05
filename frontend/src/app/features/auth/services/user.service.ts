import { inject, Injectable, ResourceRef, Signal } from '@angular/core';
import { CommonCrudService } from '../../../shared/services/common-crud.service';

import { ChangePassword, User } from '../interfaces/user.interface';
import { UserDto } from '../dtos/user.interface.dto';
import { UserMapper } from '../mappers/user.mapper';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER, Observable, map, tap, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UUID } from '../../../shared/types/uuid.type';

@Injectable({ providedIn: 'root' })
export class UserService extends CommonCrudService<User, UserDto> {
  readonly API_ENDPOINT = 'http://127.0.0.1:8000/api/user';
  readonly mapper = inject(UserMapper);
  readonly defaultModel = { id: '' } as User;
  readonly defaultChangePassword: ChangePassword = { currentPassword: '', newPassword: '' };

  updateProfile(formData: Signal<FormData | null>): ResourceRef<User | undefined> {
    return rxResource({
      params: () => formData(),
      stream: ({ params }) => (params === null ? NEVER : this.#updateProfile(params)),
    });
  }

  #updateProfile(formData: FormData): Observable<User> {
    return this.httpClient.post<{ data: UserDto }>(this.API_ENDPOINT, formData).pipe(
      map((response) => this.mapper.mapOne(response.data)),
      tap((updatedUser) =>
        this.modelsSignal.update((currentModels) =>
          currentModels.map((m) => (m.id === updatedUser.id ? updatedUser : m)),
        ),
      ),
      catchError((error) => {
        console.error('Failed to update profile', error);
        return throwError(() => error);
      }),
    );
  }

  changePassword(
    changePasswordRequest: Signal<ChangePassword>,
  ): ResourceRef<ChangePassword | undefined> {
    return rxResource({
      params: () => changePasswordRequest(),
      stream: ({ params: changePasswordRequest }) =>
        this.isChangePasswordEmpty(changePasswordRequest)
          ? NEVER
          : this.#changePassword(changePasswordRequest),
      equal: (changePassword1, changePassword2) =>
        changePassword1.newPassword === changePassword2.newPassword,
    });
  }

  #changePassword(changePasswordRequest: ChangePassword): Observable<ChangePassword> {
    const changePasswordMapped = {
      current_password: changePasswordRequest.currentPassword,
      new_password: changePasswordRequest.newPassword,
    };
    return this.httpClient
      .post<ChangePassword>(`${this.API_ENDPOINT}/password`, changePasswordMapped)
      .pipe(
        map((changePassword) => {
          return {
            currentPassword: changePassword.currentPassword,
            newPassword: changePassword.newPassword,
          };
        }),

        catchError((error) => {
          console.error('Failed to change password', error);
          return throwError(() => error);
        }),
      );
  }

  isChangePasswordEmpty(changePasswordRequest: ChangePassword) {
    return (
      changePasswordRequest.currentPassword?.length === 0 &&
      changePasswordRequest.newPassword?.length === 0
    );
  }
}
