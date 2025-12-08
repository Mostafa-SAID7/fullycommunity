export interface Notification {
  id: string;
  type: string;
  title: string;
  message?: string;
  imageUrl?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationActionResponse {
  message: string;
  id?: string;
}

export type NotificationType =
  | 'NewFollower'
  | 'NewLike'
  | 'NewComment'
  | 'NewMention'
  | 'NewMessage'
  | 'SecurityAlert'
  | 'AccountUpdate'
  | 'SystemAnnouncement'
  | 'NewOrder'
  | 'OrderStatusUpdate'
  | 'EventReminder';
