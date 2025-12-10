/**
 * Admin Podcasts Management
 * Podcast content administration
 */

/**
 * Moderation Status
 */
export enum ModerationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Flagged = 3,
  UnderReview = 4,
  RequiresAction = 5
}

/**
 * Category Stats
 */
export interface CategoryStats {
  category: string;
  postCount: number;
  engagementRate: number;
}
export interface AdminPodcastShow {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  
  // Show Details
  category: string;
  language: string;
  isExplicit: boolean;
  
  // Media
  avatarUrl: string | null;
  bannerUrl: string | null;
  
  // Status
  status: AdminPodcastStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  subscriberCount: number;
  episodeCount: number;
  totalPlays: number;
  reportCount: number;
  
  // Monetization
  isMonetized: boolean;
  sponsorshipEnabled: boolean;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Podcast Status
 */
export enum AdminPodcastStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Archived = 3,
  Deleted = 4,
  UnderReview = 5
}

/**
 * Admin Podcast Episode
 */
export interface AdminPodcastEpisode {
  id: string;
  title: string;
  description: string;
  showId: string;
  showName: string;
  
  // Episode Details
  episodeNumber: number | null;
  seasonNumber: number | null;
  duration: number;
  audioUrl: string;
  fileSize: number;
  
  // Status
  status: AdminEpisodeStatus;
  moderationStatus: ModerationStatus;
  processingStatus: AudioProcessingStatus;
  
  // Stats
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount: number;
  
  // Content Info
  isExplicit: boolean;
  tags: string[];
  
  // Monetization
  hasAds: boolean;
  sponsorshipInfo: string | null;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  publishedAt: string | null;
  recordedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Episode Status
 */
export enum AdminEpisodeStatus {
  Draft = 0,
  Published = 1,
  Scheduled = 2,
  Archived = 3,
  Deleted = 4,
  Hidden = 5,
  Flagged = 6
}

/**
 * Audio Processing Status
 */
export enum AudioProcessingStatus {
  Uploading = 0,
  Processing = 1,
  Processed = 2,
  Failed = 3,
  Queued = 4
}

/**
 * Admin Live Recording
 */
export interface AdminLiveRecording {
  id: string;
  title: string;
  description: string;
  showId: string;
  showName: string;
  
  // Recording Details
  streamUrl: string;
  recordingUrl: string | null;
  
  // Status
  status: LiveRecordingStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  listenerCount: number;
  peakListeners: number;
  likeCount: number;
  commentCount: number;
  reportCount: number;
  
  // Recording Info
  isRecorded: boolean;
  autoPublish: boolean;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  startedAt: string | null;
  endedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
}

/**
 * Live Recording Status
 */
export enum LiveRecordingStatus {
  Scheduled = 0,
  Live = 1,
  Ended = 2,
  Cancelled = 3,
  Suspended = 4
}

/**
 * Podcasts Filter
 */
export interface PodcastsFilter {
  search: string | null;
  contentType: PodcastContentType | null;
  status: AdminPodcastStatus | null;
  moderationStatus: ModerationStatus | null;
  showId: string | null;
  category: string | null;
  language: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  hasReports: boolean | null;
  isFlagged: boolean | null;
  isExplicit: boolean | null;
  isMonetized: boolean | null;
}

/**
 * Podcast Content Type
 */
export enum PodcastContentType {
  Show = 0,
  Episode = 1,
  LiveRecording = 2
}

/**
 * Podcasts Statistics
 */
export interface PodcastsStatistics {
  totalShows: number;
  totalEpisodes: number;
  totalLiveRecordings: number;
  
  // Status Breakdown
  activeShows: number;
  publishedEpisodes: number;
  draftEpisodes: number;
  flaggedContent: number;
  
  // Moderation
  pendingModeration: number;
  reportedContent: number;
  
  // Engagement
  totalPlays: number;
  totalSubscribers: number;
  totalLikes: number;
  totalComments: number;
  
  // Growth
  newEpisodesToday: number;
  newEpisodesThisWeek: number;
  newEpisodesThisMonth: number;
  
  // Top Categories
  topCategories: CategoryStats[];
  
  // Storage
  totalStorageUsed: number;
  bandwidthUsed: number;
}