/**
 * Video Status and Moderation Enums
 * Enums related to video status and moderation
 */

export enum VideoStatus {
  Draft = 0,
  Processing = 1,
  Active = 2,
  Pending = 3,
  Flagged = 4,
  Removed = 5,
  Archived = 6,
  Scheduled = 7,
  Live = 8,
  Ended = 9
}

export enum ModerationStatus {
  NotReviewed = 0,
  Approved = 1,
  Rejected = 2,
  Flagged = 3,
  UnderReview = 4,
  Appealed = 5
}

export enum ModerationAction {
  Approve = 0,
  Reject = 1,
  Flag = 2,
  Remove = 3,
  Restore = 4,
  Archive = 5,
  Feature = 6,
  Unfeature = 7,
  Monetize = 8,
  Demonetize = 9,
  AgeRestrict = 10,
  RemoveAgeRestriction = 11
}

export enum ProcessingStatus {
  Queued = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4
}

export enum AgeRating {
  General = 0,
  Teen = 1,
  Mature = 2,
  Adult = 3
}

export enum VideoDuration {
  Short = 0,    // < 4 minutes
  Medium = 1,   // 4-20 minutes
  Long = 2      // > 20 minutes
}