/**
 * Admin Videos Management
 * Video content administration
 */

// Import shared common interfaces
import { 
  ModerationStatus, 
  CategoryStats, 
  BaseAdminEntity, 
  ModerationInfo,
  BaseStatistics,
  BaseFilter,
  ContentStatus,
  VerificationStatus
} from '../../common/admin-common.interface';
export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelName: string;
  channelVerified: boolean;
  
  // Video Details
  duration: number;
  videoUrl: string;
  thumbnailUrl: string | null;
  quality: string;
  fileSize: number;
  
  // Status
  status: AdminVideoStatus;
  moderationStatus: ModerationStatus;
  processingStatus: VideoProcessingStatus;
  
  // Stats
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount: number;
  
  // Content Info
  category: string;
  tags: string[];
  language: string | null;
  isLiveStream: boolean;
  
  // Monetization
  isMonetized: boolean;
  adsEnabled: boolean;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  uploadedAt: string;
  publishedAt: string | null;
  updatedAt: string;
}

/**
 * Admin Video Status
 */
export enum AdminVideoStatus {
  Draft = 0,
  Published = 1,
  Unlisted = 2,
  Private = 3,
  Archived = 4,
  Deleted = 5,
  Hidden = 6,
  Flagged = 7
}

/**
 * Video Processing Status
 */
export enum VideoProcessingStatus {
  Uploading = 0,
  Processing = 1,
  Processed = 2,
  Failed = 3,
  Queued = 4
}

/**
 * Admin Video Channel
 */
export interface AdminVideoChannel {
  id: string;
  name: string;
  username: string;
  ownerId: string;
  ownerName: string;
  
  // Channel Details
  description: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  category: string;
  
  // Status
  status: AdminChannelStatus;
  moderationStatus: ModerationStatus;
  verificationStatus: ChannelVerificationStatus;
  
  // Stats
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  reportCount: number;
  
  // Monetization
  isMonetized: boolean;
  partnerProgram: boolean;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Channel Status
 */
export enum AdminChannelStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Terminated = 3,
  UnderReview = 4
}

/**
 * Channel Verification Status
 */
export enum ChannelVerificationStatus {
  Unverified = 0,
  Pending = 1,
  Verified = 2,
  Rejected = 3
}

/**
 * Admin Live Stream
 */
export interface AdminLiveStream {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelName: string;
  
  // Stream Details
  streamKey: string;
  streamUrl: string;
  thumbnailUrl: string | null;
  
  // Status
  status: LiveStreamStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  viewerCount: number;
  peakViewers: number;
  likeCount: number;
  commentCount: number;
  reportCount: number;
  
  // Stream Info
  category: string;
  tags: string[];
  isRecorded: boolean;
  
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
 * Live Stream Status
 */
export enum LiveStreamStatus {
  Scheduled = 0,
  Live = 1,
  Ended = 2,
  Cancelled = 3,
  Suspended = 4
}

/**
 * Videos Filter
 */
export interface VideosFilter {
  search: string | null;
  contentType: VideoContentType | null;
  status: AdminVideoStatus | null;
  moderationStatus: ModerationStatus | null;
  channelId: string | null;
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  hasReports: boolean | null;
  isFlagged: boolean | null;
  isLiveStream: boolean | null;
  isMonetized: boolean | null;
}

/**
 * Video Content Type
 */
export enum VideoContentType {
  Video = 0,
  LiveStream = 1,
  Short = 2,
  Premiere = 3
}

/**
 * Videos Statistics
 */
export interface VideosStatistics {
  totalVideos: number;
  totalChannels: number;
  totalLiveStreams: number;
  
  // Status Breakdown
  publishedVideos: number;
  draftVideos: number;
  flaggedVideos: number;
  
  // Moderation
  pendingModeration: number;
  reportedVideos: number;
  
  // Engagement
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  
  // Growth
  newVideosToday: number;
  newVideosThisWeek: number;
  newVideosThisMonth: number;
  
  // Top Categories
  topCategories: CategoryStats[];
  
  // Storage
  totalStorageUsed: number;
  bandwidthUsed: number;
}