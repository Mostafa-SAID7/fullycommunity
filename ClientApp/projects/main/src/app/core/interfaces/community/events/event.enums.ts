// Enums matching backend: CommunityCar.Domain.Enums.Community.Events

export enum AttendeeRole {
  Attendee = 0,
  CoHost = 1,
  Speaker = 2,
  Volunteer = 3
}

export enum AttendeeStatus {
  Going = 0,
  Interested = 1,
  NotGoing = 2,
  Waitlisted = 3,
  Cancelled = 4
}

export enum EventLocationType {
  InPerson = 0,
  Online = 1,
  Hybrid = 2
}

export enum EventStatus {
  Draft = 0,
  Upcoming = 1,
  Ongoing = 2,
  Completed = 3,
  Cancelled = 4
}

export enum EventType {
  Meetup = 0,
  CarShow = 1,
  RoadTrip = 2,
  Workshop = 3,
  Race = 4,
  Auction = 5,
  Other = 6
}

export enum EventVisibility {
  Public = 0,
  Private = 1,
  InviteOnly = 2
}

export enum RecurrencePattern {
  Daily = 0,
  Weekly = 1,
  BiWeekly = 2,
  Monthly = 3,
  Yearly = 4
}
