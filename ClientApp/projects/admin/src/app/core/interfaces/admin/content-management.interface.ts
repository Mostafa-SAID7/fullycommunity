/**
 * Admin Content Management
 * Content moderation and management
 */
export interface AdminContent {
  id: string;
  type: AdminContentType;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  
  // Author
  authorId: string;
  authorName: string;
  authorVerified: boolean;
  
  // Status
  status: AdminContentStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount: number;
  
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
 * Admin Content Type
 */
export enum AdminContentType {
  Post = 0,
  Video = 1,
  Podcast = 2,
  Product = 3,
  Service = 4,
  NewsArticle = 5,
  Event = 6,
  Question = 7,
  Answer = 8,
  Review = 9,
  Guide = 10,
  Page = 11,
  Comment = 12
}

/**
 * Admin Content Status
 */
export enum AdminContentStatus {
  Published = 0,
  Draft = 1,
  Archived = 2,
  Deleted = 3,
  Hidden = 4,
  Flagged = 5
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
 * Content Filter
 */
export interface ContentFilter {
  search: string | null;
  type: AdminContentType | null;
  status: AdminContentStatus | null;
  moderationStatus: ModerationStatus | null;
  authorId: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  hasReports: boolean | null;
  isFlagged: boolean | null;
}

/**
 * Content Action
 */
export interface ContentAction {
  contentId: string;
  action: ContentActionType;
  reason: string | null;
  notifyAuthor: boolean;
  moderationNotes: string | null;
}

/**
 * Content Action Type
 */
export enum ContentActionType {
  Approve = 0,
  Reject = 1,
  Flag = 2,
  Unflag = 3,
  Hide = 4,
  Unhide = 5,
  Delete = 6,
  Archive = 7,
  Restore = 8,
  Feature = 9,
  Unfeature = 10
}

/**
 * Bulk Content Action
 */
export interface BulkContentAction {
  contentIds: string[];
  action: ContentActionType;
  reason: string | null;
  notifyAuthors: boolean;
  moderationNotes: string | null;
}

/**
 * Content Statistics
 */
export interface ContentStatistics {
  totalContent: number;
  publishedContent: number;
  pendingContent: number;
  flaggedContent: number;
  deletedContent: number;
  
  // By Type
  postCount: number;
  videoCount: number;
  podcastCount: number;
  productCount: number;
  serviceCount: number;
  
  // Moderation
  pendingModeration: number;
  reportedContent: number;
  
  // Growth
  contentGrowthRate: number;
  newContentToday: number;
  newContentThisWeek: number;
  newContentThisMonth: number;
}