/**
 * Video Type
 */
export enum VideoType {
  Standard = 0,
  Short = 1,
  Reel = 2,
  LiveStream = 3,
  Story = 4,
  Tutorial = 5,
  Review = 6
}

/**
 * Video Status
 */
export enum VideoStatus {
  Draft = 0,
  Processing = 1,
  Published = 2,
  Scheduled = 3,
  Unlisted = 4,
  Private = 5,
  Removed = 6
}

/**
 * Video Visibility
 */
export enum VideoVisibility {
  Public = 0,
  Unlisted = 1,
  Private = 2,
  FollowersOnly = 3
}

/**
 * Video Quality
 */
export enum VideoQuality {
  SD_360 = 0,
  SD_480 = 1,
  HD_720 = 2,
  HD_1080 = 3,
  UHD_4K = 4
}

/**
 * Content Rating
 */
export enum ContentRating {
  General = 0,
  Teen = 1,
  Mature = 2,
  Restricted = 3
}

/**
 * Video Orientation
 */
export enum VideoOrientation {
  Landscape = 0,
  Portrait = 1,
  Square = 2
}

/**
 * Reaction Type
 */
export enum ReactionType {
  Like = 0,
  Love = 1,
  Laugh = 2,
  Wow = 3,
  Sad = 4,
  Angry = 5
}

/**
 * Comment Status
 */
export enum CommentStatus {
  Visible = 0,
  Hidden = 1,
  Flagged = 2,
  Removed = 3
}

/**
 * Live Stream Status
 */
export enum LiveStreamStatus {
  Scheduled = 0,
  Starting = 1,
  Live = 2,
  Paused = 3,
  Ended = 4,
  Cancelled = 5
}

/**
 * Stream Quality
 */
export enum StreamQuality {
  Low = 0,
  Medium = 1,
  High = 2,
  Ultra = 3
}

/**
 * Monetization Status
 */
export enum MonetizationStatus {
  NotEligible = 0,
  Pending = 1,
  Enabled = 2,
  Disabled = 3,
  Suspended = 4
}

/**
 * Ad Type
 */
export enum AdType {
  PreRoll = 0,
  MidRoll = 1,
  PostRoll = 2,
  Banner = 3,
  Sponsored = 4
}

/**
 * Report Reason
 */
export enum ReportReason {
  Spam = 0,
  Harassment = 1,
  HateSpeech = 2,
  Violence = 3,
  Nudity = 4,
  Misinformation = 5,
  Copyright = 6,
  Other = 7
}

/**
 * Report Status
 */
export enum ReportStatus {
  Pending = 0,
  UnderReview = 1,
  Resolved = 2,
  Dismissed = 3
}

/**
 * Channel Status
 */
export enum ChannelStatus {
  Active = 0,
  Suspended = 1,
  Banned = 2,
  Deactivated = 3
}

/**
 * Channel Tier
 */
export enum ChannelTier {
  Basic = 0,
  Verified = 1,
  Partner = 2,
  Premium = 3
}
