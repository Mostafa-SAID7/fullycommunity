/**
 * Featured Providers
 */
export interface FeaturedProviders {
  providers: FeaturedProvider[];
  totalCount: number;
}

/**
 * Featured Provider
 */
export interface FeaturedProvider {
  id: string;
  providerId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  serviceCount: number;
  completedBookings: number;
  categories: string[];
  suggestionReason: string;
  isFollowing: boolean;
}
