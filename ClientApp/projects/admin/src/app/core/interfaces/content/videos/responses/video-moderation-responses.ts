/**
 * Video Moderation Response Interfaces
 * Moderation and content management related response interfaces
 */

import { VideoStatus } from '../enums/video-enums';

export interface VideoModerationResponse {
  success: boolean;
  message: string;
  videoId: string;
  previousStatus: VideoStatus;
  newStatus: VideoStatus;
  moderationId: string;
  timestamp: string;
  notificationSent: boolean;
}

export interface BulkVideoActionResponse {
  success: boolean;
  message: string;
  totalRequested: number;
  successfulActions: number;
  failedActions: number;
  results: {
    videoId: string;
    success: boolean;
    error?: string;
    previousStatus?: VideoStatus;
    newStatus?: VideoStatus;
  }[];
  summary: {
    approved: number;
    rejected: number;
    flagged: number;
    removed: number;
    restored: number;
    archived: number;
  };
}

export interface VideoReportResponse {
  reportId: string;
  videoId: string;
  status: 'submitted' | 'under_review' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  estimatedResolutionTime?: string;
  ticketNumber: string;
  submittedAt: string;
}

export interface VideoAppealResponse {
  appealId: string;
  videoId: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  response?: string;
  estimatedReviewTime?: string;
  ticketNumber: string;
}

export interface VideoContentWarningResponse {
  videoId: string;
  warnings: {
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    confidence: number;
    timestamp?: number;
    autoDetected: boolean;
    reviewedBy?: string;
    reviewedAt?: string;
    createdAt: string;
  }[];
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: 'approve' | 'review' | 'restrict' | 'remove';
}

export interface VideoAIModerationResponse {
  videoId: string;
  moderationId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  results?: {
    overallScore: number;
    categories: {
      name: string;
      score: number;
      threshold: number;
      flagged: boolean;
    }[];
    flags: string[];
    recommendations: {
      action: 'approve' | 'review' | 'flag' | 'remove';
      confidence: number;
      reason: string;
    }[];
    contentWarnings: any[];
  };
  processedAt?: string;
  error?: string;
}