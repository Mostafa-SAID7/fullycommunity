/**
 * Common Enums and Types
 * Re-export from admin-common for centralized management
 */

// Import all common interfaces and enums
export * from './admin-common.interface';

// Legacy type aliases for backward compatibility
export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';
export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type ServiceStatus = 'available' | 'booked' | 'in_progress' | 'completed' | 'cancelled';

// Enhanced enums for admin functionality
export enum AdminRole {
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  Moderator = 'moderator',
  ContentModerator = 'content_moderator',
  UserManager = 'user_manager',
  AnalyticsViewer = 'analytics_viewer',
  Support = 'support',
  Viewer = 'viewer'
}

export enum ContentType {
  Post = 'post',
  Comment = 'comment',
  Video = 'video',
  Audio = 'audio',
  Image = 'image',
  Document = 'document',
  Podcast = 'podcast',
  Episode = 'episode',
  LiveStream = 'live_stream',
  Product = 'product',
  Service = 'service',
  Event = 'event',
  Page = 'page',
  News = 'news',
  Guide = 'guide',
  Review = 'review',
  Question = 'question',
  Answer = 'answer',
  Group = 'group',
  Channel = 'channel',
  Playlist = 'playlist',
  Category = 'category',
  Tag = 'tag',
  Menu = 'menu',
  Media = 'media'
}
