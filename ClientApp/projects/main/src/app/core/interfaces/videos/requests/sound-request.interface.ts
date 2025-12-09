/**
 * Create Sound Request
 */
export interface CreateSoundRequest {
  title: string;
  artist?: string;
  album?: string;
  audioFile: File;
  coverImageFile?: File;
  genre?: string;
  tags?: string[];
  isCopyrighted?: boolean;
  copyrightHolder?: string;
  licenseInfo?: string;
}

/**
 * Update Sound Request
 */
export interface UpdateSoundRequest {
  title?: string;
  artist?: string;
  album?: string;
  coverImageFile?: File;
  genre?: string;
  tags?: string[];
}

/**
 * Favorite Sound Request
 */
export interface FavoriteSoundRequest {
  soundId: string;
}

/**
 * Unfavorite Sound Request
 */
export interface UnfavoriteSoundRequest {
  soundId: string;
}
