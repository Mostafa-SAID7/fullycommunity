/**
 * Video Moderation Request Interfaces
 * Moderation and content management related request interfaces
 */

import { ModerationAction } from '../enums/video-enums';

export interface VideoModerationRequest {
  videoId: string;
  action: ModerationAction;
  reason: string;
  notes?: string;
  notifyCreator?: boolean;
  sendEmail?: boolean;
  duration?: number; // For temporary actions
}

export interface BulkVideoActionRequest {
  videoIds: string[];
  action: ModerationAction;
  reason: string;
  notes?: string;
  notifyCreators?: boolean;
  sendEmails?: boolean;
}

export interface VideoCommentModerationRequest {
  videoId: string;
  commentId: string;
  action: 'approve' | 'reject' | 'remove' | 'pin' | 'unpin';
  reason?: string;
  notifyUser?: boolean;
}

export interface VideoReportRequest {
  videoId: string;
  reportType: string;
  reason: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface VideoAppealRequest {
  videoId: string;
  reason: string;
  description: string;
  evidence?: File[];
}

export interface VideoContentWarningRequest {
  videoId: string;
  warningType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  autoDetected?: boolean;
  confidence?: number;
}

export interface VideoAIModerationRequest {
  videoId: string;
  checkContent?: boolean;
  checkAudio?: boolean;
  checkThumbnail?: boolean;
  sensitivity?: 'low' | 'medium' | 'high';
  categories?: string[];
}