import { MarketplaceCategory, SellerType } from '../enums/marketplace-enums';

/**
 * Seller Search Request
 */
export interface SellerSearchRequest {
  keywords: string | null;
  category: MarketplaceCategory | null;
  location: string | null;
  type: SellerType | null;
  minRating: number | null;
  isVerified: boolean | null;
  sortBy: string | null;
  sortDescending: boolean;
  page: number;
  pageSize: number;
}
