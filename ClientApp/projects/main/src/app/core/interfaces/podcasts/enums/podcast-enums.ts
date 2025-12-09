/**
 * Podcast Type
 */
export enum PodcastType {
  Audio = 0,
  Video = 1,
  AudioVideo = 2
}

/**
 * Podcast Status
 */
export enum PodcastStatus {
  Draft = 0,
  Processing = 1,
  Published = 2,
  Scheduled = 3,
  Unlisted = 4,
  Private = 5,
  Removed = 6
}

/**
 * Podcast Visibility
 */
export enum PodcastVisibility {
  Public = 0,
  Unlisted = 1,
  Private = 2,
  SubscribersOnly = 3
}

/**
 * Episode Type
 */
export enum EpisodeType {
  Full = 0,
  Trailer = 1,
  Bonus = 2,
  Interview = 3,
  QA = 4,
  Recap = 5,
  Highlight = 6,
  BehindTheScenes = 7
}

/**
 * Episode Status
 */
export enum EpisodeStatus {
  Draft = 0,
  Processing = 1,
  Published = 2,
  Scheduled = 3,
  Removed = 4
}

/**
 * Podcast Category
 */
export enum PodcastCategory {
  Automotive = 0,
  Technology = 1,
  News = 2,
  Comedy = 3,
  Education = 4,
  Sports = 5,
  Business = 6,
  Lifestyle = 7,
  Entertainment = 8,
  CarReviews = 9,
  Maintenance = 10,
  Racing = 11,
  Electric = 12,
  Classic = 13,
  Tuning = 14,
  Other = 15
}

/**
 * Explicit Content
 */
export enum ExplicitContent {
  Clean = 0,
  Explicit = 1
}

/**
 * Podcast Reaction Type
 */
export enum PodcastReactionType {
  Like = 0,
  Love = 1,
  Insightful = 2,
  Helpful = 3,
  Fire = 4
}

/**
 * Podcast Monetization Status
 */
export enum PodcastMonetizationStatus {
  NotEligible = 0,
  Pending = 1,
  Enabled = 2,
  Disabled = 3,
  Suspended = 4
}

/**
 * Podcast Ad Type
 */
export enum PodcastAdType {
  PreRoll = 0,
  MidRoll = 1,
  PostRoll = 2,
  Sponsored = 3
}

/**
 * Live Recording Status
 */
export enum LiveRecordingStatus {
  Scheduled = 0,
  Starting = 1,
  Live = 2,
  Paused = 3,
  Ended = 4,
  Cancelled = 5,
  Processing = 6
}

/**
 * Share Platform
 */
export enum SharePlatform {
  InApp = 0,
  CopyLink = 1,
  Twitter = 2,
  Facebook = 3,
  Instagram = 4,
  WhatsApp = 5,
  Telegram = 6,
  Email = 7,
  SMS = 8,
  Other = 9
}

/**
 * Mention Type
 */
export enum MentionType {
  Guest = 0,
  Host = 1,
  Reference = 2,
  Shoutout = 3,
  Sponsor = 4
}

/**
 * Sponsorship Type
 */
export enum SponsorshipType {
  PerEpisode = 0,
  Monthly = 1,
  Quarterly = 2,
  Annual = 3,
  OneTime = 4
}
