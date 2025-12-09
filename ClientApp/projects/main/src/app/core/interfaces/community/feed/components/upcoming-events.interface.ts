import { EventType } from '../../events/enums';

/**
 * Upcoming events
 */
export interface UpcomingEvent {
  id: string;
  title: string;
  coverImageUrl: string | null;
  startDate: string;
  endDate: string;
  city: string | null;
  country: string | null;
  type: EventType;
  attendeeCount: number;
  isFree: boolean;
  price: number | null;
}
