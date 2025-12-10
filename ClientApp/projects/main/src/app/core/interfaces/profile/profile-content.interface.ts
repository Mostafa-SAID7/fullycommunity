/**
 * Profile Content
 * User's created content overview
 */
export interface ProfileContent {
  userId: string;
  
  // Posts
  posts: ProfileContentItem[];
  postsCount: number;
  
  // Videos
  videos: ProfileContentItem[];
  videosCount: number;
  
  // Podcasts
  podcasts: ProfileContentItem[];
  podcastsCount: number;
  
  // Products
  products: ProfileContentItem[];
  productsCount: number;
  
  // Services
  services: ProfileContentItem[];
  servicesCount: number;
  
  // Reviews
  reviews: ProfileContentItem[];
  reviewsCount: number;
}

/**
 * Profile Content Item
 */
export interface ProfileContentItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

/**
 * Saved Content
 */
export interface SavedContent {
  id: string;
  userId: string;
  contentId: string;
  contentType: string;
  title: string;
  thumbnailUrl: string | null;
  authorName: string;
  savedAt: string;
}

/**
 * Content Collection
 */
export interface ContentCollection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  itemCount: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Collection Item
 */
export interface CollectionItem {
  id: string;
  collectionId: string;
  contentId: string;
  contentType: string;
  title: string;
  thumbnailUrl: string | null;
  addedAt: string;
}
