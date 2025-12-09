// Interface matching backend DTO: EventAttendeeDto
import { AttendeeStatus, AttendeeRole } from '../enums';

export interface EventAttendee {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  status: AttendeeStatus;
  role: AttendeeRole;
  registeredAt: string;
}
