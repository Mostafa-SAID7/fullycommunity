import { ChannelStatus, ChannelTier, MonetizationStatus } from '../enums/video-enums';

/**
 * Full Channel interface
 */
export interface Channel {
  id: string;
  userId: string;
  handle: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  websiteUrl: string | null;
  
  // Status
  status: ChannelStatus;
  tier: ChannelTier;
  isVerified: boolean;
  verifiedAt: string | null;
  
  // Stats
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  
  // Settings
  allowComments: boolean;
  showSubscriberCount: boolean;
  allowDuets: boolean;
  allowStitches: boolean;
  allowDownloads: boolean;
  
  // Monetization
  monetizationStatus: MonetizationStatus;
  totalEarnings: number;
  
  // Social Links
  instagramUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  
  // Location
  country: string | null;
  city: string | null;
  
  // Categories
  contentCategories: string[];
  
  // User State
  isSubscribedByUser: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Channel List Item
 */
export interface ChannelListItem {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  subscriberCount: number;
  videoCount: number;
  isSubscribedByUser: boolean;
}

/**
 * Channel Subscription
 */
export interface ChannelSubscription {
  id: string;
  channelId: string;
  userId: string;
  notificationsEnabled: boolean;
  subscribedAt: string;
}
