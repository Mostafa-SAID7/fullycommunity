/**
 * Admin CMS Management
 * Content Management System for site pages
 */

/**
 * Category Stats
 */
export interface CategoryStats {
  category: string;
  postCount: number;
  engagementRate: number;
}
export interface AdminCMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  
  // Page Details
  pageType: CMSPageType;
  template: string | null;
  parentId: string | null;
  
  // Status
  status: AdminPageStatus;
  visibility: PageVisibility;
  
  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  
  // Media
  featuredImageUrl: string | null;
  bannerImageUrl: string | null;
  
  // Settings
  allowComments: boolean;
  showInMenu: boolean;
  menuOrder: number | null;
  
  // Author
  authorId: string;
  authorName: string;
  
  // Timestamps
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * CMS Page Type
 */
export enum CMSPageType {
  Page = 0,
  Post = 1,
  News = 2,
  Guide = 3,
  FAQ = 4,
  Legal = 5,
  Landing = 6,
  Category = 7
}

/**
 * Admin Page Status
 */
export enum AdminPageStatus {
  Draft = 0,
  Published = 1,
  Scheduled = 2,
  Archived = 3,
  Deleted = 4,
  Private = 5
}

/**
 * Page Visibility
 */
export enum PageVisibility {
  Public = 0,
  Private = 1,
  Protected = 2,
  MembersOnly = 3
}

/**
 * Admin CMS Menu
 */
export interface AdminCMSMenu {
  id: string;
  name: string;
  location: string;
  
  // Status
  status: MenuStatus;
  
  // Items
  items: AdminCMSMenuItem[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Menu Status
 */
export enum MenuStatus {
  Active = 0,
  Inactive = 1,
  Draft = 2
}

/**
 * Admin CMS Menu Item
 */
export interface AdminCMSMenuItem {
  id: string;
  menuId: string;
  title: string;
  url: string | null;
  pageId: string | null;
  
  // Hierarchy
  parentId: string | null;
  order: number;
  
  // Settings
  openInNewTab: boolean;
  cssClass: string | null;
  
  // Status
  isActive: boolean;
}

/**
 * Admin CMS Media
 */
export interface AdminCMSMedia {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  
  // URLs
  url: string;
  thumbnailUrl: string | null;
  
  // Metadata
  alt: string | null;
  caption: string | null;
  description: string | null;
  
  // Dimensions (for images)
  width: number | null;
  height: number | null;
  
  // Author
  uploadedBy: string;
  uploaderName: string;
  
  // Usage
  usageCount: number;
  
  // Timestamps
  uploadedAt: string;
}

/**
 * Admin CMS Category
 */
export interface AdminCMSCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  
  // Hierarchy
  parentId: string | null;
  
  // Media
  imageUrl: string | null;
  
  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  
  // Stats
  postCount: number;
  
  // Status
  status: CategoryStatus;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Category Status
 */
export enum CategoryStatus {
  Active = 0,
  Inactive = 1,
  Archived = 2
}

/**
 * Admin CMS Tag
 */
export interface AdminCMSTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  
  // Stats
  usageCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin CMS Comment
 */
export interface AdminCMSComment {
  id: string;
  pageId: string;
  pageTitle: string;
  
  // Author
  authorId: string | null;
  authorName: string;
  authorEmail: string;
  authorUrl: string | null;
  
  // Content
  content: string;
  
  // Status
  status: CommentStatus;
  
  // Hierarchy
  parentId: string | null;
  
  // Moderation
  isApproved: boolean;
  isSpam: boolean;
  
  // Timestamps
  createdAt: string;
  approvedAt: string | null;
}

/**
 * Comment Status
 */
export enum CommentStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Spam = 3,
  Trash = 4
}

/**
 * CMS Filter
 */
export interface CMSFilter {
  search: string | null;
  contentType: CMSContentType | null;
  status: AdminPageStatus | null;
  pageType: CMSPageType | null;
  authorId: string | null;
  categoryId: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

/**
 * CMS Content Type
 */
export enum CMSContentType {
  Page = 0,
  Menu = 1,
  Media = 2,
  Category = 3,
  Tag = 4,
  Comment = 5
}

/**
 * CMS Statistics
 */
export interface CMSStatistics {
  totalPages: number;
  totalPosts: number;
  totalMedia: number;
  totalComments: number;
  
  // Status Breakdown
  publishedPages: number;
  draftPages: number;
  pendingComments: number;
  
  // Growth
  newPagesToday: number;
  newPagesThisWeek: number;
  newPagesThisMonth: number;
  
  // Top Categories
  topCategories: CategoryStats[];
  
  // Storage
  totalStorageUsed: number;
  mediaCount: number;
}