/**
 * Channel and User Enums
 * Enums related to channels and user status
 */

export enum ChannelStatus {
  Active = 0,
  Suspended = 1,
  Banned = 2,
  UnderReview = 3,
  Pending = 4
}

export enum AppealStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  UnderReview = 3
}