/**
 * Popular Sounds
 */
export interface PopularSounds {
  sounds: PopularSound[];
  category: string | null;
  totalCount: number;
}

/**
 * Popular Sound
 */
export interface PopularSound {
  id: string;
  soundId: string;
  title: string;
  artist: string | null;
  duration: number;
  thumbnailUrl: string | null;
  usageCount: number;
  trendingScore: number;
  category: string | null;
}
