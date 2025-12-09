import { ReportReason } from '../enums/video-enums';

/**
 * Report Video Request
 */
export interface ReportVideoRequest {
  videoId: string;
  reason: ReportReason;
  description?: string;
}
