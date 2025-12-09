import { ReportReason, ReportStatus } from '../enums/video-enums';

/**
 * Video Report
 */
export interface VideoReport {
  id: string;
  videoId: string;
  reportedByUserId: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
}
