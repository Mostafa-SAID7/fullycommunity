import { BaseFilter } from '../../../../types';
import { EventType, EventStatus } from '../enums';

export interface EventFilter extends BaseFilter {
  type?: EventType;
  status?: EventStatus;
  startDate?: string;
  endDate?: string;
  city?: string;
  country?: string;
  isFree?: boolean;
}
