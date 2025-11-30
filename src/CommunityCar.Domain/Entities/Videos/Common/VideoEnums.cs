namespace CommunityCar.Domain.Entities.Videos.Common;

// Video Types
public enum VideoType { Standard, Short, Reel, LiveStream, Story, Tutorial, Review }
public enum VideoStatus { Draft, Processing, Published, Scheduled, Unlisted, Private, Removed }
public enum VideoVisibility { Public, Unlisted, Private, FollowersOnly }
public enum VideoQuality { SD_360, SD_480, HD_720, HD_1080, UHD_4K }

// Content
public enum ContentRating { General, Teen, Mature, Restricted }
public enum VideoOrientation { Landscape, Portrait, Square }

// Engagement
public enum ReactionType { Like, Love, Laugh, Wow, Sad, Angry }
public enum CommentStatus { Visible, Hidden, Flagged, Removed }

// Live Stream
public enum LiveStreamStatus { Scheduled, Starting, Live, Paused, Ended, Cancelled }
public enum StreamQuality { Low, Medium, High, Ultra }

// Monetization
public enum MonetizationStatus { NotEligible, Pending, Enabled, Disabled, Suspended }
public enum AdType { PreRoll, MidRoll, PostRoll, Banner, Sponsored }

// Reports
public enum ReportReason { Spam, Harassment, HateSpeech, Violence, Nudity, Misinformation, Copyright, Other }
public enum ReportStatus { Pending, UnderReview, Resolved, Dismissed }

// Channel
public enum ChannelStatus { Active, Suspended, Banned, Deactivated }
public enum ChannelTier { Basic, Verified, Partner, Premium }
