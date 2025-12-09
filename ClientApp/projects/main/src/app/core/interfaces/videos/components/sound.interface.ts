/**
 * Sound (Audio/Music for videos)
 */
export interface Sound {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  audioUrl: string;
  coverImageUrl: string | null;
  duration: string; // TimeSpan
  clipStart: string | null; // TimeSpan
  clipEnd: string | null; // TimeSpan
  
  // Origin
  isOriginal: boolean;
  originalVideoId: string | null;
  creatorChannelId: string | null;
  creatorChannelHandle: string | null;
  
  // Stats
  usageCount: number;
  favoriteCount: number;
  
  // Status
  isAvailable: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  
  // Copyright
  isCopyrighted: boolean;
  copyrightHolder: string | null;
  licenseInfo: string | null;
  
  // Genre/Category
  genre: string | null;
  tags: string[];
  
  // Timestamps
  createdAt: string;
}

/**
 * Sound List Item
 */
export interface SoundListItem {
  id: string;
  title: string;
  artist: string | null;
  coverImageUrl: string | null;
  duration: string;
  usageCount: number;
  isTrending: boolean;
}

/**
 * Sound Filter
 */
export interface SoundFilter {
  searchTerm?: string;
  genre?: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}
