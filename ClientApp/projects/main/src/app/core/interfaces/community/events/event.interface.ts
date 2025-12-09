// Interface matching backend DTO: EventDto
import { EventLocationType, EventType, EventStatus, EventVisibility, AttendeeStatus } from './enums';

export interface Event {
  id: string;
  title: string;
  slug: string | null;
  description: string;
  organizerId: string;
  organizerName: string;
  organizerAvatarUrl: string | null;
  startDate: string;
  endDate: string;
  timezone: string | null;
  isAllDay: boolean;
  locationType: EventLocationType;
  venueName: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  onlineUrl: string | null;
  coverImageUrl: string | null;
  type: EventType;
  status: EventStatus;
  visibility: EventVisibility;
  maxAttendees: number | null;
  requiresApproval: boolean;
  isFree: boolean;
  price: number | null;
  currency: string | null;
  groupId: string | null;
  groupName: string | null;
  attendeeCount: number;
  interestedCount: number;
  currentUserStatus: AttendeeStatus | null;
  createdAt: string;
}
