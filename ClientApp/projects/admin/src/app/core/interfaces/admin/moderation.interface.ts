export interface ModerationItem {
  id: string;
  contentId: string;
  contentType: 'post' | 'comment' | 'review' | 'video' | 'guide';
  contentTitle: string;
  contentPreview: string;
  reportReason: string;
  reporterId: string;
  reporterName: string;
  reportedAt: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'dismissed';
  moderatorId?: string;
  moderatorNotes?: string;
  resolvedAt?: Date;
}

export interface ModerationStats {
  pendingReports: number;
  resolvedToday: number;
  resolvedThisWeek: number;
  totalReports: number;
  averageResolutionTime: number;
}

export interface ModerationResponse {
  items: ModerationItem[];
  totalCount: number;
  totalPages: number;
}

export interface ModerationAction {
  itemId: string;
  action: 'approve' | 'reject' | 'dismiss' | 'ban';
  reason?: string;
  notes?: string;
  durationDays?: number;
}