/**
 * Admin Community Management
 * Community content administration
 */

// Import shared common interfaces
import { 
  ModerationStatus, 
  CategoryStats, 
  BaseAdminEntity, 
  ModerationInfo,
  BaseStatistics,
  BaseFilter,
  ContentStatus
} from '../../common/admin-common.interface';
export interface AdminCommunityPost extends BaseAdminEntity {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorVerified: boolean;
  
  // Status
  status: AdminPostStatus;
  moderation: ModerationInfo;
  
  // Stats
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount: number;
  
  // Media
  mediaUrls: string[];
  thumbnailUrl: string | null;
  
  // Categories
  category: string | null;
  tags: string[];
}

/**
 * Admin Post Status
 */
export enum AdminPostStatus {
  Published = 0,
  Draft = 1,
  Archived = 2,
  Deleted = 3,
  Hidden = 4,
  Flagged = 5,
  Pending = 6
}

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
 * Admin Community Question
 */
export interface AdminCommunityQuestion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  
  // Status
  status: AdminPostStatus;
  moderationStatus: ModerationStatus;
  
  // Q&A Specific
  category: string;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  bounty: number | null;
  
  // Stats
  viewCount: number;
  voteCount: number;
  reportCount: number;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Community Review
 */
export interface AdminCommunityReview {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorId: string;
  authorName: string;
  
  // Review Target
  targetType: string;
  targetId: string;
  targetName: string;
  
  // Status
  status: AdminPostStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  helpfulCount: number;
  reportCount: number;
  
  // Media
  mediaUrls: string[];
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Community Event
 */
export interface AdminCommunityEvent {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  
  // Event Details
  startDate: string;
  endDate: string;
  location: string | null;
  isOnline: boolean;
  maxAttendees: number | null;
  
  // Status
  status: AdminEventStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  attendeeCount: number;
  interestedCount: number;
  reportCount: number;
  
  // Media
  bannerUrl: string | null;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Event Status
 */
export enum AdminEventStatus {
  Draft = 0,
  Published = 1,
  Cancelled = 2,
  Completed = 3,
  Archived = 4,
  Hidden = 5
}

/**
 * Admin Community Group
 */
export interface AdminCommunityGroup {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  
  // Group Details
  isPrivate: boolean;
  requiresApproval: boolean;
  category: string;
  
  // Status
  status: AdminGroupStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  memberCount: number;
  postCount: number;
  reportCount: number;
  
  // Media
  avatarUrl: string | null;
  bannerUrl: string | null;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Group Status
 */
export enum AdminGroupStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Archived = 3,
  Deleted = 4
}

/**
 * Community Filter
 */
export interface CommunityFilter {
  search: string | null;
  contentType: CommunityContentType | null;
  status: AdminPostStatus | null;
  moderationStatus: ModerationStatus | null;
  authorId: string | null;
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  hasReports: boolean | null;
  isFlagged: boolean | null;
}

/**
 * Community Content Type
 */
export enum CommunityContentType {
  Post = 0,
  Question = 1,
  Answer = 2,
  Review = 3,
  Event = 4,
  Group = 5,
  Page = 6,
  Guide = 7,
  News = 8,
  Comment = 9
}

/**
 * Community Statistics
 */
export interface CommunityStatistics {
  totalPosts: number;
  totalQuestions: number;
  totalReviews: number;
  totalEvents: number;
  totalGroups: number;
  
  // Moderation
  pendingModeration: number;
  flaggedContent: number;
  reportedContent: number;
  
  // Engagement
  totalComments: number;
  totalLikes: number;
  totalShares: number;
  
  // Growth
  newPostsToday: number;
  newPostsThisWeek: number;
  newPostsThisMonth: number;
  
  // Top Categories
  topCategories: CategoryStats[];
}

/**
 * Category Stats
 */
export interface CategoryStats {
  category: string;
  postCount: number;
  engagementRate: number;
}