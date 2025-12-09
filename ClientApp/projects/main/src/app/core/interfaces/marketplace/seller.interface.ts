import { SellerType, SellerStatus, MarketplaceCategory } from './enums/marketplace-enums';

/**
 * Seller
 * Marketplace seller/store entity
 */
export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  storeDescription: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  slug: string | null;
  type: SellerType;
  status: SellerStatus;
  
  // Location
  city: string | null;
  country: string | null;
  
  // Verification
  isVerifiedBusiness: boolean;
  
  // Policies
  returnPolicy: string | null;
  returnDays: number;
  acceptsReturns: boolean;
  
  // Stats
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  activeListings: number;
  responseRate: number;
  averageResponseHours: number;
  
  // Categories
  categories: MarketplaceCategory[];
  
  // Badges
  isTopRatedSeller: boolean;
  isPowerSeller: boolean;
  isVerifiedSeller: boolean;
  
  // Timestamps
  createdAt: string;
}

/**
 * Seller Stats
 */
export interface SellerStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  averageRating: number;
  totalReviews: number;
  positiveReviews: number;
  responseRate: number;
  averageResponseHours: number;
}
