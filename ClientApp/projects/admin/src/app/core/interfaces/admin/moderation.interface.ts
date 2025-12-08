export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'dismissed';
export type ModerationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ModerationItem {
  id: string;
  contentId: string;
  contentType: string;
  contentTitle: string;
  reportReason: string;
  reportedBy: string;
  reportedAt: string;
  status: ModerationStatus;
  priority: ModerationPriority;
  moderatorId?: string;
  moderatedAt?: string;
  moderatorNotes?: string;
}

export interface ModerationListResponse {
  items: ModerationItem[];
  totalCount: number;
  pendingCount: number;
}

export interface ModerationStats {
  pendingReports: number;
  resolvedToday: number;
  resolvedThisWeek: number;
  totalReports: number;
}

export interface ModerationActionRequest {
  notes?: string;
  reason?: string;
}

export interface BanUserRequest {
  reason: string;
  durationDays?: number;
}
