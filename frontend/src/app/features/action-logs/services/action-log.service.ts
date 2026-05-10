import { inject, Injectable } from '@angular/core';
import { ActionLogMapper } from '../mappers/action-log.mapper';
import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { ActionLogDto } from '../dtos/action-log.dto.interface';
import { ActionLog } from '../interfaces/action-log.interface';

@Injectable({ providedIn: 'root' })
export class ActionLogService extends CommonCrudService<ActionLog, ActionLogDto> {
  readonly API_ENDPOINT = 'http://51.91.110.54:8000/api/action-logs';
  readonly mapper = inject(ActionLogMapper);
  override readonly defaultModel = { id: '' } as ActionLog;
}
