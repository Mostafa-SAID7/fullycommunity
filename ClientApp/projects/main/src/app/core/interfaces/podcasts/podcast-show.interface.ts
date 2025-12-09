import { UserActionFlags } from '../common/user-action.interface';
import { PodcastType, PodcastStatus, PodcastVisibility, ExplicitContent, PodcastCategory, PodcastMonetizationStatus } from './enums/podcast-enums';

/**
 * Main Podcast Show interface
 * Represents a podcast series/show
 */
export interface PodcastShow {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string | null;
  
  // Basic Info
  title: string;
  description: string | null;
  slug: string | null;
  summary: string | null;
  
  // Media
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
  trailerUrl: string | null;
  
  // Type & Status
  type: PodcastType;
  status: PodcastStatus;
  visibility: PodcastVisibility;
  explicitContent: ExplicitContent;
  
  // Categorization
  category: PodcastCategory;
  tags: string[];
  language: string | null;
  
  // Publishing
  publishedAt: string | null;
  rssFeedUrl: string | null;
  websiteUrl: string | null;
  
  // Stats
  episodeCount: number;
  subscriberCount: number;
  totalPlays: number;
  totalDownloads: number;
  averageRating: number;
  ratingCount: number;
  
  // Settings
  allowComments: boolean;
  allowDownloads: boolean;
  showPlayCount: boolean;
  
  // Monetization
  monetizationStatus: PodcastMonetizationStatus;
  hasAds: boolean;
  isSponsoredContent: boolean;
  sponsorName: string | null;
  totalEarnings: number | null;
  
  // Social Links
  applePodcastsUrl: string | null;
  spotifyUrl: string | null;
  googlePodcastsUrl: string | null;
  youtubeUrl: string | null;
  
  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  
  // Copyright
  copyright: string | null;
  author: string | null;
  ownerEmail: string | null;
  
  // Hosts
  hosts: PodcastHost[];
  
  // User Actions
  userActions: UserActionFlags | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Podcast Host
 */
export interface PodcastHost {
  id: string;
  userId: string | null;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  websiteUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  isPrimaryHost: boolean;
}
