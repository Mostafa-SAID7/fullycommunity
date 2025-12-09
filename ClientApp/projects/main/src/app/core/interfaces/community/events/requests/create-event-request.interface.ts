import { EventType, EventVisibility } from '../enums';

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone?: string | null;
  isAllDay: boolean;
  locationType: number;
  venueName?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  onlineUrl?: string | null;
  coverImageUrl?: string | null;
  type: EventType;
  visibility: EventVisibility;
  maxAttendees?: number | null;
  requiresApproval: boolean;
  isFree: boolean;
  price?: number | null;
  currency?: string | null;
  groupId?: string | null;
}
