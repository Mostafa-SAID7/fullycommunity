/**
 * Video Core Components
 * Core video-related interfaces
 */

import {
  VideoStatus,
  ModerationStatus,
  VideoQuality,
  AgeRating,
  ProcessingStatus,
  WarningType,
  WarningSeverity
} from '../enums/video-enums';

import { 
  ChannelStatus,
  MonetizationType,
  AppealStatus,
  FlagReason,
  FlagStatus,
  ReportType,
  ReportStatus,
  ReportPriority,
  ModerationAction
} from '../enums/video-enums';

export interface VideoAdmin {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  shareCount: number;
  flagCount: number;
  status: VideoStatus;
  moderationStatus: ModerationStatus;
  quality: VideoQuality;
  resolution: string;
  fileSize: number;
  format: string;
  uploadedAt: string;
  publishedAt: string | null;
  lastModifiedAt: string;
  creator: VideoCreator;
  category: VideoCategory;
  tags: string[];
  language: string;
  ageRating: AgeRating;
  monetization: VideoMonetization;
  analytics: VideoAnalytics;
  moderation: VideoModeration;
  flags: VideoFlag[];
  reports: VideoReport[];
  metadata: VideoMetadata;
}

export interface VideoCategory {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  isActive: boolean;
  videoCount: number;
}

export interface VideoMetadata {
  originalFilename: string;
  uploadIp: string;
  userAgent: string;
  processingStatus: ProcessingStatus;
  processingProgress: number;
  processingStartedAt: string | null;
  processingCompletedAt: string | null;
  processingErrors: string[];
  thumbnailGeneratedAt: string | null;
  subtitlesGenerated: boolean;
  subtitlesLanguages: string[];
  transcriptionGenerated: boolean;
  transcriptionLanguage: string | null;
  contentWarnings: ContentWarning[];
  aiModerationScore: number;
  aiModerationFlags: string[];
}

export interface ContentWarning {
  type: WarningType;
  severity: WarningSeverity;
  description: string;
  timestamp: string;
  confidence: number;
}

export interface VideoStats {
  totalVideos: number;
  activeVideos: number;
  pendingReview: number;
  flaggedVideos: number;
  removedVideos: number;
  archivedVideos: number;
  totalViews: number;
  totalDuration: number;
  totalFileSize: number;
  avgRating: number;
  monetizedVideos: number;
  liveVideos: number;
  scheduledVideos: number;
  processingVideos: number;
  todayUploads: number;
  weeklyUploads: number;
  monthlyUploads: number;
}

// Creator interfaces
export interface VideoCreator {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  joinedAt: string;
  isVerified: boolean;
  channelStatus: ChannelStatus;
  monetizationEnabled: boolean;
}

// Monetization interfaces
export interface VideoMonetization {
  isEnabled: boolean;
  type: MonetizationType;
  revenue: number;
  adRevenue: number;
  sponsorshipRevenue: number;
  donationRevenue: number;
  subscriptionRevenue: number;
  cpm: number;
  rpm: number;
}

// Analytics interfaces
export interface VideoAnalytics {
  impressions: number;
  clickThroughRate: number;
  averageViewDuration: number;
  watchTimeHours: number;
  retentionRate: number;
  engagementRate: number;
  subscribersGained: number;
  subscribersLost: number;
  topCountries: CountryStats[];
  topAgeGroups: AgeGroupStats[];
  topDevices: DeviceStats[];
  trafficSources: TrafficSourceStats[];
}

export interface CountryStats {
  country: string;
  countryCode: string;
  views: number;
  percentage: number;
}

export interface AgeGroupStats {
  ageGroup: string;
  views: number;
  percentage: number;
}

export interface DeviceStats {
  device: string;
  views: number;
  percentage: number;
}

export interface TrafficSourceStats {
  source: string;
  views: number;
  percentage: number;
}

export interface DetailedVideoAnalytics extends VideoAnalytics {
  hourlyViews: { hour: string; views: number }[];
  dailyViews: { date: string; views: number }[];
  weeklyViews: { week: string; views: number }[];
  monthlyViews: { month: string; views: number }[];
  retentionCurve: { timestamp: number; percentage: number }[];
  heatmap: { x: number; y: number; intensity: number }[];
}

// Moderation interfaces
export interface VideoModeration {
  moderatedAt: string | null;
  moderatedBy: string | null;
  moderationReason: string | null;
  moderationNotes: string | null;
  appealStatus: AppealStatus | null;
  appealedAt: string | null;
  appealReason: string | null;
  appealResponse: string | null;
  appealResolvedAt: string | null;
  warningCount: number;
  strikeCount: number;
  lastWarningAt: string | null;
  lastStrikeAt: string | null;
}

export interface VideoComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
  isEdited: boolean;
  isPinned: boolean;
  moderationStatus: ModerationStatus;
  reportCount: number;
}

export interface ModerationHistoryEntry {
  id: string;
  action: ModerationAction;
  moderatorId: string;
  moderatorName: string;
  reason: string;
  notes: string;
  timestamp: string;
  previousStatus: VideoStatus;
  newStatus: VideoStatus;
}

// Reporting interfaces
export interface VideoFlag {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: FlagReason;
  description: string;
  timestamp: string;
  status: FlagStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
}

export interface VideoReport {
  id: string;
  reporterId: string;
  reporterName: string;
  type: ReportType;
  reason: string;
  description: string;
  timestamp: string;
  status: ReportStatus;
  priority: ReportPriority;
  assignedTo: string | null;
  resolvedAt: string | null;
  resolution: string | null;
}