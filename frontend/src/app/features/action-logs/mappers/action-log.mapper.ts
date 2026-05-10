// shared/mappers/action-log.mapper.ts

import { inject, Injectable } from '@angular/core';
import { UserMapper } from '../../auth/mappers/user.mapper';
import { Mapper } from '../../../shared/interfaces/mapper.interface';
import { ActionLogDto } from '../dtos/action-log.dto.interface';
import { ActionLog } from '../interfaces/action-log.interface';

@Injectable({
  providedIn: 'root',
})
export class ActionLogMapper implements Mapper<ActionLog, ActionLogDto> {
  readonly #userMapper = inject(UserMapper);

  mapOne(dto: ActionLogDto): ActionLog {
    return {
      id: dto.id,
      action: dto.action,
      description: dto.description,
      user: dto.user ? this.#userMapper.mapOne(dto.user) : undefined,
      createdAt: new Date(dto.created_at),
    };
  }

  mapList(dtos: ActionLogDto[]): ActionLog[] {
    return dtos.map((dto) => this.mapOne(dto));
  }

  toDto(model: ActionLog): ActionLogDto {
    return {
      id: model.id,
      action: model.action,
      description: model.description,
      user: model.user ? this.#userMapper.toDto(model.user) : undefined,
      created_at: model.createdAt.toISOString(),
    };
  }
}
