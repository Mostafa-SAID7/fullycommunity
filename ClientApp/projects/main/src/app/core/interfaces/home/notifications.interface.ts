import { FeedItemType, FeedContentSource } from './enums/home-enums';

/**
 * Notification
 * User notification for home feed
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  
  // Content
  title: string;
  message: string;
  imageUrl: string | null;
  
  // Source
  sourceId: string | null;
  sourceType: FeedItemType | null;
  source: FeedContentSource | null;
  
  // Actor (who triggered the notification)
  actorId: string | null;
  actorName: string | null;
  actorAvatarUrl: string | null;
  
  // Action
  actionUrl: string | null;
  actionText: string | null;
  
  // Status
  isRead: boolean;
  isSeen: boolean;
  
  // Timestamps
  createdAt: string;
  readAt: string | null;
}

/**
 * Notification Type
 */
export enum NotificationType {
  Like = 0,
  Comment = 1,
  Share = 2,
  Follow = 3,
  Mention = 4,
  Reply = 5,
  NewContent = 6,
  Trending = 7,
  Recommendation = 8,
  Achievement = 9,
  System = 10,
  Order = 11,
  Booking = 12,
  Message = 13
}

/**
 * Notification Settings
 */
export interface NotificationSettings {
  id: string;
  userId: string;
  
  // Push Notifications
  pushEnabled: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushFollows: boolean;
  pushMentions: boolean;
  pushNewContent: boolean;
  pushTrending: boolean;
  
  // Email Notifications
  emailEnabled: boolean;
  emailDigest: boolean;
  emailFrequency: string;
  
  // In-App
  inAppEnabled: boolean;
  showBadge: boolean;
  playSound: boolean;
  
  // Quiet Hours
  quietHoursEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  
  updatedAt: string;
}

/**
 * Notification Summary
 */
export interface NotificationSummary {
  totalCount: number;
  unreadCount: number;
  unseenCount: number;
  lastNotification: Notification | null;
}
