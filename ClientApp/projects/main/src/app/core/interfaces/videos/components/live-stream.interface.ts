import { LiveStreamStatus, StreamQuality, ContentRating } from '../enums/video-enums';

/**
 * Live Stream
 */
export interface LiveStream {
  id: string;
  channelId: string;
  channel: LiveStreamChannel;
  
  // Basic Info
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  
  // Stream Info
  streamKey: string;
  streamUrl: string | null;
  playbackUrl: string | null;
  chatRoomId: string | null;
  
  // Status
  status: LiveStreamStatus;
  quality: StreamQuality;
  contentRating: ContentRating;
  
  // Schedule
  scheduledStartAt: string | null;
  actualStartAt: string | null;
  endedAt: string | null;
  duration: string; // TimeSpan
  
  // Stats
  peakViewers: number;
  currentViewers: number;
  totalViewers: number;
  likeCount: number;
  chatMessageCount: number;
  
  // Settings
  allowChat: boolean;
  slowModeEnabled: boolean;
  slowModeSeconds: number;
  subscribersOnlyChat: boolean;
  allowGifts: boolean;
  
  // Recording
  saveRecording: boolean;
  recordedVideoId: string | null;
  
  // Monetization
  isMonetized: boolean;
  totalGiftsReceived: number;
  totalEarnings: number;
  
  // Category
  categoryId: string | null;
  categoryName: string | null;
  tags: string[];
  
  // Timestamps
  createdAt: string;
}

/**
 * Live Stream Channel
 */
export interface LiveStreamChannel {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

/**
 * Live Stream List Item
 */
export interface LiveStreamListItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  channelHandle: string;
  channelDisplayName: string;
  channelAvatarUrl: string | null;
  channelIsVerified: boolean;
  status: LiveStreamStatus;
  currentViewers: number;
  categoryName: string | null;
}

/**
 * Live Stream Chat Message
 */
export interface LiveStreamChat {
  id: string;
  userId: string;
  userHandle: string;
  userDisplayName: string;
  userAvatarUrl: string | null;
  message: string;
  type: ChatMessageType;
  isPinned: boolean;
  isHighlighted: boolean;
  sentAt: string;
}

/**
 * Chat Message Type
 */
export enum ChatMessageType {
  Regular = 0,
  System = 1,
  Gift = 2,
  Subscription = 3,
  Moderator = 4
}

/**
 * Live Stream Gift
 */
export interface LiveStreamGift {
  id: string;
  senderId: string;
  senderHandle: string;
  senderDisplayName: string;
  senderAvatarUrl: string | null;
  giftName: string;
  giftIconUrl: string;
  giftAnimationUrl: string | null;
  quantity: number;
  totalValue: number;
  message: string | null;
  sentAt: string;
}

/**
 * Gift Type
 */
export interface GiftType {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string;
  animationUrl: string | null;
  price: number;
  currency: string;
  coinsRequired: number;
}

/**
 * Live Stream Filter
 */
export interface LiveStreamFilter {
  keywords?: string;
  status?: LiveStreamStatus;
  categoryId?: string;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}
