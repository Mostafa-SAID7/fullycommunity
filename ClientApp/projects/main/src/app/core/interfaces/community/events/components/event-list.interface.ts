// Interface matching backend DTO: EventListDto
import { EventType, EventStatus } from '../enums';

export interface EventList {
  id: string;
  title: string;
  coverImageUrl: string | null;
  startDate: string;
  endDate: string;
  city: string | null;
  country: string | null;
  type: EventType;
  status: EventStatus;
  attendeeCount: number;
  isFree: boolean;
  price: number | null;
}
