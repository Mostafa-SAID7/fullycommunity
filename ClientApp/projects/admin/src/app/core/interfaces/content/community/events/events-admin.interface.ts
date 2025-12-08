export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  attendeeCount: number;
  organizerName: string;
}

export interface EventsListResponse {
  items: Event[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
