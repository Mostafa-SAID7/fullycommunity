/**
 * Featured Sellers
 */
export interface FeaturedSellers {
  sellers: FeaturedSeller[];
  totalCount: number;
}

/**
 * Featured Seller
 */
export interface FeaturedSeller {
  id: string;
  sellerId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  productCount: number;
  followerCount: number;
  suggestionReason: string;
  isFollowing: boolean;
}
