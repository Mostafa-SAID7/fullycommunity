namespace CommunityCar.Domain.Entities.Podcasts.Common;

// Podcast Types
public enum PodcastType { Audio, Video, AudioVideo }
public enum PodcastStatus { Draft, Processing, Published, Scheduled, Unlisted, Private, Removed }
public enum PodcastVisibility { Public, Unlisted, Private, SubscribersOnly }

// Episode
public enum EpisodeType { Full, Trailer, Bonus, Interview, QA, Recap, Highlight, BehindTheScenes }
public enum EpisodeStatus { Draft, Processing, Published, Scheduled, Removed }

// Content
public enum PodcastCategory { Automotive, Technology, News, Comedy, Education, Sports, Business, Lifestyle, Entertainment, CarReviews, Maintenance, Racing, Electric, Classic, Tuning, Other }
public enum ExplicitContent { Clean, Explicit }

// Engagement
public enum PodcastReactionType { Like, Love, Insightful, Helpful, Fire }

// Monetization
public enum PodcastMonetizationStatus { NotEligible, Pending, Enabled, Disabled, Suspended }
public enum PodcastAdType { PreRoll, MidRoll, PostRoll, Sponsored }

// Live Recording
public enum LiveRecordingStatus { Scheduled, Starting, Live, Paused, Ended, Cancelled, Processing }

// Share
public enum SharePlatform { InApp, CopyLink, Twitter, Facebook, Instagram, WhatsApp, Telegram, Email, SMS, Other }

// Mention
public enum MentionType { Guest, Host, Reference, Shoutout, Sponsor }

// Sponsorship
public enum SponsorshipType { PerEpisode, Monthly, Quarterly, Annual, OneTime }
