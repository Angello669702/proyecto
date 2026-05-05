import { inject, Injectable } from '@angular/core';
import { CommonCrudService } from '../../../shared/services/common-crud.service';

import { User } from '../interfaces/user.interface';
import { UserDto } from '../dtos/user.interface.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable({ providedIn: 'root' })
export class UserService extends CommonCrudService<User, UserDto> {
  readonly API_ENDPOINT = 'http://127.0.0.1:8000/api/user';
  readonly mapper = inject(UserMapper);
  readonly defaultModel = { id: '' } as User;
  readonly defaultDto = { id: '' } as UserDto;
}
